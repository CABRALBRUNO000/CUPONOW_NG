import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Message } from '../../models/message.model';
import { Offer } from '../../models/offer.model';
import { AiChatMobileService } from '../../services/ai-chat-mobile.service';
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
    private router: Router
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

    try {
      const response = await this.aiChatMobileService.sendMessage(trimmedMessage);
      this.addAiMessage(response);
    } catch (error) {
      this.handleError();
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
    this.scrollToBottom();
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
    setTimeout(() => this.messageInput.nativeElement.focus(), 0);
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  }

  openProductLink(product: Offer): void {
    const url = product.productUrl || 
      `https://www.google.com/search?q=${encodeURIComponent(`${product.product} oferta`)}`;
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


