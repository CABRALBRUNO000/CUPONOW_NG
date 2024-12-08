import { Injectable } from '@angular/core';
import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { Message } from '../models/message.model';
import { Offer } from '../models/offer.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from './logger.service';

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
    constructor(private logger: LoggerService) {
      this.initializeLangChain();
      this.logger.info('AiChatMobileService inicializado');
    }

    private initializeLangChain() {
      this.logger.info('Iniciando configuração do LangChain');
  
      this.model = new ChatOpenAI({
        openAIApiKey: environment.openAiKey.trim(),
        temperature: 0.7,
        modelName: 'gpt-3.5-turbo-1106'
      });

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
      const previousContext = this.messageHistory
      .slice(-2)
      .map(m => m.text)
      .join('\n');
      // Prompt para geração de ofertas
      const offerPrompt = `Considerando o contexto anterior da conversa: "${previousContext}"
  Gere um array JSON de ofertas relacionadas ao mesmo tema/categoria. O array JSON precisa ter no minimo 3  e no maixomo 10 ofertas com base na seguinte solicitação: "${message}". 
      Use o formato:
      [
        {
          "id": "id do produto",
          "product": "nome do produto",
          "description": "descrição curta",
          "imageUrl": "url da imagem do produto",
          "originalPrice": número,
          "discountedPrice": número, 
          "productUrl": "url do produto ou oferta";
          "cuponCode": "string com o codigo do cupon"
        }
      ]

    getAllProducts(): Offer[] {
      const savedProducts = localStorage.getItem('chatProducts');
      if (savedProducts) {
        const products = JSON.parse(savedProducts);
        this.productsSubject.next(products);
        this.logger.debug('Produtos carregados do localStorage', { quantidade: products.length });
        return products;
      }
      return this.productsSubject.getValue();
    }

    setProducts(products: Offer[]) {
      this.logger.debug('Salvando produtos', { quantidade: products.length });
      this.productsSubject.next(products);
      localStorage.setItem('chatProducts', JSON.stringify(products));
    }

    clearProducts() {
      this.logger.info('Limpando lista de produtos');
      this.productsSubject.next([]);
      localStorage.removeItem('chatProducts');
    }
    Certifique-se de que os produtos sejam relevantes para a solicitação.`;

    const offerResponse = await this.model.call([{ type: 'human', content: offerPrompt }]);

    try {
      // Parsear a resposta JSON
      const offers: Offer[] = JSON.parse(typeof offerResponse.content === 'string' 
        ? offerResponse.content.trim() 
        : JSON.stringify(offerResponse.content)
      );

      // Montar mensagem de resposta
      const responseMessage = this.generateOfferResponseMessage(offers);

      // Atualizar ofertas
      this.offers = [...this.offers, ...offers];

      return {
        message: responseMessage,
        products: offers
      };
    } catch (error) {
      console.error('Erro ao gerar ofertas:', error);
      return {
        message: 'Desculpe, não consegui encontrar ofertas no momento.',
        products: []
      };
    }
  }

  private generateOfferResponseMessage(offers: Offer[]): string {
    if (offers.length === 0) return 'Não encontrei ofertas correspondentes.';

    const offerSummary = offers.map(offer => 
      `${offer.product} - De R${offer.originalPrice} por R${offer.discountedPrice}`
    ).join(', ');

    return `Encontrei algumas ofertas incríveis para você: ${offerSummary}. Quer saber mais detalhes?`;
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