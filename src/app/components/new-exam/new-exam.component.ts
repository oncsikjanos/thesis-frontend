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
import {Test} from '../../model/Test';
import {DatabaseService} from '../../services/database.service';
import {AuthService} from '../../services/auth.service';

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
  databaseService = inject(DatabaseService);
  authService = inject(AuthService);

  newTest: Test = {
    subject: '',
    startableFrom: new Date(),
    startableTill: new Date(),
    poinDeduction: null,
    duration: 0,
    videocall: false,
    questions: [],
    students: [],
    teachers: []
  }

  newExamForm: FormGroup;
  pointDeduction: boolean = false;

  examTypes: string[] = ['yes or no', 'multiple choice', 'online-video', 'open-ended'];
  subjects: string[] = ['Math', 'Science', 'History', 'English', 'Chemistry', 'Physics', 'Biology', 'Geography', 'Computer Science', 'Art', 'Music', 'Physical Education', 'Foreign Languages', 'Other'];
  questions: Question[] = [];
  selectedType: 'yes or no' | 'multiple choice' | null = null;

  constructor() {
    this.newExamForm = this.formBuilder.group({
      subject: ['', Validators.required],
      examDate: ['', Validators.required],
      examStartTime: ['', Validators.required],
      examEndTime: ['', Validators.required],
      examDuration: ['', Validators.required],
      pointDeduction: ['', Validators.required],
    });
  }


  getExamTypes(): string[] {
    return this.examTypes;
  }

  getSubjects(): string[] {
    return this.subjects;
  }

  onNext() {
    const from: Date = this.newExamForm.controls['examStartTime'].value
    const till: Date = this.newExamForm.controls['examEndTime'].value;

    this.newTest.subject = this.newExamForm.controls['subject'].value;
    this.newTest.startableFrom = new Date(this.newExamForm.controls['examDate'].value);
    this.newTest.startableTill = new Date(this.newExamForm.controls['examDate'].value);
    this.newTest.startableFrom.setHours(from.getHours(), from.getMinutes());
    this.newTest.startableTill.setHours(till.getHours(), till.getMinutes());
    this.newTest.duration = this.dateToMinuteConvert(this.newExamForm.controls['examDuration'].value);
    this.newTest.poinDeduction = this.newExamForm.controls['pointDeduction'].value;

    console.log("form: ",this.newExamForm.value);
    console.log("test: ",this.newTest);
  }

  dateToMinuteConvert(date: Date) {
    return (date.getHours() + 1) * 24 + date.getMinutes() + 1;
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

  deleteQuestion(index: number){
    console.log(index)
    this.questions.splice(index-1, 1);
  }

  sendTest(){
    this.onNext();
    this.newTest.questions = this.questions;
    this.newTest.teachers.push(this.authService.currentUserSignal()!.email);
    console.log(this.newTest);
    this.databaseService.addTest(this.newTest).subscribe();
  }
}
