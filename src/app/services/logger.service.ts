import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private readonly PREFIX = '[CuponAI]';

  info(message: string, ...args: any[]): void {
    console.info(`${this.PREFIX} ${message}`, ...args);
  }

  error(message: string, error?: any): void {
    console.error(`${this.PREFIX} ${message}`, error);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`${this.PREFIX} ${message}`, ...args);
  }

  debug(message: string, ...args: any[]): void {
    console.debug(`${this.PREFIX} ${message}`, ...args);
  }

  trace(message: string, ...args: any[]): void {
    console.trace(`${this.PREFIX} ${message}`, ...args);
  }
}
