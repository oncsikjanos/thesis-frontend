import {Component, inject, OnInit} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {ShowExamComponent} from './show-exam/show-exam.component';
import {DatabaseService} from '../../services/database.service';
import {AsyncPipe, NgForOf} from '@angular/common';
import {map, Observable, startWith} from 'rxjs';

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
    ReactiveFormsModule,
    AsyncPipe,
    NgForOf,
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
  formBuilder = inject(FormBuilder);

  filteredSubjects: Observable<string[]> = new Observable<string[]>();
  searchForm: FormGroup;

  takeAbleExams: any;
  subjects: string[] = []

  constructor() {
    this.searchForm = this.formBuilder.group({
      subject: ['', [Validators.required],],
      date: ['', [Validators.required],]
    });
  }

  ngOnInit() {
    this.databaseService.getTakeAbleExams().subscribe({
      next: data => {
        console.log(data.body);
        this.takeAbleExams = data.body.tests;
      }
    })

    this.databaseService.getSubjects().subscribe({
      next: data => {
        this.subjects = data.body.subjects;
        console.log(data.body.subjects);
      },
      error: error => {
        return [''];
      }
    })

    this.filteredSubjects = this.searchForm.get('subject')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  searchTests(){
    this.databaseService.getTakeAbleExams(this.searchForm.value.date, this.searchForm.value.subject).subscribe({
      next: data => {
        console.log(data.body);
        this.takeAbleExams = data.body.tests;
      }
    })

    console.log(this.searchForm.value)
  }

  resetDate(){
    this.searchForm.reset({
      subject: '',
    })
  }

  resetSubject(){
    this.searchForm.reset({
      date: '',
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.subjects.filter(subject =>
      subject.toLowerCase().includes(filterValue)
    );
  }
}
