import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadQAChain } from 'langchain/chains';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { Document } from 'langchain/document';
import { LomadeeService } from './lomadee.service';
import { firstValueFrom } from 'rxjs';
import { Category, CategoryResponse } from '../interfaces/category.interface';
import { Offer } from '../models/offer.model';
import { LomadeeResponse } from '../models/lomadee.model';
import { OpenAIService } from './openai.service';

@Injectable({
    providedIn: 'root'
})
export class RagService {
    private jsonData: LomadeeResponse;
    private chain: any;

    constructor(
        private lomadeeService: LomadeeService,
        private openAIService: OpenAIService

    ) {
        this.jsonData = {} as LomadeeResponse;
        this.setupQuestionAnsweringChain();
    }

    private setupQuestionAnsweringChain(): void {
        const llm = this.openAIService.getChatModel();
        const prompt = new PromptTemplate({
            template: `Analise a mensagem do usuário: "{userMessage}"
                    
            A partir das ofertas fornecidas, identifique as 5 mais relevantes considerando:
            1. Correspondência com a necessidade expressa pelo usuário
            2. Maior percentual de desconto
            3. Melhor preço final
            
            Retorne um array com as ofertas seguindo exatamente esta estrutura:
            [{{
                "id": "string",
                "name": "string",
                "category": {{
                    "id": "number",
                    "name": "string",
                    "link": "string"
                }},
                "link": "string",
                "thumbnail": "string",
                "price": "number",
                "priceFrom": "number",
                "discount": "number",
                "installment": {{
                    "quantity": "number",
                    "value": "number"
                }},
                "store": {{
                    "id": "number",
                    "name": "string",
                    "thumbnail": "string",
                    "link": "string",
                    "invisible": "boolean",
                    "needPermission": "boolean"
                }},
                "advertiserCategory": "string"
            }}]`,
            inputVariables: ['userMessage']
        });
        
        this.chain = loadQAChain(llm, {
            type: 'map_reduce',
            combineMapPrompt: prompt,
            combinePrompt: prompt
        });
    }

    public async getRelevantOffers(userMessage: string, keyword: string): Promise<Offer[]> {
        this.jsonData = await firstValueFrom(this.lomadeeService.searchOffers(keyword));

        const documents = this.jsonData.offers.map(offer => new Document({ pageContent: JSON.stringify(offer) }));
        const result = await this.chain.call({ userMessage, input_documents: documents });
        const parsedResults = JSON.parse(result.answer) as Offer[];
        return parsedResults.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }
}