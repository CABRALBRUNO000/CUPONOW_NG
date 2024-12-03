import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService } from '../../services/ai-chat.service';
import { OffersService } from '../../services/offers.service';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('messageInput') messageInput!: ElementRef;
  messages: Message[] = [];
  newMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private aiChatService: AiChatService,
    private offersService: OffersService
  ) {}
  ngOnInit() {
    // Mensagem inicial de boas-vindas
    // this.messages.push({
    //   text: 'Olá! Como posso ajudar você hoje?',
    //   sender: 'ai'
    // });

    // Carregar histórico de mensagens
    this.messages = this.aiChatService.getMessageHistory();
  }

  async sendMessage() {
    if (this.newMessage.trim()) {
      const userMessage: Message = {
        text: this.newMessage.trim(),
        sender: 'user'
      };
      
      // this.messages.push(userMessage);
      const currentMessage = this.newMessage;
      this.newMessage = '';
      this.isLoading = true;

      try {
        const response = await this.aiChatService.sendMessage(currentMessage);
        // this.messages.push({
        //   text: response.message,
        //   sender: 'ai'
        // });
        this.offersService.updateOffers(response.products);
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      } finally {
        this.isLoading = false;
        setTimeout(() => {
          this.messageInput.nativeElement.focus();
        }, 0);      }
    }
  }
}