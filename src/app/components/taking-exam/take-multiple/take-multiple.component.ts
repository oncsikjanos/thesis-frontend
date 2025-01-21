import {Component, inject, Input, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../../services/database.service';

@Component({
  selector: 'app-take-multiple',
    imports: [
        FormsModule,
        MatRadioButton,
        MatRadioGroup
    ],
  templateUrl: './take-multiple.component.html',
  styleUrl: './take-multiple.component.scss'
})
export class TakeMultipleComponent implements OnInit {
  @Input() question: any;

  activatedRoute = inject(ActivatedRoute)
  databaseService = inject(DatabaseService);
  router = inject(Router);

  testId: any;
  goodAnswerIndex: number | null = null;
  answer: any;

  ngOnInit() {
    this.testId = this.activatedRoute.snapshot.params['id'];
    console.log(this.testId);
    console.log(this.question);

    this.databaseService.loadAnswer(this.question._id).subscribe({
      next: data => {
        this.answer = data.body.answer;
        console.log(this.answer);
        this.goodAnswerIndex = this.question.options.indexOf(this.answer);
      },
      error: err => {
        console.error(err.error.error);
      }
    })
  }

  onGoodAnswerChange(){
    if(typeof(this.goodAnswerIndex) === "number"){
      this.answer = this.question.options[this.goodAnswerIndex];
      console.log(this.answer);
      const sendAnswer = {
        answer: this.answer,
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
      })

    }
  }
}
