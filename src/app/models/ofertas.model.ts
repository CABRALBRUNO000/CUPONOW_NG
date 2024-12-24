import { LomadeeResponse } from "./lomadee.model";

export interface Ofertas {
    responses: LomadeeResponse[];
    isGenericSearch: boolean;
  }