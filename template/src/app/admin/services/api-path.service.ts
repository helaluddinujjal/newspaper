import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiPathService {
  baseUrl = 'http://localhost:3000/api/';
  constructor(private _http: HttpClient) {
  }
  getTypeRequest(url) {
    return this._http.get(`${this.baseUrl}${url}`).pipe(map(res => {
      return res;
    }));
  }
  postTypeRequest(url, payload) {
    return this._http.post(`${this.baseUrl}${url}`, payload).pipe(map(res => {
      return res;
    }));
  }
  putTypeRequest(url, payload) {
    return this._http.put(`${this.baseUrl}${url}`, payload).pipe(map(res => {
      return res;
    }));
  }

  deleteTypeRequest(url) {
    return this._http.delete(`${this.baseUrl}${url}`).pipe(map(res => {
      return res;
    }));
  }
}
