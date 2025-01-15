import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {User} from '../model/User';
import {Test} from '../model/Test';

const API = 'http://localhost:5050';
const GET_USER = '/getUser';
const ADD_TEST = '/addTest';
const UPDATE_USER = '/updateUser';

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

  addTest(test: Test) {
    console.log('POST URL:', API+ADD_TEST);
    return this.http.post(API+ADD_TEST, test,  {headers: { 'Content-Type': 'application/json' },
      observe: 'response',
      withCredentials: true
    }).pipe(
      tap((response : HttpResponse<any>) => {

      })
    );

  }

  updateUserData(userFormData: FormData):Observable<any> {
    return this.http.post(API+UPDATE_USER, userFormData, {observe: 'response', withCredentials: true}).pipe(
      tap((response : HttpResponse<any>) => {

      })
    );
  }

}
