export interface Offer {
    id: string;
    name: string;
    category: Category;
    link: string;
    thumbnail: string;
    price: number;
    priceFrom?: number;
    discount: number;
    installment?: Installment;
    store: Store;
    advertiserCategory: string;
}

export interface Category {
    id: number;
    name: string;
    link: string;
}

export interface Installment {
    quantity: number;
    value: number;
}

export interface Store {
    id: number;
    name: string;
    thumbnail: string;
    link: string;
    invisible: boolean;
    needPermission: boolean;
}
