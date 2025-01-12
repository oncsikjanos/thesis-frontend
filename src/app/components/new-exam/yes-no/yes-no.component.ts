import {Component, Input} from '@angular/core';
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
  @Input() options: { text: string; value: any }[] = [];

  addQuestion() {
    this.options.push({
      text: 'New Question ' + this.options.length,
      value: null
    });
  }

  removeOption(index: number) {
    this.options.splice(index, 1);
  }
  isChecked(i: number){
    console.log('isChecked: ',this.options[i].value === null)
    return this.options[i].value === null
  }
}
