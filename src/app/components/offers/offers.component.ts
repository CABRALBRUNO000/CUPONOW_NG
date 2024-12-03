import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffersService } from '../../services/offers.service';
import { Offer } from '../../models/offer.model';
import { AiChatService } from '../../services/ai-chat.service';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']  // Note o 's' em styleUrls
})
export class OffersComponent implements OnInit {
  offers: Offer[] = [];

  constructor(private offersService: OffersService,
    private aiChatService: AiChatService
  ) {}

  ngOnInit(): void {
    this.offersService.getOffers().subscribe({
      next: (offers) => {
        this.offers = offers;
      },
      error: (error) => {
        console.error('Erro ao carregar ofertas:', error);
      }
    });
    this.loadOffers();
  }

  private loadOffers(): void {
    this.offersService.getOffers().subscribe({
      next: (offers) => {
        this.offers = offers;
        this.aiChatService.setOffers(offers); // Atualizar as ofertas no AiChatService
      },
      error: (error) => {
        console.error('Erro ao carregar ofertas:', error);
      }
    });
  }
  getDiscountPercentage(original: number, discounted: number): number {
    return Math.round(((original - discounted) / original) * 100);
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/placeholder.jpg'; // Imagem de fallback
  }
}




