import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MobileChatComponent } from '../mobile-chat/mobile-chat.component';

@Component({
  selector: 'app-home',
  imports: [    
    CommonModule, 
    RouterModule,
    MobileChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showModal = false;

  openModal(): void {
    console.log('Modal opening...');
    this.showModal = true;
    document.body.classList.add('overflow-hidden');
  }

  closeModal(): void {
    console.log('Modal closing...');
    this.showModal = false;
    document.body.classList.remove('overflow-hidden');
  }

  scrollToChat() {
    document.getElementById('chatai')?.scrollIntoView({behavior: 'smooth'});
  }
  createFallingIcons() {
  const container = document.querySelector('.falling-icons');
  const iconCount = 15;

  for (let i = 0; i < iconCount; i++) {
    const icon = document.createElement('div');
    icon.className = 'icon';
    
    // Posição horizontal aleatória
    icon.style.left = `${Math.random() * 100}%`;
    
    // Duração aleatória entre 10-20 segundos
    const duration = 10 + Math.random() * 10;
    icon.style.animationDuration = `${duration}s`;
    
    // Delay aleatório
    icon.style.animationDelay = `${Math.random() * 10}s`;
    
    container?.appendChild(icon);
  }
}
}
