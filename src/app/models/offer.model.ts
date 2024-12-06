export interface Offer {
    id: number;
    product: string;
    description: string;
    imageUrl: string;
    originalPrice: number;
    discountedPrice: number;
    productUrl?: string;
    cuponCode?:string
  }

  