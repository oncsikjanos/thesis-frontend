import {Component, inject, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatButtonModule} from '@angular/material/button';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-my-exams',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'hu-HU' },
  ],
  templateUrl: './my-exams.component.html',
  styleUrl: './my-exams.component.scss'
})
export class MyExamsComponent implements OnInit {
  databaseService = inject(DatabaseService)
  authService = inject(AuthService)
  router = inject(Router);

  isAdmin: boolean = this.authService.currentUserSignal()!.role === 'admin';

  tests: any[] = [];
  takeAbleExams: any;
  subjects: string[] = []
  displayedColumns: string[] = ['subject', 'type', 'fromDate', 'tillDate', 'teacher', 'open'];


  constructor() {}

  ngOnInit() {
    if(this.isAdmin) {
      this.databaseService.getAppliedExamAsTeacher().subscribe({
        next: data => {
          this.tests = data.body.tests.sort(
            (a: any, b: any) => new Date(a.startableFrom).getTime() - new Date(b.startableFrom).getTime()
          );
          //this.tests = data.body.tests;
          console.log(data.body.tests)
        },
        error: error => {
          console.error(error);
        }
      });
    }else {
      this.databaseService.getAppliedExams().subscribe({
        next: data => {
          this.tests = data.body.tests.sort(
            (a: any, b: any) => new Date(a.startableFrom).getTime() - new Date(b.startableFrom).getTime()
          );
          //this.tests = data.body.tests;
          console.log(data.body.tests)
        },
        error: error => {
          console.error(error);
        }
      });
    }
  }

  convertDateFormat(date: string){
    const dateNew = new Date(date);
    const time = dateNew.toTimeString().split(':');

    return dateNew.toLocaleDateString('hu-HU') + ' ' + time[0] + ':' + time[1];
  }

  getCurrentDate(){
    return new Date();
  }

  convertToDate(date: any){
    return new Date(date);
  }

  onTake(testId: string){
    this.databaseService.canTakeTest(testId).subscribe({
      next: data => {
        const type = data.body.type;
        if(type === 'videocall'){
          this.router.navigate(['/videochat/'+testId]);
        }else{
          this.router.navigate(['/takeexam/'+testId]);
        }
      }
    })
  }

  onCancel(id:any){
    this.databaseService.cancelExam(id).subscribe({
      next: data => {
        this.databaseService.getAppliedExams().subscribe({
          next: data => {
            this.tests = data.body.tests.sort(
              (a: any, b: any) => new Date(a.startableFrom).getTime() - new Date(b.startableFrom).getTime()
            );
            //this.tests = data.body.tests;
            console.log(data.body.tests)
          }
        })
        console.log(data.body)
      },
      error: err => {
        console.log(err.body);
      }
    })
  }

}
