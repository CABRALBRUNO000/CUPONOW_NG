import { Injectable } from '@angular/core';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private chatModel!: ChatOpenAI;
  private embeddings: OpenAIEmbeddings;


  constructor() {
    this.initializeChatModel();

    this.embeddings = new OpenAIEmbeddings({
      apiKey: environment.openAiKey.trim(),
      model: 'text-embedding-ada-002' // Modelo específico para embeddings
  });
  }


  
  private initializeChatModel(temperature: number = 0) {
    this.chatModel = new ChatOpenAI({
      openAIApiKey: environment.openAiKey.trim(),
      temperature: temperature,
      modelName: 'gpt-3.5-turbo-1106'
    });
  }

  getChatModel(temperature?: number): ChatOpenAI {
    if (temperature !== undefined) {
      this.initializeChatModel(temperature);
    }
    return this.chatModel;
  }

  getEmbeddings(): OpenAIEmbeddings {
    return this.embeddings;
}
}