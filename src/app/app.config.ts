import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'
import {provideHttpClient} from '@angular/common/http';
import {AuthComponent} from './components/auth/auth.component';
import { AuthGuard, LoginGuard } from './services/auth-guard.service';
import { HomePageComponent } from './components/home-page/home-page.component';
import {AuthInterceptor} from './services/interceptor/auth.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { VideochatComponent } from './components/videochat/videochat.component';
export const routes: Routes = [
  {path: 'auth', component: AuthComponent, canActivate: [LoginGuard]},
  {path: '', component: HomePageComponent, canActivate: [AuthGuard]},
  {path: 'videochat', component: VideochatComponent}
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
};
