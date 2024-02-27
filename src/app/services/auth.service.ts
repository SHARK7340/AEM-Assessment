import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = "http://test-demo.aemenersol.com/api/"

  constructor(private http: HttpClient, private router: Router) { }

  login(loginObj: any){
    return this.http.post<any>(`${this.baseUrl}account/login`, loginObj)
  }

  logout(){
    localStorage.clear();
    // localStorage.removeItem('token');
    this.router.navigate(['']);
  }

  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem('token');   // !! is to convert to boolean, since retun value we set to type boolean not string, if null, false, else, true
  }
}
