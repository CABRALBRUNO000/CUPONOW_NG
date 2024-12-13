import { Injectable } from '@angular/core';
import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { Message } from '../models/message.model';
import { Offer } from '../models/offer.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { LoggerService } from './logger.service';
import { LomadeeService } from './lomadee.service';
import { RagService } from './rag.service';
import { OpenAIService } from './openai.service';


@Injectable({
  providedIn: 'root'
})
export class AiChatMobileService {
  private model!: ChatOpenAI;
  private intentChain!: ConversationChain;
  private conversationChain!: ConversationChain;
  private memory!: BufferMemory;
  private messageHistory: Message[] = [];
  private offers: Offer[] = [];
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

  this.model = this.openAIService.getChatModel(0.7);

    // Template de prompt para identificação de intenção de ofertas
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

    // Template de prompt para conversa principal
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
    this.intentChain = new ConversationChain({
      llm: this.model,
      memory: this.memory,
      prompt: intentPromptTemplate
    });

    this.conversationChain = new ConversationChain({
      llm: this.model,
      memory: this.memory,
      prompt: conversationPromptTemplate
    });

    this.logger.debug('Chains e templates configurados');
    this.logger.info('LangChain inicializado com sucesso');
  }

  async sendMessage(message: string): Promise<{ message: string; products: Offer[] }> {
    this.logger.info('Processando mensagem:', message);

    try {
      const intentResponse = await this.intentChain.call({ input: message });
      const intentAnalysis = intentResponse['response'];
      this.logger.debug('Análise de intenção:', intentAnalysis);

      let response: { message: string; products: Offer[] };

      if (intentAnalysis.startsWith('SIM')) {
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
      const keywordPrompt =  `Analise esta mensagem: "${message}"
      Extraia apenas UMA palavra-chave principal que melhor representa o produto ou categoria desejada.
      Regras:
      - Retorne apenas uma única palavra
      - Use sempre o singular (ex: tênis, celular, camiseta, notebook)
      - Sem pontuação
      - Sem artigos ou preposições
      - Sem explicações adicionais
      - Ignorar palavras como "oferta", "desconto", "promoção"
      - Foque no produto/categoria principal
    
      Exemplo:
      Mensagem: "quero ver ofertas de tênis nike"
      Resposta: tênis
    
      Mensagem: "procuro promoções de celulares"
      Resposta: celular
      
      Mensagem: "quero comprar camisetas"
      Resposta: camiseta`;

      const keywordResponse = await this.model.call([{ type: 'human', content: keywordPrompt }]);
      const keyword = keywordResponse.content.toString().trim();
      console.log('Palavra-chave extraída:', keyword);

      const offers = await firstValueFrom(this.ragService.getRelevantOffers(message, keyword));
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
