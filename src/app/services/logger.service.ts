import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private readonly PREFIX = '[CuponAI]';

  info(message: string, ...args: any[]): void {
    console.log(JSON.stringify({
      level: 'info',
      message: `${this.PREFIX} ${message}`,
      data: args
    }));
  }
  error(message: string, error?: any): void {
    console.log(JSON.stringify({
      level: 'error',
      message: `${this.PREFIX} ${message}`,
      error: error instanceof Error ? error.message : error
    }));
  }
  warn(message: string, ...args: any[]): void {
    console.log(JSON.stringify({
      level: 'warn',
      message: `${this.PREFIX} ${message}`,
      data: args
    }));
  }

  debug(message: string, ...args: any[]): void {
    console.log(JSON.stringify({
      level: 'debug',
      message: `${this.PREFIX} ${message}`,
      data: args
    }));
  }
}