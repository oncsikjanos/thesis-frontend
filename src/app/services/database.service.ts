import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {User} from '../model/User';

const API = 'http://localhost:5050';
const GET_USER = '/getUser';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient) { }

  getUser(): Observable<any> {
    return this.http.get<User>(API + GET_USER, {
      observe: 'response',
      withCredentials: true
    }).pipe(
      tap({
        next: (response: HttpResponse<any>) => {
        },
        error: (error) => {
        }
      })
    );
  }

}
