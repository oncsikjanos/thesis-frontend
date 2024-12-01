import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../model/User';

const API = '';
const REGISTER = '';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  register(user: User) : Observable<any>{
    console.log('POST URL:', API+REGISTER);
    console.log('POST Data:', user);
    return this.http.post(API+REGISTER, user,
      {headers: { 'Content-Type': 'application/json' }
      });
  }
}
