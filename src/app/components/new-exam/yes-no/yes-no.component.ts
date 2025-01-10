import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-yes-no',
    imports: [
      MatCardModule,
      MatIconModule,
      MatButtonModule,
      MatCheckboxModule,
      MatInputModule,
      FormsModule,
      MatButtonToggleModule,
    ],
  templateUrl: './yes-no.component.html',
  styleUrl: './yes-no.component.scss'
})
export class YesNoComponent {
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  questionNumber: number = 1;
  questionTitle: string = "What is the capital of France?";
  options : string[] = [];
  goodAnswerIndex: number = 0;
  points: number = 0;
  maxPoints: number = 25;
  minPoints: number = 1;


  addQuestion() {
    this.options.push('New Question '+this.options.length);
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
  }

  onOptionChange(index: number, newValue: string) {

  }

  onPointChange(newValue: any){
    const number = Number(newValue.target.value);
    console.log("point changed: ", number);
    if(number<this.minPoints){
      this.points=this.minPoints;
    }else if(number>this.maxPoints){
      this.points=this.maxPoints
    }
    console.log("new point: ", this.points);
  }

  checkOptions() {
    console.log(this.options);
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
          this.imagePreview = reader.result; // Save the image data for preview
        };
        reader.readAsDataURL(file); // Read the file as a Data URL

        console.log('Selected file:', this.selectedFile);
      } else {
        console.error();
      }
    }
  }

  onTitleChange(newTitle: string){
    console.log("newTitle: ",newTitle);
    console.log("questionTitle: ",this.questionTitle);
  }

  check(){

  }
}
