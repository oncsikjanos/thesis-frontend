import {Component, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MultipleChoiceComponent} from '../multiple-choice/multiple-choice.component';
import {YesNoComponent} from '../yes-no/yes-no.component';
import {Question} from '../../../model/Question';
import {DatabaseService} from '../../../services/database.service';

@Component({
  selector: 'app-question',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    FormsModule,
    MatButtonToggleModule,
    MultipleChoiceComponent,
    YesNoComponent
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent implements OnInit {
  @ViewChild(MultipleChoiceComponent) multipleChoiceComponent!: MultipleChoiceComponent;
  @ViewChild(YesNoComponent) yesNoComponent!: YesNoComponent;
  @ViewChild('fileInput') fileInput!: HTMLInputElement;
  @Input() questionNumber: number = 1;
  @Input() questionId: string | null = null;
  @Output() deleteAnswer = new EventEmitter();

  databaseService = inject(DatabaseService);

  debounceTime: number = 1500;
  private debounceTimer: any;

  question: Question | null = null;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  questionTitle: string = "New question title";
  maxPoints: number = 25;
  minPoints: number = 1;

  ngOnInit() {
    this.databaseService.getQuestion(this.questionId!).subscribe({
      next: data => {
        this.question = data.body.question;
        this.imagePreview = this.question!.picture;
        console.log(this.imagePreview);
      },
      error: err => {
        console.log(err);
      }
    })
  }

  addQuestion() {
    console.log("add question");
    console.log('is it multiple choice? ', this.question?.type === "multiple choice")
    console.log('is it yes or no? ', this.question?.type === "yes or no")
    if(this.question?.type === "multiple choice"){
      this.multipleChoiceComponent.addQuestion();
    }else if(this.question?.type === "yes or no"){
      this.yesNoComponent.addQuestion();
    }
  }

  onPointChange(newValue: any){
    const number = Number(newValue.target.value);
    console.log("point changed: ", number);
    if(number<this.minPoints){
      this.question!.points=this.minPoints;
    }else if(number>this.maxPoints){
      this.question!.points=this.maxPoints
    }
    this.onValueChange();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        this.selectedFile = file;
        // Create a FileReader to read the image file
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;// Save the image data for preview
        };
        reader.readAsDataURL(file); // Read the file as a Data URL
        const formData = new FormData();
        formData.append('picture', file);
        formData.append('questionId', this.question!._id);
        this.databaseService.addQuestionPicture(formData).subscribe({
          next: data => {
            console.log(data.body.picture);
          },
          error: err => {
            console.error(err.body.error);
          }
        });
        console.log('Selected file:', this.selectedFile);
      } else {
        console.error();
      }
    }
  }

  onDeletePicture(){
    console.log("before delete input: ", this.fileInput.value);
    this.selectedFile = null;
    this.imagePreview = null;
    this.fileInput.value = '';
    this.databaseService.deleteQuestionPicture(this.question!._id).subscribe({
      next: data => {
        console.log(data.body.message);
      },
      error: err => {
        console.error(err.body.error);
      }
    })
    console.log("after delete input: ", this.fileInput.value);
  }

  onTitleChange(newTitle: string){
    console.log("newTitle: ",newTitle);
    console.log("questionTitle: ",this.questionTitle);
    this.onValueChange();
  }

  onDelete() {
    this.deleteAnswer.emit(this.questionNumber);
  }

  onValueChange(){
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.databaseService.updateQuestion(this.question!._id, this.question!).subscribe();
    }, this.debounceTime);
  }

  validate(): boolean{
    if(this.question!.question.length < 3){
      console.error("question length error");
      return false;
    }

    if(!this.question!.options || this.question!.options.length < 4){
      console.error("options length error");
      return false;
    }

    if(this.question!.type === "multiple choice"){
      for(let element of this.question!.options){
        if(element.length < 3){
          console.error("multiple choice text length error");
          return false;
        }
      }

      if(!this.question!.goodOption){
        console.error("goodOption error");
        return false;
      }
    }

    if(this.question!.type === "yes or no"){
      for(let element of this.question!.options){
        //console.log('yes or no text length: ',element.text)
        if(element.text.length < 3){
          console.error("yer or no text length error");
          return false;
        }
        console.log("yer or no element values: ", element.value);
        if(element.value === "null"){
          console.error("yer or no null value error");
          return false;
        }
      }
    }

    if(this.question!.points < 1 || this.question!.points > 25){
      console.error("points error");
      return false;
    }

    return true
  }

}
