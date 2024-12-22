import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

interface MetadadosErro {
  dataHora: string;
  nomeComponente?: string;
  nomeMetodo: string;
  numeroLinha?: number;
  nomeArquivo?: string;
  pilhaExecucao?: string;
}

interface RegistroErro extends MetadadosErro {
  mensagem: string;
  codigo: string;
  tipo: string;
  informacoesAdicionais?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ServicoTratamentoErros {
  private readonly TIPOS_ERRO = {
    HTTP: 'ERRO_HTTP',
    VALIDACAO: 'ERRO_VALIDACAO',
    NEGOCIO: 'ERRO_NEGOCIO',
    TECNICO: 'ERRO_TECNICO',
    SERVICO_EXTERNO: 'ERRO_SERVICO_EXTERNO',
    DESCONHECIDO: 'ERRO_DESCONHECIDO'
  };

  constructor() {}

  /**
   * Manipula erros HTTP e customizados, retornando um Observable com o erro tratado
   */
  public tratarErro(erro: any, nomeComponente: string, nomeMetodo: string): Observable<never> {
    const registroErro = this.criarRegistroErro(erro, nomeComponente, nomeMetodo);
    this.registrarErro(registroErro);
    return throwError(() => this.criarErroUsuario(registroErro));
  }

  /**
   * Cria um registro de erro estruturado com metadados
   */
  private criarRegistroErro(erro: any, nomeComponente: string, nomeMetodo: string): RegistroErro {
    const metadados = this.extrairMetadados(erro, nomeComponente, nomeMetodo);
    const tipoErro = this.determinarTipoErro(erro);

    return {
      ...metadados,
      mensagem: this.extrairMensagemErro(erro),
      codigo: this.gerarCodigoErro(tipoErro, nomeComponente, nomeMetodo),
      tipo: tipoErro,
      informacoesAdicionais: this.extrairInformacoesAdicionais(erro)
    };
  }

  /**
   * Extrai metadados do erro para facilitar o debugging
   */
  private extrairMetadados(erro: any, nomeComponente: string, nomeMetodo: string): MetadadosErro {
    const pilhaErro = new Error().stack;
    const linhasPilha = pilhaErro?.split('\n');
    const linhaChamada = linhasPilha?.[2] || '';
    const correspondencia = linhaChamada.match(/\((.*):(\d+):(\d+)\)/) || [];

    return {
      dataHora: new Date().toISOString(),
      nomeComponente,
      nomeMetodo,
      nomeArquivo: correspondencia[1],
      numeroLinha: correspondencia[2] ? parseInt(correspondencia[2], 10) : undefined,
      pilhaExecucao: !environment.production ? pilhaErro : undefined
    };
  }

  /**
   * Determina o tipo do erro baseado em suas características
   */
  private determinarTipoErro(erro: any): string {
    if (erro instanceof HttpErrorResponse) {
      return this.TIPOS_ERRO.HTTP;
    }
    if (erro.name === 'ValidationError') {
      return this.TIPOS_ERRO.VALIDACAO;
    }
    if (erro.isBusinessError) {
      return this.TIPOS_ERRO.NEGOCIO;
    }
    if (erro.isExternalServiceError) {
      return this.TIPOS_ERRO.SERVICO_EXTERNO;
    }
    if (erro instanceof Error) {
      return this.TIPOS_ERRO.TECNICO;
    }
    return this.TIPOS_ERRO.DESCONHECIDO;
  }

  /**
   * Extrai a mensagem de erro de diferentes tipos de erro
   */
  private extrairMensagemErro(erro: any): string {
    if (erro instanceof HttpErrorResponse) {
      return erro.error?.mensagem || erro.message || 'Erro na requisição HTTP';
    }
    if (typeof erro === 'string') {
      return erro;
    }
    return erro.message || 'Ocorreu um erro inesperado';
  }

  /**
   * Gera um código único para o erro
   */
  private gerarCodigoErro(tipoErro: string, nomeComponente: string, nomeMetodo: string): string {
    const dataHora = Date.now().toString(36);
    const aleatorio = Math.random().toString(36).substring(2, 5);
    return `${tipoErro}_${nomeComponente}_${nomeMetodo}_${dataHora}${aleatorio}`.toUpperCase();
  }

  /**
   * Extrai informações adicionais úteis para debugging
   */
  private extrairInformacoesAdicionais(erro: any): any {
    if (erro instanceof HttpErrorResponse) {
      return {
        status: erro.status,
        statusText: erro.statusText,
        url: erro.url,
        cabecalhos: erro.headers.keys().reduce((acc, key) => ({
          ...acc,
          [key]: erro.headers.get(key)
        }), {})
      };
    }

    return erro.informacoesAdicionais || {};
  }

  /**
   * Cria uma mensagem amigável para o usuário baseada no tipo de erro
   */
  private criarErroUsuario(registroErro: RegistroErro): any {
    const erroBase = {
      mensagemUsuario: this.obterMensagemAmigavel(registroErro.tipo),
      codigoErro: registroErro.codigo,
      dataHora: registroErro.dataHora
    };

    if (!environment.production) {
      return {
        ...erroBase,
        detalhesTecnicos: {
          mensagemOriginal: registroErro.mensagem,
          nomeComponente: registroErro.nomeComponente,
          nomeMetodo: registroErro.nomeMetodo,
          tipo: registroErro.tipo
        }
      };
    }

    return erroBase;
  }

  /**
   * Retorna mensagens amigáveis baseadas no tipo de erro
   */
  private obterMensagemAmigavel(tipoErro: string): string {
    const mensagens = {
      [this.TIPOS_ERRO.HTTP]: 'Não foi possível completar a requisição. Por favor, tente novamente.',
      [this.TIPOS_ERRO.VALIDACAO]: 'Os dados fornecidos são inválidos. Por favor, verifique e tente novamente.',
      [this.TIPOS_ERRO.NEGOCIO]: 'Não foi possível completar a operação devido a uma regra de negócio.',
      [this.TIPOS_ERRO.SERVICO_EXTERNO]: 'O serviço está temporariamente indisponível. Por favor, tente novamente mais tarde.',
      [this.TIPOS_ERRO.TECNICO]: 'Ocorreu um erro técnico. Nossa equipe foi notificada.',
      [this.TIPOS_ERRO.DESCONHECIDO]: 'Ocorreu um erro inesperado. Por favor, tente novamente.'
    };

    return mensagens[tipoErro] || mensagens[this.TIPOS_ERRO.DESCONHECIDO];
  }

  /**
   * Realiza o registro do erro de acordo com o ambiente
   */
  private registrarErro(registroErro: RegistroErro): void {
    if (environment.production) {
      // Aqui você pode integrar com serviços de log como Sentry, LogRocket, etc.
      this.enviarParaServicoLog(registroErro);
    } else {
      console.group(`🚨 Erro: ${registroErro.codigo}`);
      console.error('Detalhes do Erro:', {
        mensagem: registroErro.mensagem,
        tipo: registroErro.tipo,
        componente: registroErro.nomeComponente,
        metodo: registroErro.nomeMetodo,
        dataHora: registroErro.dataHora,
        numeroLinha: registroErro.numeroLinha,
        nomeArquivo: registroErro.nomeArquivo,
        informacoesAdicionais: registroErro.informacoesAdicionais
      });
      if (registroErro.pilhaExecucao) {
        console.debug('Pilha de Execução:', registroErro.pilhaExecucao);
      }
      console.groupEnd();
    }
  }

  /**
   * Envia o registro para um serviço de monitoramento
   */
  private enviarParaServicoLog(registroErro: RegistroErro): void {
    // Implemente a integração com seu serviço de log preferido
    // Exemplo: Sentry, LogRocket, Application Insights, etc.
  }
}