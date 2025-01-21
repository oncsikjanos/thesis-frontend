import {Component, inject, OnInit, QueryList, ViewChildren} from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {FormBuilder, FormGroup, FormsModule, isFormGroup, Validators} from '@angular/forms';
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
import {SnackbarComponent} from '../snackbar/snackbar.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgForOf} from '@angular/common';
import {map, Observable, startWith} from 'rxjs';
import { CommonModule} from '@angular/common';

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
    MatCheckboxModule,
    NgForOf,
    CommonModule,
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
  @ViewChildren(QuestionComponent) questionComponents!: QueryList<QuestionComponent>;

  formBuilder = inject(FormBuilder);
  databaseService = inject(DatabaseService);
  authService = inject(AuthService);
  router = inject(Router);
  activatedRoute= inject(ActivatedRoute);
  snackBar = inject(MatSnackBar)
  filteredSubjects: Observable<string[]> = new Observable<string[]>();
  debounceTime: number = 1500;
  private debounceTimer: any;

  testId: string | null = null;
  newTest: Test | null = null;
  newExamForm: FormGroup;
  videoCall = false;
  pointDeduction: boolean = false;

  minDate = new Date();
  // Set maximum date to 16 years ago (assuming minimum age is 16)
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  examTypes: string[] = ['yes or no', 'multiple choice'];
  subjects: string[] = [];
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
              pointDeduction: this.newTest!.pointDeduction,
              limit: this.newTest!.limit,
              videocall: this.newTest!.videocall,
          }
          this.newExamForm.patchValue(setExamValues)
          console.log(setExamValues);
          this.pointDeduction = this.newExamForm.controls['pointDeduction'].value > 0;
          this.newExamForm.valueChanges.subscribe((changes) => {
            this.onBasicTestFormChange();
          });
        },
        error: error => {
          this.router.navigateByUrl('newexam');
        }
      });

      this.filteredSubjects = this.newExamForm.get('subject')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );

    }
    console.log(this.newTest);
    // Track value changes on the whole form
    this.databaseService.getSubjects().subscribe({
      next: data => {
        this.subjects = data.body.subjects;
        console.log(data.body.subjects);
      },
      error: error => {
        return [''];
      }
    })
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
      pointDeduction: this.newExamForm.controls['pointDeduction'].value,
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

  isVideoCall(){
    return this.newExamForm.controls['videocall'].value;
  }

  minTillDate(){
    return new Date (this.newExamForm.controls['examEndTime'].value);
  }

  finalizeExam(){
    const from: Date = new Date(this.newExamForm.controls['examStartTime'].value);
    const till: Date = new Date(this.newExamForm.controls['examEndTime'].value);

    let newFormat = {
      subject: this.newExamForm.controls['subject'].value,
      startableFrom: new Date(this.newExamForm.controls['examDate'].value),
      startableTill: new Date(this.newExamForm.controls['examDate'].value),
      duration: this.newExamForm.controls['examDuration'].value,
      pointDeduction: this.newExamForm.controls['pointDeduction'].value,
      videocall: this.newExamForm.controls['videocall'].value,
      limit: this.newExamForm.controls['limit'].value,
    }

    newFormat.startableFrom.setHours(from.getHours(), from.getMinutes())
    newFormat.startableTill.setHours(till.getHours(), till.getMinutes());

    if(!this.basicValidations(newFormat)){
      return;
    }

    if(this.isVideoCall()){
      this.databaseService.finalizeExam(this.newTest!._id).subscribe({
        next: data => {
          this.router.navigate(['myexams']);
        },
        error: error => {
          this.createSnackbar(error.body.error, 'cancel', 'error')
        }
        }
      );

    }
    else{
      if(this.moreValidation(newFormat)){
        this.databaseService.finalizeExam(this.newTest!._id).subscribe({
            next: data => {
              this.router.navigate(['myexams']);
            },
            error: error => {
              this.createSnackbar(error.body.error, 'cancel', 'error')
            }
          }
        );
      }
    }
  }

  basicValidations(videoCallFormat: any){
    if(!this.validateSubjectLength(videoCallFormat.subject)){
      this.createSnackbar('Subjects length is less than 3', 'cancel', 'error');
      return false;
    }

    if(!this.validatuserCount(videoCallFormat.limit)){
      this.createSnackbar('Valid user limit is between 20-100', 'cancel', 'error');
      return false;
    }

    if(!this.validateStartDate(new Date(videoCallFormat.startableFrom))){
       this.createSnackbar('Start date cant be in the past', 'cancel', 'error');
       return false;
    }

    if(!this.validateEndDate(new Date(videoCallFormat.startableTill),new Date(videoCallFormat.startableFrom))){
      this.createSnackbar('Exam end time cant be earlier than exam start time', 'cancel', 'error')
      return false;
    }

    return true;
  }

  validateSubjectLength(subject:string): boolean{
    return subject.length > 3;
  }

  validatuserCount(count:number){
    return count >= 20 && count <= 100;
  }

  validateStartDate(date:Date){
    return date > new Date();
  }

  validateEndDate(endDate:Date, startDate:Date){
    return endDate > startDate;
  }

  validateDuration(duration:number){
    return duration >= 15;
  }

  validatePointDeduction(point: number){
    if(!this.pointDeduction){
      return true;
    }
    return point >=0 && point <= 50;
  }

  validateQuestions(){
    let allValid = true;
    this.questionComponents.forEach((questionComponent) => {
      const isValid = questionComponent.validate();
      if (!isValid) {
        allValid = false;
      }
    });
    return allValid;
  }

  moreValidation(format:any){

    if(!this.validateDuration(format.duration)){
      this.createSnackbar('Duration at least has to be 15 mins', 'cancel', 'error')
      return false;
    }

    if(!this.validatePointDeduction(format.pointDeduction)){
      this.createSnackbar('Exam end time cant be earlier than exam start time', 'cancel', 'error')
      return false;
    }

    if(!this.validateQuestions()){
      alert("One or more questions are wrongly filled!\n" +
        "Rules:\n" +
        "Question and option text atleast 3 characters long.\n" +
        "Atleast 4 option for every question\n" +
        "For yes or no has to be picked yes or true\n" +
        "For multiple choice only one good option|n" +
        "One question can only worth between 1-15 points\n");
      return false;
    }

    return true;
  }

  createSnackbar(message: string, icon: string, type: string){
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message: message,
        icon: icon,
        class: type
      },
      duration: 1000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.subjects.filter(subject =>
      subject.toLowerCase().includes(filterValue)
    );
  }
}
