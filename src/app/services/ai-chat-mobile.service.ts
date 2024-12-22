import { Injectable } from '@angular/core';
import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { Message } from '../models/message.model';
import { Offer } from '../models/offer.model';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { LoggerService } from './logger.service';

import { OpenAIService } from './openai.service';
import { KeywordObject } from '../models/keyword.model';
import { RagService } from './rag.service';

@Injectable({
  providedIn: 'root'
})
export class AiChatMobileService {
  private intentChain!: ConversationChain;
  private conversationChain!: ConversationChain;
  private keywordChain!: ConversationChain;
  private memory!: BufferMemory;
  private messageHistory: Message[] = [];
  private productsSubject = new BehaviorSubject<Offer[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(
    private logger: LoggerService,
    private ragService: RagService,
    private openAIService: OpenAIService
  ) {
    this.initializeLangChain();
    this.logger.info('AiChatMobileService inicializado');
  }

  private initializeLangChain() {
    this.logger.info('Iniciando configuração do LangChain');

    // Modelo de intenção com temperature mais baixa para respostas mais determinísticas
    const intentModel = this.openAIService.getChatModel(0.1);
    const conversationModel = this.openAIService.getChatModel(0.7);
    const keywordModel = this.openAIService.getChatModel(0.3);

    // Template de prompt para identificação de intenção de ofertas com instruções mais rígidas
    const intentPromptTemplate = ChatPromptTemplate.fromMessages([
      ['system', `Você é um assistente especializado em detectar intenções de compra e busca por produtos.
Identifique quando o usuário:
- Menciona produtos específicos
- Solicita recomendações de produtos
- Busca por ofertas ou descontos
- Faz perguntas sobre preços
  
Responda 'SIM' quando detectar qualquer uma dessas intenções.
Responda 'NÃO' apenas para mensagens sem relação com produtos ou compras.`],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);
    const keywordPromptTemplate = ChatPromptTemplate.fromMessages([
      ['system', `Você é um assistente especializado em extrair palavras-chave de buscas.
    
    REGRAS:
    1. Analise a mensagem do usuário
    2. Retorne um array com exatamente 4 strings:
       - Primeira posição: palavra principal no singular
       - Demais posições: 3 frases alternativas de busca relacionadas
    
    EXEMPLOS:
    
    Usuário: "quero comprar tênis nike"
    Resposta: ["tênis", "tênis nike", "calçado esportivo", "tênis para corrida"]
    
    Usuário: "preciso de ofertas de jogo de panelas"
    Resposta: ["panela", "jogo de panelas", "kit de panelas", "panelas de cozinha"]
    
    Importante: Sempre retorne apenas o array, sem explicações adicionais.`],
      ['human', '{input}']
    ]);



    const conversationPromptTemplate = ChatPromptTemplate.fromMessages([
      ['system', `Você é um assistente de IA especializado em encontrar ofertas.
  Mantenha sempre o contexto da conversa anterior ao sugerir novos produtos.
  Analise o histórico completo para entender o tema/categoria que o usuário está interessado.
  Suas respostas devem ser em português do Brasil de forma amigável e direta.`],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);

    // Configuração da memória para manter o contexto da conversa
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: 'history'
    });

    // Criação das cadeias de conversação
    this.keywordChain = new ConversationChain({
      llm: keywordModel,
      prompt: keywordPromptTemplate
    });

    this.intentChain = new ConversationChain({
      llm: intentModel,
      memory: this.memory,
      prompt: intentPromptTemplate
    });

    this.conversationChain = new ConversationChain({
      llm: conversationModel,
      memory: this.memory,
      prompt: conversationPromptTemplate
    });

    this.logger.debug('Chains e templates configurados');
    this.logger.info('LangChain inicializado com sucesso');
  }

  async sendMessage(message: string): Promise<{ message: string; products: Offer[] }> {
    this.logger.info('Processando mensagem:', message);

    try {
      // Adicionar log detalhado para debug
      const intentResponse = await this.intentChain.call({ input: message });
      const intentAnalysis = intentResponse['response'].trim().toUpperCase();
      this.logger.debug('Análise de intenção:', intentAnalysis);

      // Validação explícita da resposta
      if (intentAnalysis !== 'SIM' && intentAnalysis !== 'NÃO') {
        throw new Error('Resposta de intenção inválida');
      }

      let response: { message: string; products: Offer[] };

      if (intentAnalysis === 'SIM') {
        this.logger.info('Intenção de oferta detectada');
        response = await this.processOfferRequest(message);
      } else {
        this.logger.info('Processando mensagem sem intenção de oferta');
        const conversationResponse = await this.conversationChain.call({ input: message });
        response = {
          message: conversationResponse['response'],
          products: []
        };
      }

      this.messageHistory.push(
        { text: message, sender: 'user' },
        { text: response.message, sender: 'ai' }
      );

      if (response.products.length > 0) {
        const currentProducts = this.getAllProducts();
        const updatedProducts = [...currentProducts, ...response.products];
        this.setProducts(updatedProducts);
        this.logger.info('Produtos atualizados', { quantidade: updatedProducts.length });
      }

      return response;
    } catch (error) {
      this.logger.error('Erro ao processar mensagem:', error);
      return {
        message: 'Desculpe, ocorreu um erro. Pode tentar novamente?',
        products: this.getAllProducts()
      };
    }
  }

  private async processOfferRequest(message: string): Promise<{ message: string; products: Offer[] }> {
    try {
      // Primeiro, vamos usar o modelo para extrair a palavra-chave da mensagem
      // const keywordPrompt = `Analise esta mensagem: "${message}"
      // Extraia apenas UMA palavra-chave principal que melhor representa o produto ou categoria desejada.
      // Regras:
      // - Retorne apenas uma única palavra
      // - Use sempre o singular (ex: tênis, celular, camiseta, notebook)
      // - Sem pontuação
      // - Sem artigos ou preposições
      // - Sem explicações adicionais
      // - Ignorar palavras como "oferta", "desconto", "promoção"
      // - Foque no produto/categoria principal

      // Exemplo:
      // Mensagem: "quero ver ofertas de tênis nike"
      // Resposta: tênis

      // Mensagem: "procuro promoções de celulares"
      // Resposta: celular

      // Mensagem: "quero comprar camisetas"
      // Resposta: camiseta`;

      // const keywordResponse = await this.model.call([{ type: 'human', content: keywordPrompt }]);
      const keywordObject: KeywordObject = await this.extractKeywords(message);

      console.log('Objeto de keywords extraído:', keywordObject);

      const offers = await firstValueFrom(this.ragService.obterOfertasRelevantes(message, keywordObject));
      this.logger.info('Ofertas encontradas via RAG:', offers.length);

      if (offers.length === 0) {
        return {
          message: 'Desculpe, não encontrei ofertas específicas para sua busca. Pode tentar com outros termos?',
          products: []
        };
      }

      // Gerar mensagem de resposta com as ofertas encontradas
      const responseMessage = this.generateOfferResponseMessage(offers);

      return {
        message: responseMessage,
        products: offers
      };

    } catch (error) {
      this.logger.error('Erro ao processar ofertas:', error);
      return {
        message: 'Encontrei algumas ofertas para você, mas houve um problema ao processá-las.',
        products: []
      };
    }

  }
  private generateOfferResponseMessage(offers: Offer[]): string {
    if (offers.length === 0) return 'Não encontrei ofertas correspondentes.';

    const hasAnyDiscount = offers.some(offer => offer.discount > 0);

    if (!hasAnyDiscount) {
      const offerSummary = offers.slice(0, 3).map(offer =>
        `${offer.name} - R$ ${offer.price.toFixed(2)}`
      ).join('\n');

      return `Encontrei os melhores preços disponíveis para você, mesmo sem descontos ativos no momento: ${offerSummary}. Te ajudo em algo mais ?`;
    }

    const offerSummary = offers.slice(0, 3).map(offer =>
      `${offer.name} - ${offer.discount}% OFF - Por R$ ${offer.price.toFixed(2)}`
    ).join('\n');

    return `Encontrei algumas ofertas incríveis para você: ${offerSummary}. Te ajudo em algo mais ?`;
  }
  // Método para recuperar histórico de mensagens
  getMessageHistory(): Message[] {
    return this.messageHistory;
  }


  setMessageHistory(messages: Message[]) {
    this.messageHistory = messages;
    this.updateProductsFromMessages();
  }
  // private async extractKeywords(message: string): Promise<KeywordObject> {
  //   try {
  //     const response = await this.keywordChain.call({ input: message });

  //     // Log para ver a resposta exata
  //     console.log('Resposta do keywordChain:', response);

  //     // Tente parsear a resposta como JSON
  //     // Remova qualquer texto antes ou depois do JSON
  //     const jsonMatch = response['response'].match(/\{.*\}/s);

  //     if (!jsonMatch) {
  //       this.logger.error('Resposta não contém JSON válido:', response['response']);
  //       throw new Error('Formato de resposta inválido');      }

  //     const keywords = JSON.parse(jsonMatch[0]);

  //     if (!keywords.keyword || !keywords.keyphrase || !Array.isArray(keywords.keyphrase)) {
  //       throw new Error('Estrutura de keywords inválida');
  //     }

  //     return keywords;
  //   } catch (error) {
  //     this.logger.error('Erro ao extrair keywords:', error);

  //     // Retorne um objeto de keywords padrão em caso de erro
  //     return {
  //       keyword: 'produto',
  //       keyphrase: [message, message, message]
  //     };
  //   }
  // }

  private async extractKeywords(message: string): Promise<KeywordObject> {
    try {
      const response = await this.keywordChain.call({ input: message });

      // Log para debug
      console.log('Resposta do keywordChain:', response);

      // Parse o array da resposta
      const keywordArray = JSON.parse(response['response']);

      // Converta o array para o formato KeywordObject
      return {
        keywords: keywordArray,
      };
    } catch (error) {
      this.logger.error('Erro ao extrair keywords:', error);
      throw new Error('Não foi possível processar sua busca. Por favor, tente novamente com termos mais específicos.');
    }
  }

  private updateProductsFromMessages() {
    let allProducts: Offer[] = [];
    this.messageHistory.forEach(message => {
      if ('products' in message && Array.isArray(message.products) && message.products.length > 0) {
        allProducts.push(...message.products);
      }
    });
    // this.products = allProducts;
  }
  getAllProducts(): Offer[] {
    const savedProducts = localStorage.getItem('chatProducts');
    if (savedProducts) {
      const products = JSON.parse(savedProducts);
      this.productsSubject.next(products);
      return products;
    }
    return this.productsSubject.getValue();
  }
  setProducts(products: Offer[]) {
    this.productsSubject.next(products);
    localStorage.setItem('chatProducts', JSON.stringify(products));
  }

  clearProducts() {
    this.productsSubject.next([]);
    localStorage.removeItem('chatProducts');
  }
}
