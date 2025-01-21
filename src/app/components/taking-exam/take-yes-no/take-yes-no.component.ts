import {Component, inject, Input, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';

@Component({
  selector: 'app-take-yes-no',
    imports: [
        FormsModule,
        MatButtonToggle,
        MatButtonToggleGroup,
        MatIcon,
    ],
  templateUrl: './take-yes-no.component.html',
  styleUrl: './take-yes-no.component.scss'
})
export class TakeYesNoComponent implements OnInit {
  @Input() question: any;

  router = inject(Router);

  answers:{[key: string]: boolean | 'null'} = {}

  activatedRoute = inject(ActivatedRoute)
  databaseService = inject(DatabaseService);

  testId: any;

  ngOnInit(): void {
    this.testId = this.activatedRoute.snapshot.params['id'];
    console.log(this.testId);
    console.log(this.question);
    this.databaseService.loadAnswer(this.question._id).subscribe({
      next: data => {
        this.answers = data.body.answer;
        console.log(this.answers);
      },
      error: err => {
        console.log(err.error.error);
      }
    })
  }

  onValueChange() {
    console.log(this.answers);
    const sendAnswer = {
      answer: this.answers,
      questionId: this.question._id,
    }

    this.databaseService.startTest(this.testId).subscribe({
      next: data => {
        this.databaseService.saveAnswer(this.testId, sendAnswer).subscribe({
          next: (data) => {
            console.log(data.body.message)
          },
          error: (err) => {
            console.error(err.error.error);
          }
        })
      },
      error: err => {
        this.databaseService.finishTest(this.testId).subscribe()
        alert('Time is up!');
        this.router.navigate(['/results']);
      }
    });

  }
}
