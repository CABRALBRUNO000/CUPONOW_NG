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

}
