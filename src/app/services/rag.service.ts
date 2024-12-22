import { Injectable } from '@angular/core';
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";
import { Observable, firstValueFrom, from } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Offer } from '../models/offer.model';
import { KeywordObject } from '../models/keyword.model';
import { LomadeeService } from './lomadee.service';
import { LoggerService } from './logger.service';
import { ServicoTratamentoErros } from './tratamentoErros.service';
import { environment } from '../../environments/environment';
import { LomadeeResponse } from '../models/lomadee.model';

@Injectable({
    providedIn: 'root'
})
export class RagService {
    private readonly LIMITE_OFERTAS = 500;
    private readonly LIMITE_RESULTADOS = 20;
    private readonly LIMITE_OFERTAS_FINAIS = 5;

    private embeddings!: HuggingFaceInferenceEmbeddings;
    private divisorTexto!: RecursiveCharacterTextSplitter;

    constructor(
        private servicoLomadee: LomadeeService,
        private servicoLog: LoggerService,
        private servicoErros: ServicoTratamentoErros
    ) {
        this.inicializarServico();
    }

    private async inicializarServico(): Promise<void> {
        try {
            if (!environment.HUGGINGFACE_API_KEY) {
                throw {
                    isBusinessError: true,
                    message: 'Chave da API HuggingFace não configurada'
                };
            }

            this.embeddings = new HuggingFaceInferenceEmbeddings({
                model: "sentence-transformers/all-MiniLM-L6-v2",
                apiKey: environment.HUGGINGFACE_API_KEY
            });

            this.divisorTexto = new RecursiveCharacterTextSplitter({
                chunkSize: 250,
                chunkOverlap: 100,
                separators: ["\n\n", "\n", " ", "", "|"]
            });
        } catch (erro) {
            throw this.servicoErros.tratarErro(erro, 'RagService', 'inicializarServico');
        }
    }

    public obterOfertasRelevantes(mensagemUsuario: string, objetoPalavrasChave: KeywordObject): Observable<Offer[]> {
        try {
            if (!mensagemUsuario || !objetoPalavrasChave?.keywords?.length) {
                throw {
                    name: 'ValidationError',
                    message: 'Mensagem do usuário e palavras-chave são obrigatórias'
                };
            }

            return from(this.obterTodasOfertas(objetoPalavrasChave)).pipe(
                mergeMap(ofertas => from(this.processarEFiltrarOfertas(ofertas, mensagemUsuario))),
                catchError(erro => this.servicoErros.tratarErro(erro, 'RagService', 'obterOfertasRelevantes'))
            );
        } catch (erro) {
            return this.servicoErros.tratarErro(erro, 'RagService', 'obterOfertasRelevantes');
        }
    }

    private async buscarOfertasPorPalavrasChave(palavrasChave: string[]): Promise<LomadeeResponse[]> {
        try {
            if (!palavrasChave?.length) {
                throw {
                    isBusinessError: true,
                    message: 'Lista de palavras-chave vazia'
                };
            }

            const respostas: LomadeeResponse[] = [];
            const ofertasVistas = new Set<string>();
            const palavrasChaveValidas: string[] = [];

            for (const palavraChave of palavrasChave) {
                try {
                    const resposta = await firstValueFrom(
                        this.servicoLomadee.searchOffers(palavraChave, 1)
                    );

                    if (resposta.offers?.length > 0) {
                        palavrasChaveValidas.push(palavraChave);
                        respostas.push(resposta);
                    }
                } catch (erro) {
                    if (erro instanceof HttpErrorResponse) {
                        // Se for erro 404, apenas continua o loop
                        if (erro.status === 404) {
                            continue;
                        }
                        // Para outros erros HTTP, lança exceção
                        throw {
                            isExternalServiceError: true,
                            message: `Falha na API Lomadee: ${erro.message}`,
                            originalError: erro
                        };
                    }
                    throw erro;
                }
            }

            if (palavrasChaveValidas.length === 0) {
                throw {
                    isBusinessError: true,
                    message: 'Nenhuma palavra-chave válida encontrada'
                };
            }

            return respostas;
        } catch (erro) {
            throw this.servicoErros.tratarErro(erro, 'RagService', 'buscarOfertasPorPalavrasChave');
        }
    }

