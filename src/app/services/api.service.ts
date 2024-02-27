import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = "http://test-demo.aemenersol.com/api/"

  constructor(private http: HttpClient) { }

  getDashboard(){
    return this.http.get<any>(`${this.baseUrl}dashboard`)
  }
}
