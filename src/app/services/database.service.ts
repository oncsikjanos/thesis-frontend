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
const GET_TAKEABLE_EXAMS = '/getAppliableTest';
const GET_TEACHER = '/getTeacher';
const CREATE_TEST = '/createInitialTest';
const DELETE_TEST = '/deleteTest';
const APPLY_TEST = '/applyToTest';
const CANCEL_APPLY_TEST = '/cancelTestApplication';
const GET_SUBJECT = '/getSubjects';
const FINALIZE_TEST = '/finalizeTest';
const GET_EXAM = '/getMyExams';
const GET_TEACHER_EXAM = '/getTeacherExams';
const CAN_TAKE_TEST = '/canTakeTest';
const GET_EXAM_QUESTION = '/getExamQuestions';
const SAVE_ANSWER = '/saveAnswer';
const LOAD_ANSWER = '/loadAnswer';
const START_TEST = '/startTest';
const FINISH_TEST = '/finishTest';
const ATTEND_CALL = '/attendVideoChat';

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

  getTakeAbleExams(date?: Date, subject? : string): Observable<any> {
    return this.http.post(API+GET_TAKEABLE_EXAMS, {date, subject}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  getTeacher(email: string): Observable<any> {
    return this.http.post(API+GET_TEACHER, {teacherEmail: email}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  applyExam(testId: string): Observable<any>{
    return this.http.post(API+APPLY_TEST, {testId}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  cancelExam(testId: string): Observable<any>{
    return this.http.post(API+CANCEL_APPLY_TEST, {testId}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  createTest(): Observable<any> {
    return this.http.get(API+CREATE_TEST, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  deleteTest(testId: string): Observable<any> {
    return this.http.post(API+DELETE_TEST, {testId: testId}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  finalizeExam(testId: any){
    return this.http.post(API+FINALIZE_TEST, {testId: testId}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  getSubjects():Observable<any> {
    return this.http.get(API+GET_SUBJECT, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  getAppliedExamAsTeacher(): Observable<any>{
    return this.http.get(API+GET_TEACHER_EXAM, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  getAppliedExams(): Observable<any> {
    return this.http.get(API+GET_EXAM, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  canTakeTest(testId: any): Observable<any> {
    return this.http.post(API+CAN_TAKE_TEST, {testId: testId}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  getExamQuestions(testId: any): Observable<any> {
    return this.http.post(API+GET_EXAM_QUESTION, {testId: testId}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  saveAnswer(testId: string, answer: any): Observable<any> {
    return this.http.post(API+SAVE_ANSWER, {testId: testId, answer: answer}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  loadAnswer(questionId: any): Observable<any> {
    return this.http.post(API+LOAD_ANSWER, {questionId: questionId}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  startTest(testId: any): Observable<any> {
    return this.http.post(API+START_TEST, {testId: testId}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  finishTest(testId: any): Observable<any> {
    return this.http.post(API+FINISH_TEST, {testId: testId}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

  attendVideoCall(testId: any): Observable<any> {
    return this.http.post(API+ATTEND_CALL, {testId: testId}, {
      headers: { 'Content-Type': 'application/json'},
      observe: 'response',
      withCredentials: true}).pipe();
  }

}
