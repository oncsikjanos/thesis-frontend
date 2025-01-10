import {inject, Injectable, signal} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {User} from '../model/User';
import {RegisterData} from '../model/RegisterData';
import { Router } from '@angular/router';

const API = 'http://localhost:5050';
const REGISTER = '/register';
const LOGIN = '/login';
const LOGOUT = '/logout';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserSignal = signal<User | null | undefined>(undefined);
  router = inject(Router);
  http = inject(HttpClient);
  constructor() { }

  register(user:RegisterData): Observable<any> {
    console.log('POST URL:', API+REGISTER);
    console.log('POST Data:', user);
    return this.http.post(API+REGISTER, user,
      {headers: { 'Content-Type': 'application/json' },
      observe: 'response',
      withCredentials: true
      }).pipe(
        tap((response : HttpResponse<any>) => {
          this.currentUserSignal.set(response.body.user);
          this.router.navigate(['/']);
        })
      );
  }

  login(email: string, password: string): Observable<any> {
    console.log('POST URL:', API+LOGIN);
    console.log('POST Data:', {"email": email, "password": password});
    return this.http.post(API+LOGIN, {"email": email, "password": password},
      {headers: { 'Content-Type': 'application/json' },
      observe: 'response',
      withCredentials: true
      }).pipe(
        tap((response : HttpResponse<any>) => {
          console.log('Response:', response);
          this.currentUserSignal.set(response.body.user);
          this.router.navigate(['/']);
        })
      );
  }

  logout(): Observable<any> {
    return this.http.get(API+LOGOUT,{
      observe: 'response',
      withCredentials: true})
      .pipe(
        tap((response : HttpResponse<any>) => {
          console.log('Response:', response);
          this.currentUserSignal.set(null);
          this.router.navigate(['/auth']);
        })
      );
  }

  isLoggedIn(): boolean {
    return this.currentUserSignal() !== null;
  }

}
