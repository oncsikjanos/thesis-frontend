import {Component, inject, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-results',
  imports: [
    MatPaginatorModule,
    MatTableModule,
    NgClass,
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  databaseSerivce = inject(DatabaseService)

  results: any;

  displayedColumns: string[] = ['subject', 'date',  'teacher', 'result'];


  ngOnInit() {
    this.databaseSerivce.getResult().subscribe({
      next: results => {
        this.results = results.body.results.sort(
          (a: any, b: any) => new Date(b.startTill).getTime() - new Date(a.startTill).getTime()
        );
        console.log(results.body.results);
      },
      error: err => {
        console.error(err.error.error);
      }
    })
  }

  convertDateFormat(date: string){
    const dateNew = new Date(date);

    return dateNew.toLocaleDateString('hu-HU');
  }

  getResultClass(value: string | number): string {
    if (value === 'Didnt appear') {
      return 'red-text';
    }
    if (value === 'Waiting for teacher') {
      return 'light-green-text';
    }

    const num = Number(value)
    if (num >= 0 && num < 30) {
      return 'red-text';
    } else if (num >= 30 && num < 50) {
      return 'orange-text';
    } else if (num >= 50 && num < 70) {
      return 'yellow-text';
    } else if (num >= 70 && num < 90) {
      return 'light-green-text';
    } else if (num >= 90) {
      return 'green-text';
    }
    return ''; // Default class
  }

}
