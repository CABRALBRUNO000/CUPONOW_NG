export interface CategoryFilter {
    id: string;
    name: string;
    value: string;
  }

  export interface CategoryResponse {
    offers: any;
    requestInfo: {
      status: string;
      message: string;
    };
    pagination: {
      page: number;
      size: number;
      totalSize: number;
      totalPage: number;
      sortValues: string[];
    };
    categories: Category[];
  }
  
  export interface Category {
    id: number;
    name: string;
    hasOffer: number;
  }
