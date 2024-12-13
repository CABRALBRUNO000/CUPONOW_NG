import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LomadeeResponse } from '../models/lomadee.model';
import { CategoryResponse } from '../interfaces/category.interface'; 
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LomadeeService {
  private readonly API_URL = environment.apiUrl;
  private readonly APP_TOKEN = '1733757952030999173a0';
  private readonly SOURCE_ID = '38322289';
  private readonly SORT = 'price';
  private readonly SIZE = 100;

  constructor(private http: HttpClient) { }

  searchOffers(keyword: string): Observable<LomadeeResponse> {
    const url = `${this.API_URL}/${this.APP_TOKEN}/offer/_search`;

    const headers = new HttpHeaders()
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
    
    const params = new HttpParams()
      .set('sourceId', this.SOURCE_ID)
      .set('keyword', keyword)
      .set('sort', this.SORT)
      .set('size', this.SIZE);

      return this.http.get<LomadeeResponse>(url, { 
        headers, 
        params,
        withCredentials: false
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