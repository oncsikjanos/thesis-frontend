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
import {QuestionComponent} from './components/new-exam/question/question.component';
import {MyProfileComponent} from './components/my-profile/my-profile.component';
import {ExamManagementComponent} from './components/exam-management/exam-management.component';
import {SearchExamComponent} from './components/search-exam/search-exam.component';
import {MyExamsComponent} from './components/my-exams/my-exams.component';
import {TakingExamComponent} from './components/taking-exam/taking-exam.component';
import { ResultsComponent } from './components/results/results.component';

export const routes: Routes = [
  {path: 'auth', component: AuthComponent, canActivate: [LoginGuard]},
  {path: '', component: HomePageComponent, canActivate: [AuthGuard],
    children: [
      {path: 'admin', component: AdministrationComponent},
      {path: 'newexam', component: ExamManagementComponent},
      {path: 'videochat/:id', component: VideochatComponent},
      {path: 'myprofile', component: MyProfileComponent},
      {path: 'newexam/:id', component: NewExamComponent},
      {path: 'searchexam', component: SearchExamComponent},
      {path: 'myexams', component: MyExamsComponent},
      {path: 'takeexam/:id', component: TakingExamComponent},
      {path: 'results', component: ResultsComponent},
    ]
  },
  {path: 'question', component: QuestionComponent},
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
};
