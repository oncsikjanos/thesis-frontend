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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth)

  constructor() { }

  async registerUser(email: string, password: string): Promise<{ user?: UserCredential, error?: any }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.firebaseAuth, email, password);
      return { user: userCredential };
    } catch (error) {
      return { error };
    }
  }

  async logInUser(email: string, password: string): Promise<{ user?: UserCredential, error?: any }> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      return { user: userCredential };
    } catch (error) {
      return { error };
    }
  }

  async signOutUser() {
    return signOut(this.firebaseAuth);
  }

  loggedInData(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(this.firebaseAuth, (user) => {
        resolve(user);
      }, (error) => {
        reject(error);
      });
    });
  }
}
