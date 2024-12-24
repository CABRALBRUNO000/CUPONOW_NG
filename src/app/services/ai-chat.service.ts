import { Injectable } from '@angular/core';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { Message } from '../models/message.model';
import { Offer } from '../models/offer.model';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { OpenAIService } from './openai.service';
import { KeywordObject } from '../models/keyword.model';
import { RagService } from './rag.service';
import { CHAT_PROMPTS } from './prompts/chat-prompts.config';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ServicoTratamentoErros } from './tratamento-Erros.service';
import { RespostaChat } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private intencaoChain!: ConversationChain;
  private conversaChain!: ConversationChain;
  private palavrasChaveChain!: ConversationChain;
  private memoria!: BufferMemory;
  private historicoDeMensagens: Message[] = [];
  private produtoSubject = new BehaviorSubject<Offer[]>([]);
  produtos$ = this.produtoSubject.asObservable();

  constructor(
    private ragService: RagService,
    private openAIService: OpenAIService,
    private servicoTratamentoErros: ServicoTratamentoErros

  ) {
    this.inicializarLangChain();
  }

  private inicializarLangChain() {

    // Modelo de intenção com temperature mais baixa para respostas mais determinísticas
    const intencaoModel = this.openAIService.getChatModel(0.1);
    const conversaModel = this.openAIService.getChatModel(0.7);
    const palavrasChaveModel = this.openAIService.getChatModel(0.3);

    // Configuração da memória para manter o contexto da conversa
    this.memoria = new BufferMemory({
      returnMessages: true,
      memoryKey: 'history'
    });

    // Criação das cadeias de conversação
    this.palavrasChaveChain = new ConversationChain({
      llm: palavrasChaveModel,
      prompt: CHAT_PROMPTS.palavrasChave
    });

    this.intencaoChain = new ConversationChain({
      llm: intencaoModel,
      memory: this.memoria,
      prompt: CHAT_PROMPTS.intencao
    });

    this.conversaChain = new ConversationChain({
      llm: conversaModel,
      memory: this.memoria,
      prompt: CHAT_PROMPTS.conversacao
    });

  }

  async enviarMensagem(mensagem: string): Promise<RespostaChat> {
    try {
      const respostaIntencao = await this.intencaoChain.call({ input: mensagem });
      const analiseIntencao = respostaIntencao['response'].trim().toUpperCase();

      if (analiseIntencao !== 'SIM' && analiseIntencao !== 'NÃO') {
        throw new Error('Resposta de intenção inválida');
      }

      let resposta: RespostaChat;

      if (analiseIntencao === 'SIM') {
        resposta = await this.processarRequisicaoOferta(mensagem);
      } else {
        const respostaDeConversa = await this.conversaChain.call({ input: mensagem });
        resposta = {
          message: respostaDeConversa['response'],
          products: []
        };
      }

      this.historicoDeMensagens.push(
        { text: mensagem, sender: 'user' },
        { text: resposta.message, sender: 'ai' }
      );

      if (resposta.products.length > 0) {
        const produtosAtuais = this.obterTodosOsProdutos();
        const produtosAtualizados = [...produtosAtuais, ...resposta.products];
        this.definirProdutos(produtosAtualizados);
      }

      return resposta;

    } catch (error) {
      return await firstValueFrom(
        this.servicoTratamentoErros
          .tratarErro(error, 'AiChatService', 'enviarMensagem')
          .pipe(
            catchError(erroTratado => of({
              message: erroTratado.mensagemUsuario || 'Desculpe, ocorreu um erro. Pode tentar novamente?',
              products: this.obterTodosOsProdutos()
            }))
          )
      );
    }
  }


  // private async processarRequisicaoOferta(message: string): Promise<{ message: string; products: Offer[] }> {
  //   try {

  //     const objetoPalavraChave: KeywordObject = await this.extrairPalavrasChave(message);

  //     console.log('Objeto de keywords extraído:', objetoPalavraChave);

  //     const ofertas = await firstValueFrom(this.ragService.obterOfertasRelevantes(message, objetoPalavraChave));

  //     if (ofertas.length === 0) {
  //       return {
  //         message: 'Desculpe, não encontrei ofertas específicas para sua busca. Pode tentar com outros termos?',
  //         products: []
  //       };
  //     }

  //     const responseMessage = this.gerarMensagemRespostaOferta(ofertas);

  //     return {
  //       message: responseMessage,
  //       products: ofertas
  //     };

  //   } catch (error) {
  //     return {
  //       message: 'Encontrei algumas ofertas para você, mas houve um problema ao processá-las.',
  //       products: []
  //     };
  //   }

  // }
  private async processarRequisicaoOferta(message: string): Promise<RespostaChat> {
    try {
      const objetoPalavraChave: KeywordObject = await this.extrairPalavrasChave(message);

      const resultado = await firstValueFrom(this.ragService.obterOfertasRelevantes(message, objetoPalavraChave));

      if (resultado.offers.length === 0) {
        return {
          message: 'Desculpe, não encontrei ofertas específicas para sua busca. Pode tentar com outros termos?',
          products: []
        };
      }
      const ofertasOrdenadas = this.ordenarOfertas(resultado.offers);

      const responseMessage = resultado.isGenericSearch
        ? `Não encontrei ofertas específicas para sua busca, mas encontrei algumas opções relacionadas:\n${this.gerarMensagemRespostaOferta(ofertasOrdenadas)}`
        : this.gerarMensagemRespostaOferta(ofertasOrdenadas);

      return {
        message: responseMessage,
        products: resultado.offers
      };

    } catch (error) {
      return {
        message: 'Encontrei algumas ofertas para você, mas houve um problema ao processá-las.',
        products: []
      };
    }
  }
  private ordenarOfertas(ofertas: Offer[]): Offer[] {
    return ofertas.sort((a, b) => {
      // Primeiro critério: ofertas com desconto vêm primeiro
      if (a.discount > 0 && b.discount === 0) return -1;
      if (a.discount === 0 && b.discount > 0) return 1;
      
      // Segundo critério: entre ofertas com desconto, maior desconto primeiro
      if (a.discount > 0 && b.discount > 0) {
        return b.discount - a.discount;
      }
      
      // Terceiro critério: entre ofertas sem desconto, menor preço primeiro
      return a.price - b.price;
    });
  }

  private gerarMensagemRespostaOferta(offers: Offer[]): string {
    if (offers.length === 0) return 'Não encontrei ofertas correspondentes.';

    const possuiDesconto = offers.some(offer => offer.discount > 0);

    if (!possuiDesconto) {
      const resumoOferta = offers.slice(0, 3).map(offer =>
        `${offer.name} - R$ ${offer.price.toFixed(2)}`
      ).join('\n');

      return `Encontrei os melhores preços disponíveis para você, mesmo sem descontos ativos no momento: ${resumoOferta}. Te ajudo em algo mais ?`;
    }

    const resumoOferta = offers.slice(0, 3).map(offer =>
      `${offer.name} - ${offer.discount}% OFF - Por R$ ${offer.price.toFixed(2)}`
    ).join('\n');

    return `Encontrei algumas ofertas incríveis para você: ${resumoOferta}. Te ajudo em algo mais ?`;
  }

  obterHistoricoMensagens(): Message[] {
    return this.historicoDeMensagens;
  }


  definirHistoricoMensagens(messages: Message[]) {
    this.historicoDeMensagens = messages;
    this.atualizarProdutosDasMensagens();
  }

  private async extrairPalavrasChave(message: string): Promise<KeywordObject> {
    try {
      const resposta = await this.palavrasChaveChain.call({ input: message });

      // Log para debug
      console.log('Resposta do keywordChain:', resposta);

      // Parse o array da resposta
      const arrayPalavrasChave = JSON.parse(resposta['response']);

      // Converta o array para o formato KeywordObject
      return {
        keywords: arrayPalavrasChave,
      };
    } catch (error) {
      throw new Error('Não foi possível processar sua busca. Por favor, tente novamente com termos mais específicos.');
    }
  }

  private atualizarProdutosDasMensagens() {
    let todosOsProdutos: Offer[] = [];
    this.historicoDeMensagens.forEach(message => {
      if ('products' in message && Array.isArray(message.products) && message.products.length > 0) {
        todosOsProdutos.push(...message.products);
      }
    });
    // this.products = allProducts;
  }
  obterTodosOsProdutos(): Offer[] {
    const produtosSalvos = localStorage.getItem('chatProducts');
    if (produtosSalvos) {
      const produtos = JSON.parse(produtosSalvos);
      this.produtoSubject.next(produtos);
      return produtos;
    }
    return this.produtoSubject.getValue();
  }
  definirProdutos(products: Offer[]) {
    this.produtoSubject.next(products);
    localStorage.setItem('chatProducts', JSON.stringify(products));
  }

  limparProdutos() {
    this.produtoSubject.next([]);
    localStorage.removeItem('chatProducts');
  }
}
