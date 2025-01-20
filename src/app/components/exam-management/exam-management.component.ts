import {Component, inject, OnInit} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import {DatabaseService} from '../../services/database.service';
import {ShowExamComponent} from './show-exam/show-exam.component';
import {MatCardModule} from '@angular/material/card';
import {Router} from '@angular/router';

@Component({
  selector: 'app-exam-management',
  imports: [
    MatTableModule,
    MatButtonModule,
    ShowExamComponent,
    MatCardModule,
  ],
  templateUrl: './exam-management.component.html',
  styleUrl: './exam-management.component.scss'
})
export class ExamManagementComponent implements OnInit {
  databaseService = inject(DatabaseService)
  router = inject(Router);

  maxExamNumber: number = 5;
  myTestsInProgress = []

  ngOnInit(): void {
    this.databaseService.getTestsInProgress().subscribe({
      next: data => {
        this.myTestsInProgress = data.body.tests;
      }
    })
  }

  createNewTest(): void {
    this.databaseService.createTest().subscribe({
      next: data => {
        this.router.navigate(['/newexam', data.body.id]);
      },
      error: error => {
        console.log(error);
      }
    })
  }

}