    private async processarEFiltrarOfertas(offers: Offer[], userMessage: string): Promise<Offer[]> {
        try {
            if (!offers?.length) {
                throw {
                    isBusinessError: true,
                    message: 'Nenhuma oferta disponível para processamento'
                };
            }

            const documents = await this.prepararDocumentos(offers);
            const vectorStore = await MemoryVectorStore.fromDocuments(documents, this.embeddings);
            const similarDocs = await vectorStore.similaritySearch(userMessage, this.LIMITE_RESULTADOS);

            if (!similarDocs?.length) {
                throw {
                    isBusinessError: true,
                    message: 'Não foram encontradas ofertas relevantes'
                };
            }

            const scoredOffers = this.calcularPontuacaoOfertas(offers, similarDocs, userMessage);
            return this.ordenarELimitarOfertas(scoredOffers);

        } catch (erro: unknown) {
            if (erro instanceof Error && erro.name === 'HuggingFaceError') {
                throw {
                    isExternalServiceError: true,
                    message: 'Falha no serviço de embeddings HuggingFace',
                    originalError: erro
                };
            }
            throw this.servicoErros.tratarErro(erro, 'RagService', 'processarEFiltrarOfertas');
        }
    }

    private async prepararDocumentos(offers: Offer[]): Promise<Document[]> {
        try {
            if (!offers?.length) {
                throw {
                    name: 'ValidationError',
                    message: 'Lista de ofertas vazia para preparação de documentos'
                };
            }

            const documentsPromises = offers.map(async (offer) => {
                const enrichedContent = this.createEnrichedOfferContent(offer);
                const splitDocuments = await this.divisorTexto.createDocuments([enrichedContent]);

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

        } catch (erro) {
            throw this.servicoErros.tratarErro(erro, 'RagService', 'prepararDocumentos');
        }
    }

    private calcularPontuacaoOfertas(offers: Offer[], similarDocs: Document[], userMessage: string) {
        try {
            return similarDocs
                .map(doc => {
                    const offer = offers.find(o => o.id === doc.metadata["offerId"]);
                    if (!offer) return null;

                    return {
                        offer,
                        score: this.calcularPontuacaoDeRelevancia(offer, userMessage, doc)
                    };
                })
                .filter(item => item !== null);
        } catch (erro) {
            throw this.servicoErros.tratarErro(erro, 'RagService', 'calcularPontuacaoOfertas');
        }
    }

    private ordenarELimitarOfertas(scoredOffers: any[]) {
        try {
            return scoredOffers
                .sort((a, b) => b!.score - a!.score)
                .slice(0, this.LIMITE_OFERTAS_FINAIS)
                .map(item => item!.offer);
        } catch (erro) {
            throw this.servicoErros.tratarErro(erro, 'RagService', 'ordenarELimitarOfertas');
        }
    }

    private async obterTodasOfertas(objetoPalavrasChave: KeywordObject): Promise<Offer[]> {
        const respostas = await this.buscarOfertasPorPalavrasChave(objetoPalavrasChave.keywords);
        const todasOfertas = respostas.flatMap(resposta => resposta.offers || []);
        return this.filtrarEOrdenarOfertas(todasOfertas);
    }

    private calcularPontuacaoDeRelevancia(offer: Offer, userMessage: string, doc: Document): number {
        let score = 0;

        score += offer.discount ? offer.discount * 0.3 : 0;

        if (userMessage.toLowerCase().includes(offer.category?.name.toLowerCase() || '')) {
            score += 30;
        }

        const nameRelevance = this.calcularSimilaridadeDeTexto(userMessage, offer.name);
        score += nameRelevance * 40;

        if (offer.store?.rating) {
            score += offer.store.rating * 5;
        }

        return score;
    }

    private calcularSimilaridadeDeTexto(text1: string, text2: string): number {
        const normalize = (text: string) => {
            return text.toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s]/g, '');
        };

        const words1 = normalize(text1).split(' ');
        const words2 = normalize(text2).split(' ');

        const commonWords = words1.filter(word =>
            words2.includes(word) && word.length > 2
        );

        const similarity = (commonWords.length * 2) / (words1.length + words2.length);

        return similarity;
    }

    private createEnrichedOfferContent(offer: Offer): string {
        return `
            PRODUTO: ${offer.name}
            |
            PREÇO: R$ ${offer.price}
            DESCONTO: ${offer.discount || 0}%
            PREÇO ORIGINAL: R$ ${offer.priceFrom || offer.price}
            |
            CATEGORIA: ${offer.category?.name || 'Não informada'}
            CATEGORIA ANUNCIANTE: ${offer.advertiserCategory || 'Não informada'}
            |
            LOJA: ${offer.store?.name || 'Não informada'}
            |
            PARCELAMENTO: ${offer?.installment?.quantity || 1}x de R$ ${offer?.installment?.value || offer.price}
        `.trim();
    }

    private filtrarEOrdenarOfertas(offers: Offer[]): Offer[] {
        const uniqueOffers = new Map<string, Offer>();

        offers.forEach(offer => {
            const key = `${offer.name.toLowerCase().trim()}_${offer.price}`;

            if (!uniqueOffers.has(key)) {
                uniqueOffers.set(key, offer);
            }
        });

        return Array.from(uniqueOffers.values())
            .sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }
}