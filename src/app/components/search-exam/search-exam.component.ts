import {Component, inject, OnInit} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {ShowExamComponent} from './show-exam/show-exam.component';
import {DatabaseService} from '../../services/database.service';

@Component({
  selector: 'app-search-exam',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatIconModule,
    ShowExamComponent,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'hu-HU' },
  ],
  templateUrl: './search-exam.component.html',
  styleUrl: './search-exam.component.scss'
})
export class SearchExamComponent implements OnInit {
  databaseService = inject(DatabaseService)

  takeAbleExams: any;

  ngOnInit() {
    this.databaseService.getTakeAbleExams().subscribe({
      next: data => {
        console.log(data.body);
        this.takeAbleExams = data.body.tests;
      }
    })
  }

  getSubjects(){
    return ['Math'];
  }

}
