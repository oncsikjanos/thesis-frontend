import {Component, inject, Input} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {Question} from '../../../model/Question';
import {DatabaseService} from '../../../services/database.service';

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
  @Input() question: Question | null = null;

  databaseService = inject(DatabaseService);

  debounceTime: number = 1500;
  private debounceTimer: any;

  addQuestion() {
    this.question!.options.push({
      text: 'New Question ' + this.question!.options.length,
      value: null
    });
    this.onValueChange();
  }

  removeOption(index: number) {
    this.question!.options.splice(index, 1);
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
