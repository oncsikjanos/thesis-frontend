import {Component, EventEmitter, Input, Output} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-multiple-choice',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatRadioGroup,
    MatRadioButton,
    FormsModule,
  ],
  templateUrl: './multiple-choice.component.html',
  styleUrl: './multiple-choice.component.scss'
})
export class MultipleChoiceComponent {
  @Input() options: string[] = [];
  @Output() goodOptionChange = new EventEmitter<string | null>();

  goodAnswerIndex: number = 0;

  addQuestion() {
    this.options.push('New Question '+this.options.length);
    this.goodOptionChange.emit(this.options[this.goodAnswerIndex])
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
    if(this.goodAnswerIndex === index){
      this.goodAnswerIndex = 0;
    }
    this.goodOptionChange.emit(this.options[this.goodAnswerIndex])
  }

  onGoodAnswerChange(){
    this.goodOptionChange.emit(this.options[this.goodAnswerIndex])
  }

}
