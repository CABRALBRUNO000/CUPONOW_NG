import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, retry, catchError, throwError } from 'rxjs';
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

  private readonly defaultHeaders = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json');

  private readonly defaultOptions = {
    headers: this.defaultHeaders,
    withCredentials: false
  };

  constructor(private http: HttpClient) { }

  searchOffers(keyword: string): Observable<LomadeeResponse> {
    const url = `${this.API_URL}/${this.APP_TOKEN}/offer/_search`;
    const params = new HttpParams()
      .set('sourceId', this.SOURCE_ID)
      .set('keyword', encodeURIComponent(keyword))
      .set('sort', this.SORT)
      .set('size', this.SIZE);

    return this.http.get<LomadeeResponse>(url, { 
      ...this.defaultOptions,
      params
    }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getCategoryKeyord(keyword: string): Observable<CategoryResponse> {
    const url = `${this.API_URL}/${this.APP_TOKEN}/category/_search`;
    const params = new HttpParams()
      .set('sourceId', this.SOURCE_ID)
      .set('keyword', encodeURIComponent(keyword));

    return this.http.get<CategoryResponse>(url, {
      ...this.defaultOptions,
      params
    }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getCategoryFilters(categoryId: string): Observable<CategoryResponse[]> {
    const url = `${this.API_URL}/${this.APP_TOKEN}/category/_id/${categoryId}`;
    const params = new HttpParams().set('sourceId', this.SOURCE_ID);

    return this.http.get<CategoryResponse[]>(url, {
      ...this.defaultOptions,
      params
    }).pipe(
      retry(3),
      catchError(this.handleError)
    );
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
    const params = new HttpParams({
      fromObject: {
        sourceId: this.SOURCE_ID,
        ...options
      }
    });

    return this.http.get<CategoryResponse>(url, {
      ...this.defaultOptions,
      params
    }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Erro na requisição Lomadee:', error);
    return throwError(() => error);
  }
}
