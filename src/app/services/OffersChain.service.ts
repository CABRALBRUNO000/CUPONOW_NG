
import { Injectable } from '@angular/core';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { Offer } from '../models/offer.model';
import { environment } from '../../environments/environment';
import { Message } from '../models/message.model';

interface OffersResponse {
  message: string;
  products: Offer[];
}

@Injectable({
  providedIn: 'root'
})
export class OffersChainService {
  private chatModel: ChatOpenAI;
  private systemMessage: SystemMessage;

  constructor() {
    this.chatModel = new ChatOpenAI({
      openAIApiKey: environment.openAiKey,
      temperature: 0.7,
      modelName: 'gpt-3.5-turbo-1106'
    });

    this.systemMessage = new SystemMessage(
      `Quando o usuário solicitar ofertas, você DEVE retornar uma resposta no seguinte formato JSON:
      {
          "message": "sua mensagem amigável para o usuário",
          "products": [
              {
                "id": "id do produto",
                "product": "nome do produto",
                "description": "descricao do produto",
                "imageUrl": "url da imagem do produto",
                "originalPrice": "preco original do produto",
                "discountedPrice": "preco com desconto do produto"
              }
          ]
      }
      Sempre inclua todos os campos necessários para cada produto.
      Mantenha este formato JSON para garantir que os produtos sejam exibidos corretamente.`
    );
  }

  async processMessage(message: string, messageHistory: Message[]): Promise<OffersResponse> {
    try {
      const response = await this.chatModel.invoke([
        this.systemMessage,
        new HumanMessage(`Busque ofertas relacionadas a: ${message}.`)
      ]);
      
      const parsedResponse = JSON.parse(response.content as string);
      return {
        message: parsedResponse.message,
        products: parsedResponse.products
      };
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      return {
        message: 'Desculpe, não consegui processar sua solicitação.',
        products: []
      };
    }
  }
}
