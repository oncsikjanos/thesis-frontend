import {Component, inject, OnInit} from '@angular/core';
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
import { ActivatedRoute, Router} from '@angular/router';

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
export class NewExamComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  databaseService = inject(DatabaseService);
  authService = inject(AuthService);
  router = inject(Router);
  activatedRoute= inject(ActivatedRoute);

  debounceTime: number = 1500;
  private debounceTimer: any;

  testId: string | null = null;
  newTest: Test | null = null;
  newExamForm: FormGroup;
  videoCall = false;
  pointDeduction: boolean = false;

  examTypes: string[] = ['yes or no', 'multiple choice'];
  subjects: string[] = ['Math', 'Science', 'History', 'English', 'Chemistry', 'Physics', 'Biology', 'Geography', 'Computer Science', 'Art', 'Music', 'Physical Education', 'Foreign Languages', 'Other'];
  questions: string[] = [];
  selectedType: 'yes or no' | 'multiple choice' | null = null;

  ngOnInit() {
    this.testId = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.testId){
      this.databaseService.getTestToEdit(this.testId).subscribe({
        next: test => {
          this.newTest = test.body.test;
          if(this.newTest!.questions){
            this.questions = this.newTest!.questions;

          }
          console.log(test.body.test);
          console.log(this.newTest);
          let durationDate: Date = new Date();
          durationDate.setHours(this.newTest!.duration/60, this.newTest!.duration%60)
          const setExamValues = {
              subject: this.newTest!.subject,
              examDate: this.newTest!.startableFrom,
              examStartTime: this.newTest!.startableFrom,
              examEndTime: this.newTest!.startableTill,
              examDuration: durationDate,
              pointDeduction: this.newTest!.poinDeduction,
              limit: this.newTest!.limit,
              videocall: this.newTest!.videocall,
          }
          this.newExamForm.patchValue(setExamValues)
          console.log(setExamValues);
          this.newExamForm.valueChanges.subscribe((changes) => {
            this.onBasicTestFormChange();
          });
        },
        error: error => {
          this.router.navigateByUrl('newexam');
        }
      });
    }
    console.log(this.newTest);
    // Track value changes on the whole form

  }

  constructor() {
    this.newExamForm = this.formBuilder.group({
      subject: ['', Validators.required],
      examDate: ['', Validators.required],
      examStartTime: ['', Validators.required],
      examEndTime: ['', Validators.required],
      examDuration: ['', Validators.required],
      pointDeduction: ['', Validators.required],
      videocall: ['', Validators.required],
      limit: ['', Validators.required],
    });
  }

  getExamTypes(): string[] {
    return this.examTypes;
  }

  getSubjects(): string[] {
    return this.subjects;
  }

  onNext() {
  }

  dateToMinuteConvert(date: Date) {
    return (date.getHours()) * 60 + date.getMinutes();
  }

  addNewQuestion(){
    if(this.selectedType){
      this.databaseService.addQuestion(this.selectedType, this.testId!).subscribe({
        next: data => {
          const questionId = data.body.id;
          this.questions.push(questionId);
          console.log(this.questions);
        },
        error: error => {
          console.log(error.body.error);
        }
      })
    }
  }

  deleteQuestion(index: number){
    console.log(index)
    this.databaseService.deleteQuestion(this.questions[index-1], this.testId!).subscribe({
      next: data => {
        this.questions.splice(index-1, 1);
      },
      error: error => {
        console.error(error.body.error);
      }
    })
  }

  sendTest(){
    this.onNext();
    //this.newTest!.questions = this.questions;
    //this.newTest.teachers.push(this.authService.currentUserSignal()!.email);
    console.log(this.newTest);
    this.databaseService.addTest(this.newTest!).subscribe();
  }

  onBasicTestFormChange(){
    console.log(this.newExamForm.value)
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.saveDataToDB();
    }, this.debounceTime);
  }

  saveDataToDB(){
    const from: Date = new Date(this.newExamForm.controls['examStartTime'].value);
    const till: Date = new Date(this.newExamForm.controls['examEndTime'].value);

    let updateFormat = {
      subject: this.newExamForm.controls['subject'].value,
      startableFrom: new Date(this.newExamForm.controls['examDate'].value),
      startableTill: new Date(this.newExamForm.controls['examDate'].value),
      duration: this.newExamForm.controls['examDuration'].value,
      poinDeduction: this.newExamForm.controls['pointDeduction'].value,
      videocall: this.newExamForm.controls['videocall'].value,
      limit: this.newExamForm.controls['limit'].value,
    }
    updateFormat.startableFrom.setHours(from.getHours(), from.getMinutes())
    updateFormat.startableTill.setHours(till.getHours(), till.getMinutes());

    updateFormat.duration =this.dateToMinuteConvert(new Date(this.newExamForm.controls['examDuration'].value));
    console.log('changed ', updateFormat);

    this.databaseService.updateTest(this.newTest!._id, updateFormat).subscribe({
      next: data => {
        console.log(data);
        console.log("Successfully updated data");
      },
      error: error => {
        console.log(error);
        console.log("Error updating data");
      }
    });
  }

}
