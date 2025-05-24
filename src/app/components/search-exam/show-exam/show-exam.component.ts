import {AfterViewInit, Component, inject, Input, OnInit, ViewChild} from '@angular/core';

import {DatabaseService} from '../../../services/database.service';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {Test} from '../../../model/Test';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-show-exam',
    imports: [
      MatTableModule,
      MatButtonModule,
      MatPaginatorModule,
      MatSortModule,
    ],
  templateUrl: './show-exam.component.html',
  styleUrl: './show-exam.component.scss'
})
export class ShowExamComponent implements AfterViewInit, OnInit{
  @ViewChild('paginator') paginator!: MatPaginator;
  @Input() tests: any;

  databaseService = inject(DatabaseService);
  authService = inject(AuthService);
  router = inject(Router);
  showSource =new MatTableDataSource<any>();
  //receivedTest: Test[] = [];
  displayedColumns: string[] = ['subject', 'type', 'date', 'limit', 'teacher', 'open'];

  ngAfterViewInit() {
    this.showSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.showSource.data = this.tests;
  }

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
