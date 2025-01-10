import { Component, inject } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MultipleChoiceComponent } from "./multiple-choice/multiple-choice.component";
import { YesNoComponent } from "./yes-no/yes-no.component";

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
    MultipleChoiceComponent,
    YesNoComponent
],
  templateUrl: './new-exam.component.html',
  styleUrl: './new-exam.component.scss'
})
export class NewExamComponent {
  formBuilder = inject(FormBuilder);

  newExamForm: FormGroup;

  examTypes: string[] = ['yes or no', 'multiple choice', 'online-video', 'open-ended'];
  subjects: string[] = ['Math', 'Science', 'History', 'English', 'Chemistry', 'Physics', 'Biology', 'Geography', 'Computer Science', 'Art', 'Music', 'Physical Education', 'Foreign Languages', 'Other'];

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

}
