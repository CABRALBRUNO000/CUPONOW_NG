import { Injectable } from '@angular/core'
import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { Message } from '../models/message.model';
import { Offer } from '../models/offer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private model!: ChatOpenAI;
  private chain!: ConversationChain;
  private memory!: BufferMemory;
  private messageHistory: Message[] = [];
  private offers: Offer[] = []

  constructor() {
    this.initializeLangChain();
  }

  private initializeLangChain() {
    // Configuração do modelo OpenAI
    this.model = new ChatOpenAI({
      openAIApiKey: environment.openAiKey,
      temperature: 0.7,
      modelName: 'gpt-3.5-turbo-1106'
    });

    // Template de prompt personalizado
    const chatPrompt = ChatPromptTemplate.fromMessages([
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

    // Criação da cadeia de conversação
    this.chain = new ConversationChain({
      llm: this.model,
      memory: this.memory,
      prompt: chatPrompt
    });
  }

  async sendMessage(message: string): Promise<{ message: string; products: Offer[] }> {
    try {
      // Executar a cadeia de conversação
      const response = await this.chain.call({ input: message });

      // Verificar se a mensagem menciona ofertas
      const offerKeywords = ['oferta', 'desconto', 'promoção', 'preço', 'produto'];
      const hasOfferIntent = offerKeywords.some(keyword =>
        message.toLowerCase().includes(keyword)
      );

      // Lógica para gerar ofertas se houver intenção relacionada
      let newOffers: Offer[] = [];
      if (hasOfferIntent) {
        newOffers = await this.generateOffers(response['response']);
      }

      // Concatenar as novas ofertas com as ofertas existentes
      this.offers = [...this.offers, ...newOffers];

      // Salvar histórico de mensagens
      this.messageHistory.push(
        { text: message, sender: 'user' },
        { text: response['response'], sender: 'ai' }
      );

      return {
        message: response['response'],
        products: this.offers // Retornar todas as ofertas
      };
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      return {
        message: 'Desculpe, ocorreu um erro. Pode tentar novamente?',
        products: this.offers // Retorne as ofertas existentes em caso de erro
      };
    }
  }  private async generateOffers(context: string): Promise<Offer[]> {
    // Prompt para geração de ofertas baseado no contexto
    const offerPrompt = `Baseado no seguinte contexto: "${context}", 
    gere um array JSON de 3 ofertas em formato de objeto com as seguintes propriedades:
    product (string): Nome do produto
    description (string): Descrição curta
    originalPrice (number): Preço original
    discountedPrice (number): Preço com desconto
    imageUrl (string): URL de imagem do produto
    Exemplo de resposta:
    [
      {
        "id": "id do produto",
        "product": "nome do produto",
        "description": "descricao do produto",
        "imageUrl": "url da imagem do produto",
        "originalPrice": "preco original do produto",
        "discountedPrice": "preco com desconto do produto"
      }
    ]`;

    const offerResponse = await this.model.call([{ type: 'human', content: offerPrompt }]);

    try {
      // Tentar parsear a resposta como JSON
      const offers: Offer[] = JSON.parse(typeof offerResponse.content === 'string' ? offerResponse.content.trim() : JSON.stringify(offerResponse.content));
      return offers;
    } catch (error) {
      console.error('Erro ao gerar ofertas:', error);
      return [];
    }

  }  // Método para recuperar histórico de mensagens
  getMessageHistory(): Message[] {
    return this.messageHistory;
  }
  setOffers(offers: Offer[]) {
  this.offers = offers;
}
}


