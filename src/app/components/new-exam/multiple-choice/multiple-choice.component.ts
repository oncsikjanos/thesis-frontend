import {Component, inject, Input} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';
import {Question} from '../../../model/Question';
import {DatabaseService} from '../../../services/database.service';

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
  @Input() question: Question | null = null;

  databaseService = inject(DatabaseService);

  debounceTime: number = 1500;
  private debounceTimer: any;

  goodAnswerIndex: number = 0;

  addQuestion() {
    this.question!.options.push('New Question '+ this.question!.options.length);
    this.question!.goodOption =  this.question!.options[this.goodAnswerIndex];
    this.onValueChange();
  }

  removeOption(index: number) {
    this.question!.options.splice(index, 1);
    if(this.goodAnswerIndex === index){
      this.goodAnswerIndex = 0;
    }
    this.question!.goodOption =  this.question!.options[this.goodAnswerIndex];
    this.onValueChange();
  }

  onGoodAnswerChange(){
    this.question!.goodOption =  this.question!.options[this.goodAnswerIndex];
    this.onValueChange();
  }

  onValueChange(){
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.databaseService.updateQuestion(this.question!._id, this.question!).subscribe();
    }, this.debounceTime);
  }

}
