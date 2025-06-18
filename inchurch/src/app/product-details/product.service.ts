import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(`https://dummyjson.com/product/${productId}`);
  }

  updateProduct(productId: string, updatedData: any): Observable<any> {
    return this.http.put<any>(`https://dummyjson.com/products/${productId}`, updatedData);
  }

}
