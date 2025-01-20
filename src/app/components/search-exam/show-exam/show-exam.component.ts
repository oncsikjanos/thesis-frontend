import {Component, inject, Input} from '@angular/core';

import {DatabaseService} from '../../../services/database.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {Test} from '../../../model/Test';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-show-exam',
    imports: [
      MatTableModule,
      MatButtonModule,
    ],
  templateUrl: './show-exam.component.html',
  styleUrl: './show-exam.component.scss'
})
export class ShowExamComponent {

  @Input() tests: any;
  databaseService = inject(DatabaseService);
  authService = inject(AuthService);
  router = inject(Router);
  //receivedTest: Test[] = [];
  displayedColumns: string[] = ['subject', 'type', 'date', 'limit', 'teacher', 'open'];

  onApplyExam(id: string, test: any){
    this.databaseService.applyExam(id).subscribe({
      next: data => {
        test.students.push(this.authService.currentUserSignal()!.email)
        console.log(data.body)
      },
      error: err => {
        console.log(err.body);
      }
    })
  }

  onCancelExam(id: string, test: any){
    this.databaseService.cancelExam(id).subscribe({
      next: data => {
        test.students = test.students.filter((item: any) => item !== this.authService.currentUserSignal()!.email);
        console.log(data.body)
      },
      error: err => {
        console.log(err.body);
      }
    })
  }

  convertDateFormat(date: string){
    const dateNew = new Date(date);
    const time = dateNew.toTimeString().split(':');

    return dateNew.toLocaleDateString('hu-HU') + ' ' + time[0] + ':' + time[1];
  }
}
