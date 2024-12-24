import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'

//import * as path from 'node:path';
import {LoginComponent} from './components/auth/login/login.component';
import {RegisterComponent} from './components/auth/register/register.component';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {provideHttpClient} from '@angular/common/http';
import {AuthComponent} from './components/auth/auth.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', component: AuthComponent},
];

const firebaseConfig = {
  apiKey: "AIzaSyCOpjfZZosrfa-GgKeVFlCL0L4zkzYSxDA",
  authDomain: "thesis-6004b.firebaseapp.com",
  projectId: "thesis-6004b",
  storageBucket: "thesis-6004b.firebasestorage.app",
  messagingSenderId: "805984284940",
  appId: "1:805984284940:web:c4b12498b366c41eef5929",
  measurementId: "G-VDEYW551N0"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideAnimations()
  ]
};
