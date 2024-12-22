import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ChatOpenAI } from '@langchain/openai';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from 'langchain/document';

import { LomadeeService } from './lomadee.service';
import { OpenAIService } from './openai.service';
import { Offer } from '../models/offer.model';
import { LomadeeResponse } from '../models/lomadee.model';

@Injectable({
    providedIn: 'root'
})
export class RagService {
    private chatModel: ChatOpenAI;
    private embeddings: OpenAIEmbeddings;
    private textSplitter: RecursiveCharacterTextSplitter;

    constructor(
        private lomadeeService: LomadeeService,
        private openAIService: OpenAIService
    ) {
        this.chatModel = this.openAIService.getChatModel();
        this.embeddings = this.openAIService.getEmbeddings();
        this.textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 50
        });
    }

    // Método para preparar documentos com contexto enriquecido
    private async prepareDocuments(offers: Offer[]): Promise<Document[]> {
        const documentsPromises = offers.map(async (offer) => {
            const enrichedContent = this.createEnrichedOfferContent(offer);
            const splitDocuments = await this.textSplitter.createDocuments([enrichedContent]);
            
            return splitDocuments.map(doc => new Document({
                pageContent: doc.pageContent,
                metadata: {
                    offerId: offer.id,
                    name: offer.name,
                    price: offer.price,
                    discount: offer.discount,
                    category: offer.category?.name,
                    store: offer.store?.name
                }
            }));
        });

        const nestedDocuments = await Promise.all(documentsPromises);
        return nestedDocuments.flat();
    }

    // Cria conteúdo enriquecido para melhor recuperação
    private createEnrichedOfferContent(offer: Offer): string {
        return `
            Oferta detalhada: ${offer.name}
            Descrição completa para busca semântica
            Categoria: ${offer.category?.name || 'Não informada'}
            Preço original: R$ ${offer.priceFrom || 'N/A'}
            Preço atual: R$ ${offer.price}
            Desconto: ${offer.discount}%
            Loja: ${offer.store?.name || 'Não informada'}
            Parcelamento: ${offer.installment?.quantity}x de R$ ${offer.installment?.value}
            Palavras-chave: ${this.extractKeywords(offer)}
        `;
    }

    // Extrai palavras-chave da oferta
    private extractKeywords(offer: Offer): string {
        const keywords = [
            offer.name,
            offer.category?.name,
            offer.store?.name,
            offer.advertiserCategory
        ].filter(Boolean).join(' ');
        return keywords;
    }

    // Método principal de RAG
    public getRelevantOffers(userMessage: string, keyword: string): Observable<Offer[]> {
        return this.lomadeeService.searchOffers(keyword).pipe(
            switchMap(async (lomadeeResponse: LomadeeResponse) => {
                // Prepara documentos com contexto
                const documents = await this.prepareDocuments(lomadeeResponse.offers);
                
                // Cria vector store
                const vectorStore = await MemoryVectorStore.fromDocuments(
                    documents, 
                    this.embeddings
                );

                // Realiza busca semântica
                const similarDocs = await vectorStore.similaritySearch(userMessage, 5);
                
                // Extrai ofertas dos documentos similares
                const relevantOfferIds = Array.from(
                    new Set(similarDocs.map(doc => doc.metadata['offerId']))
                );

                // Filtra ofertas originais
                const relevantOffers = lomadeeResponse.offers.filter(offer => 
                    relevantOfferIds.includes(offer.id)
                );

                // Se não encontrar ofertas relevantes, retorna as 5 primeiras
                return relevantOffers.length > 0 
                    ? relevantOffers 
                    : lomadeeResponse.offers.slice(0, 5);
            })
        );
    }
}