import { Offer } from "./offer.model";

export interface RespostaChat {
    message: string;
    products: Offer[];
}