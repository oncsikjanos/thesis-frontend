import {Component, inject, OnInit} from '@angular/core';

import {Test} from '../../../model/Test';
import {MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {DatabaseService} from '../../../services/database.service';
import {AuthService} from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-exam',
  imports: [
    MatTableModule,
    MatButtonModule,
  ],
  templateUrl: './show-exam.component.html',
  styleUrl: './show-exam.component.scss'
})
export class ShowExamComponent  implements OnInit {
  databaseService = inject(DatabaseService);
  authService = inject(AuthService);
  router = inject(Router);
  receivedTest: Test[] = [];
  displayedColumns: string[] = ['subject', 'type', 'limit', 'teacher', 'open', 'delete'];

  ngOnInit(): void {
    this.databaseService.getTestsInProgress().subscribe({
      next: data => {
        this.receivedTest = data.body.tests;
      }
    });
  }

  onOpenExam(id: string){
    this.router.navigate(['/newexam', id]);
  }

  onDeleteExam(id: string){
    this.databaseService.deleteTest(id).subscribe({
      next: data => {
        console.log(data.body.message);
        this.databaseService.getTestsInProgress().subscribe({
          next: data => {
            this.receivedTest = data.body.tests;
          }
        });
      },
      error: err => {
        console.error(err.body.error);
      }
    })
  }
}
