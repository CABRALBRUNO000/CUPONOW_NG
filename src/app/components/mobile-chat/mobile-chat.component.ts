import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Message } from '../../models/message.model';
import { Offer } from '../../models/offer.model';
import { AiChatMobileService } from '../../services/ai-chat-mobile.service';
import { LoggerService } from '../../services/logger.service';

interface ChatMessage extends Message {
  products?: Offer[];
}

interface ChatConfig {
  placeholder: string;
  botName: string;
  botDescription: string;
}

@Component({
  selector: 'app-mobile-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mobile-chat.component.html',
  styleUrl: './mobile-chat.component.css'
})
export class MobileChatComponent implements OnInit {
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage = '';
  isLoading = false;
  products: Offer[] = [];

  // Adicionar configuração
  chatConfig: ChatConfig = {
    placeholder: 'Digite sua dúvida sobre ofertas...',
    botName: 'Assistente CuponAI',
    botDescription: 'Encontre as melhores ofertas'
  };
  


  constructor(
    private aiChatMobileService: AiChatMobileService,
    private router: Router,
    private logger: LoggerService

  ) {}


  ngOnInit(): void {
    this.loadExistingHistory();
    this.subscribeToProducts();
  }

  private loadExistingHistory(): void {
    const existingHistory = this.aiChatMobileService.getMessageHistory();
    this.messages = existingHistory.map((msg: any) => ({
      ...msg,
      products: []
    }));
    this.logger.info('Histórico de mensagens carregado', this.messages);

  }

  private subscribeToProducts(): void {
    this.aiChatMobileService.products$.subscribe(products => {
      this.products = products;
    });
  }

  async sendMessage(): Promise<void> {
    const trimmedMessage = this.newMessage.trim();
    if (!trimmedMessage) return;

    this.addUserMessage(trimmedMessage);
    this.isLoading = true;
    this.logger.info('Enviando mensagem:', trimmedMessage);

    try {
      const response = await this.aiChatMobileService.sendMessage(trimmedMessage);
      this.addAiMessage(response);
      this.logger.info('Resposta recebida:', response);

    } catch (error) {
      this.handleError();
      this.logger.error('Erro ao processar mensagem', error);

    } finally {
      this.finalizeSendMessage();
    }
  }

  private addUserMessage(text: string): void {
    this.messages.push({ text, sender: 'user' });
    this.newMessage = '';
  }

  private addAiMessage(response: any): void {
    this.messages.push({
      text: response.message,
      sender: 'ai',
      products: response.products || []
    });
    
    // Garante que o scroll aconteça após a renderização do DOM
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  private handleError(): void {
    console.error('Erro ao enviar mensagem');
    this.messages.push({
      text: 'Desculpe, ocorreu um erro. Pode tentar novamente?',
      sender: 'ai'
    });
  }

  private finalizeSendMessage(): void {
    this.isLoading = false;
    
    // Use requestAnimationFrame para garantir foco após renderização
    requestAnimationFrame(() => {
      if (this.messageInput && this.messageInput.nativeElement) {
        const inputElement = this.messageInput.nativeElement;
        
        // Foco sem rolagem
        inputElement.focus({
          preventScroll: true
        });
      }
    });
  }
  

  private scrollToBottom(): void {
    try {
      const chatElement = this.chatContainer.nativeElement;
      setTimeout(() => {
        chatElement.scrollTo({
          top: chatElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    } catch (err) {
      this.logger.error('Erro ao realizar scroll', err);
    }
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  }

  openProductLink(product: Offer): void {
    const url = product.link || 
      `https://www.google.com/search?q=${encodeURIComponent(`${product.name} oferta`)}`;
    window.open(url, '_blank');
  }

  navigateToProductsList(): void {
    const allProducts = this.messages
      .reduce((acc: Offer[], msg) => [...acc, ...(msg.products || [])], []);
    this.aiChatMobileService.setProducts(allProducts);
    this.router.navigate(['/products-list']);
  }
  trackByMessages(index: number, item: ChatMessage): number {
    return index;
  }
  
  trackByProducts(index: number, item: Offer): string | number{
    return item.id || index.toString();

  }}


