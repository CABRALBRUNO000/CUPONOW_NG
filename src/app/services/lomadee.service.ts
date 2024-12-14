import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LomadeeResponse } from '../models/lomadee.model';
import { CategoryResponse } from '../interfaces/category.interface'; 

@Injectable({
  providedIn: 'root'
})
export class LomadeeService {
  private readonly API_URL = 'https://api.lomadee.com/v3';  // Alterado de https://api.lomadee.com/v3 para /api
  private readonly APP_TOKEN = '1733757952030999173a0';
  private readonly SOURCE_ID = '38322289';
  private readonly SORT = 'discount';

  constructor(private http: HttpClient) { }

  searchOffers(keyword: string): Observable<LomadeeResponse> {
    const url = `${this.API_URL}/${this.APP_TOKEN}/offer/_search`;
    const params = {
      sourceId: this.SOURCE_ID,
      keyword: keyword,
      sort: this.SORT,
    };

    return this.http.get<LomadeeResponse>(url, { 
      params,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getCategoryKeyord(keyword: string): Observable<CategoryResponse> {
    const url = `${this.API_URL}/${this.APP_TOKEN}/category/_search`;
    return this.http.get<CategoryResponse>(url, {
      params: {
        sourceId: this.SOURCE_ID,
        keyword,
      }
    });
  }


  getCategoryFilters(categoryId: string): Observable<CategoryResponse[]> {
    const url = `${this.API_URL}/${this.APP_TOKEN}/category/_id/${categoryId}`;
    return this.http.get<CategoryResponse[]>(url, {
      params: {
        sourceId: this.SOURCE_ID
      }
    });
  }

  searchProductsWithFilters(
    categoryId: string, 
    options: {
      storeId?: string,
      minPrice?: number,
      maxPrice?: number,
      size?: number,
      page?: number,
      sort?: 'discount' | 'price' | 'update_at'
    } = {}
  ): Observable<CategoryResponse> {
    const url = `${this.API_URL}/${this.APP_TOKEN}/offer/_category/${categoryId}`;
    
    const params = {
      sourceId: this.SOURCE_ID,
      ...options
    };
  
    return this.http.get<CategoryResponse>(url, { params });
  }
}