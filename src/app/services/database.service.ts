import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {User} from '../model/User';
import {Test} from '../model/Test';
import {Question} from '../model/Question';

const API = 'http://localhost:5050';
const GET_USER = '/getUser';
const ADD_TEST = '/addTest';
const UPDATE_USER = '/updateUser';
const TEST_IN_PROGRESS = '/getTestsInProgress';
const TEST_EDIT = '/getTest';
const TEST_EDIT_UPDATE = '/updateTest';
const ADD_QUESTION = '/addQuestion';
const GET_QUESTION = '/getQuestion';
const ADD_QUESTION_PICTURE = '/addQuestionPicture';
const DELETE_QUESTION_PICTURE = '/deleteQuestionPicture';
const UPDATE_QUESTION = '/updateQuestion';
const DELETE_QUESTION = '/deleteQuestion';

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

  getTestsInProgress(): Observable<any> {
    return this.http.get(API+TEST_IN_PROGRESS, {observe: 'response', withCredentials: true}).pipe(
      tap((response : HttpResponse<any>) => {

      },)
    );
  }

  getTestToEdit(id: string): Observable<any> {
    return this.http.post(API+TEST_EDIT, {testId: id}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe()
  }

  updateTest(id: string, testFormat: any): Observable<any> {
    return this.http.post(API+TEST_EDIT_UPDATE, {testId: id, testData: testFormat}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  addQuestion(type: string, testId: string): Observable<any> {
    return this.http.post(API+ADD_QUESTION, {type: type, testId: testId},{
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  getQuestion(id: string): Observable<any> {
    return this.http.post(API+GET_QUESTION, {questionId: id}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  updateQuestion(id: string, question: Question): Observable<any> {
    return this.http.post(API+UPDATE_QUESTION, {questionId: id, questionData: question}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  addQuestionPicture(questionFormData: FormData): Observable<any> {
    return this.http.post(API+ADD_QUESTION_PICTURE, questionFormData, {observe: 'response', withCredentials: true}).pipe();
  }

  deleteQuestionPicture(questionId: string): Observable<any> {
    return this.http.post(API+DELETE_QUESTION_PICTURE, {questionId: questionId}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  deleteQuestion(questionId: string, testId: string): Observable<any> {
    return this.http.post(API+DELETE_QUESTION, {questionId: questionId, testId: testId}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

}
