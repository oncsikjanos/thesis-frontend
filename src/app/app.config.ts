import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'
import {provideHttpClient} from '@angular/common/http';
import {AuthComponent} from './components/auth/auth.component';
import { AuthGuard, LoginGuard } from './services/auth-guard.service';
import { HomePageComponent } from './components/home-page/home-page.component';
import { VideochatComponent } from './components/videochat/videochat.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { NewExamComponent } from './components/new-exam/new-exam.component';
import {MultipleChoiceComponent} from './components/new-exam/multiple-choice/multiple-choice.component';
import {YesNoComponent} from './components/new-exam/yes-no/yes-no.component';

export const routes: Routes = [
  {path: 'auth', component: AuthComponent, canActivate: [LoginGuard]},
  {path: '', component: HomePageComponent, canActivate: [AuthGuard],
    children: [
      {path: 'admin', component: AdministrationComponent},
      {path: 'newexam', component: NewExamComponent},
      {path: 'videochat', component: VideochatComponent}
    ]
  },
  {path: 'multiple', component: MultipleChoiceComponent},
  {path: 'yesno', component: YesNoComponent},
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
};
