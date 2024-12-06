import { Injectable } from '@angular/core';
import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { Message } from '../models/message.model';
import { Offer } from '../models/offer.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

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


  constructor() {
    this.initializeLangChain();
  }

  private initializeLangChain() {
    // Configuração do modelo OpenAI
    this.model = new ChatOpenAI({
      openAIApiKey: environment.openAiKey.trim(),
      temperature: 0.7,
      modelName: 'gpt-3.5-turbo-1106'
    });

    // Template de prompt para identificação de intenção de ofertas
    const intentPromptTemplate = ChatPromptTemplate.fromMessages([
      ['system', `Você é um assistente de IA especializado em detectar intenções relacionadas a ofertas de produtos. 
      Sua tarefa é analisar a mensagem do usuário e determinar se ele está buscando ofertas.
      Responda apenas com 'SIM' ou 'NÃO' seguido de uma breve justificativa.
      
      Exemplos:
      - "Quero comprar um smartphone barato" -> SIM: Busca clara por ofertas de produtos
      - "Como está o tempo hoje?" -> NÃO: Sem relação com compras ou ofertas
      - "Encontre os melhores descontos em eletrônicos" -> SIM: Pedido direto de ofertas`],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);

    // Template de prompt para conversa principal
    const conversationPromptTemplate = ChatPromptTemplate.fromMessages([
      ['system', `Você é um assistente de IA especializado em encontrar ofertas. 
      Sua tarefa é ajudar os usuários a encontrar os melhores produtos com os melhores preços. 
      Responda de forma amigável e direta.`],
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
  }

  async sendMessage(message: string): Promise<{ message: string; products: Offer[] }> {
    try {
      // Verificar a intenção de oferta usando a intent chain
      const intentResponse = await this.intentChain.call({ input: message });
      const intentAnalysis = intentResponse['response'];

      let response: { message: string; products: Offer[] };

      // Se a intenção for de oferta, gerar produtos
      if (intentAnalysis.startsWith('SIM')) {
        response = await this.processOfferRequest(message);
      } else {
        // Usar a cadeia de conversação padrão
        const conversationResponse = await this.conversationChain.call({ input: message });
        response = {
          message: conversationResponse['response'],
          products: []
        };
      }

      // Salvar histórico de mensagens
      this.messageHistory.push(
        { text: message, sender: 'user' },
        { text: response.message, sender: 'ai' }
      );

      // Adicionar persistência após processar a resposta
      if (response.products.length > 0) {
        const currentProducts = this.getAllProducts();
        const updatedProducts = [...currentProducts, ...response.products];
        this.setProducts(updatedProducts);
      }

      return response;
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      return {
        message: 'Desculpe, ocorreu um erro. Pode tentar novamente?',
        products: this.getAllProducts() // Usar produtos salvos
      };
    }
  }

  private async processOfferRequest(message: string): Promise<{ message: string; products: Offer[] }> {
    // Prompt para geração de ofertas
    const offerPrompt = `Gere um array JSON de  no minimo 3  e no maixomo 10 ofertas com base na seguinte solicitação: "${message}". 
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