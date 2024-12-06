import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Offer } from '../../models/offer.model';
import { AiChatMobileService } from '../../services/ai-chat-mobile.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent implements OnInit {
  products: Offer[] = [];

  constructor(
    private aiChatMobileService: AiChatMobileService,
    private router: Router
  ) {
    // Pegue os dados da navegação aqui
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.products = navigation.extras.state['products'];
      this.aiChatMobileService.setProducts(this.products);
    }
  }

  ngOnInit(): void {
    // Inscreva-se para mudanças nos produtos
    this.aiChatMobileService.products$.subscribe(products => {
      this.products = products;
      console.log('Products updated:', this.products);
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  }

  openProductLink(product: Offer) {
    if (product.productUrl) {
      window.open(product.productUrl, '_blank');
    } else {
      const searchQuery = encodeURIComponent(`${product.product} oferta`);
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
    }
  }
  handleImageError(event: any) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/placeholder.jpg';
  }
  
}
