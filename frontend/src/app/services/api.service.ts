import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id?: number;
  name: string;
}

export interface Product {
  id?: number;
  name: string;
  category: number;
  description?: string;
  price: number;
  quantity: number;
  main_image?: string | File;
  created_at?: string;
  updated_at?: string;
  extra_images?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }


  // Category endpoints
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories/`, {
      headers: this.getHeaders(),
    });
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/categories/${id}/`, {
      headers: this.getHeaders(),
    });
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories/`, category, {
      headers: this.getHeaders(),
    });
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(
      `${this.baseUrl}/categories/${id}/`,
      category,
      { headers: this.getHeaders() }
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}/`, {
      headers: this.getHeaders(),
    });
  }

  // Product endpoints
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products/`, {
      headers: this.getHeaders(),
    });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}/`, {
      headers: this.getHeaders(),
    });
  }

  createProduct(product: Product): Observable<Product> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('category', product.category.toString());
    formData.append('price', product.price.toString());
    formData.append('quantity', product.quantity.toString());
    if (product.description) formData.append('description', product.description);
    if (product.main_image && product.main_image instanceof File) {
      formData.append('main_image', product.main_image);
    }

    return this.http.post<Product>(`${this.baseUrl}/products/`, formData, {
      headers: this.getHeaders(),
    });
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('category', product.category.toString());
    formData.append('price', product.price.toString());
    formData.append('quantity', product.quantity.toString());
    if (product.description) formData.append('description', product.description);
    if (product.main_image && product.main_image instanceof File) {
      formData.append('main_image', product.main_image);
    }

    return this.http.put<Product>(`${this.baseUrl}/products/${id}/`, formData, {
      headers: this.getHeaders(),
    });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}/`, {
      headers: this.getHeaders(),
    });
  }

  // Statistics for dashboard
  getStatistics(): Observable<any> {
    // This endpoint doesn't exist in your backend yet, but you can create it
    // For now, we'll calculate statistics on the frontend
    return this.http.get<any>(`${this.baseUrl}/statistics/`, {
      headers: this.getHeaders(),
    });
  }
}
