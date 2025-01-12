import { Component, inject } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {Question} from '../../model/Question';
import {QuestionComponent} from './question/question.component';
import {MAT_TIMEPICKER_CONFIG, MatTimepickerModule} from '@angular/material/timepicker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import { MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-new-exam',
  imports: [
    MatStepperModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    QuestionComponent,
    FormsModule,
    MatTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'hu-HU' },
    { provide: MAT_TIMEPICKER_CONFIG, useValue: {interval: '15 minutes'} }
  ],
  templateUrl: './new-exam.component.html',
  styleUrl: './new-exam.component.scss'
})
export class NewExamComponent {
  formBuilder = inject(FormBuilder);

  newExamForm: FormGroup;
  pointDeduction: boolean = false;

  examTypes: string[] = ['yes or no', 'multiple choice', 'online-video', 'open-ended'];
  subjects: string[] = ['Math', 'Science', 'History', 'English', 'Chemistry', 'Physics', 'Biology', 'Geography', 'Computer Science', 'Art', 'Music', 'Physical Education', 'Foreign Languages', 'Other'];
  questions: Question[] = [];
  selectedType: 'yes or no' | 'multiple choice' | null = null;

  constructor() {
    this.newExamForm = this.formBuilder.group({
      examType: ['', Validators.required],
      subject: ['', Validators.required],
      examName: ['', Validators.required],
      examStartDate: ['', Validators.required],
      examStartTime: ['', Validators.required],
      examDuration: ['', Validators.required],
    });
  }


  getExamTypes(): string[] {
    return this.examTypes;
  }

  getSubjects(): string[] {
    return this.subjects;
  }

  onNext() {
    console.log(this.newExamForm.value);
  }

  addNewQuestion(){
    if(this.selectedType){
      this.questions.push({
        type: this.selectedType,
        question: "New question",
        options: [],
        points: 1,
        goodOption: null,
        picture: null
      });
    }
  }

  checkQuestions(){
    console.log(this.questions);
  }

}
