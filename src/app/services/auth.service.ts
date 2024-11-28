import {inject, Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential
} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);

  constructor() { }

  register(email: string, password: string): Observable<any> {
    const registerPromise = createUserWithEmailAndPassword(this.firebaseAuth, email, password);

    return fromPromise(registerPromise);
  }

  login(email: string, password: string): Observable<any> {
    const loginPromise = signInWithEmailAndPassword(this.firebaseAuth, email, password);

    return fromPromise(loginPromise);
  }
}
