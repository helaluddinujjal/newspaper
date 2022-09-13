import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { Category } from './category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
    // Node/Express API
    REST_API: string = 'http://localhost:3000/api';
    // Http Header
    user=JSON.parse(this.auth.getUserDetails());
    httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    constructor(private httpClient: HttpClient, private auth:AuthService) { }
    // Add

    addCategory(data: Category): Observable<any> {
      let API_URL = `${this.REST_API}/add-category`;
      return this.httpClient.post(API_URL, data)
        .pipe(
          catchError(this.handleError)
        )
    }
    addCat(data: Category): Observable<any> {
      let API_URL = `${this.REST_API}/add-category`;
      return this.httpClient.post(API_URL, data)
        .pipe(
          catchError(this.handleError)
        )
    }

    // Get all objects
    getCategories() {
      return this.httpClient.get(`${this.REST_API}/categories`);
    }
    // Get single object
    getCategory(id:any): Observable<any> {
      let API_URL = `${this.REST_API}/category/${id}`;
      return this.httpClient.get(API_URL, { headers: this.httpHeaders })
        .pipe(map((res: any) => {
            return res || {}
          }),
          catchError(this.handleError)
        )
    }
    checkSlug(slug:any): Observable<any> {
      let API_URL = `${this.REST_API}/check-slug/${slug}`;
      return this.httpClient.get(API_URL, { headers: this.httpHeaders })
        .pipe(map((res: any) => {
            return res || {}
          }),
          catchError(this.handleError)
        )
    }
    // Update
    updateCategory(id:any, data:any): Observable<any> {
      let API_URL = `${this.REST_API}/update-category/${id}`;
      return this.httpClient.patch(API_URL, data, { headers: this.httpHeaders })
        .pipe(
          catchError(this.handleError)
        )
    }
    // Delete
    deleteCategory(id:any,title:any): Observable<any> {
      console.log(id)
      let API_URL = `${this.REST_API}/delete-category/${id}/${title}/${this.user[0].id}/${this.user[0].name}`;
      return this.httpClient.delete(API_URL, { headers: this.httpHeaders}).pipe(
          catchError(this.handleError)
        )
    }
    getActivityByID(id:any,type:any): Observable<any> {
      let API_URL = `${this.REST_API}/get-activity-by-id/${id}/${type}`;
      return this.httpClient.get(API_URL, { headers: this.httpHeaders })
        .pipe(map((res: any) => {
            return res || {}
          }),
          catchError(this.handleError)
        )
    }
    // Error
    handleError(error: HttpErrorResponse) {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // Handle client error
        errorMessage = error.error.message;
      } else {
        // Handle server error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      console.log(errorMessage);
      return throwError(errorMessage);
    }
}
