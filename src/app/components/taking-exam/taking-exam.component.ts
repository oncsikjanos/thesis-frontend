import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DatabaseService} from '../../services/database.service';
import {Question} from '../../model/Question';
import {TakeMultipleComponent} from './take-multiple/take-multiple.component';
import {TakeYesNoComponent} from './take-yes-no/take-yes-no.component';
import {FormsModule} from '@angular/forms';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import { MatPrefix} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-taking-exam',
  imports: [
    TakeMultipleComponent,
    TakeYesNoComponent,
    FormsModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatPrefix,
    MatButtonModule,
  ],
  templateUrl: './taking-exam.component.html',
  styleUrl: './taking-exam.component.scss'
})
export class TakingExamComponent implements OnInit, OnDestroy {
  activatedRoute = inject(ActivatedRoute);
  databaseService = inject(DatabaseService);
  router = inject(Router);

  subject: any;

  endDate: any;
  timer: any;
  timerInterval: any;

  testId: any;
  questions: Question[] | null = null;

  ngOnInit() {
    this.testId = this.activatedRoute.snapshot.paramMap.get('id');

    this.databaseService.startTest(this.testId).subscribe({
      next: (result) => {
        console.log(result.body.end);
        this.endDate = new Date(result.body.end);
        this.initialTime();
        this.startTimer();
        this.databaseService.getExamQuestions(this.testId).subscribe({
          next: (data) => {
            this.questions = data.body.questions;
            this.subject = data.body.subject;
          },
          error: (error) => {
            alert(error.error.error);
            this.databaseService.finishTest(this.testId).subscribe()
            this.router.navigate(['/']);
          }
        });
      },
      error: (error) => {
        alert(error.error.error);
        this.databaseService.finishTest(this.testId).subscribe()
        this.router.navigate(['/']);
      }
    });
  }
  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      const differenceInMilliseconds = this.endDate.getTime() - new Date().getTime();

      if (differenceInMilliseconds <= 0) {
        this.databaseService.finishTest(this.testId).subscribe()
        this.timer = '00:00';
        clearInterval(this.timerInterval); // Stop the timer if time is up
        alert('Time is up!');
        this.router.navigate(['/results']);
        return;
      }

      const hours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
      const minutes = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)) + hours * 60;
      const seconds = Math.floor((differenceInMilliseconds % (1000 * 60)) / 1000);

      this.timer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  initialTime() {
    const time = this.time
    this.timer = `${time[0].toString().padStart(2, '0')}:${time[1].toString().padStart(2, '0')}`;
  }

  onFinish() {
    this.databaseService.finishTest(this.testId).subscribe(
      result => {
        this.router.navigate(['/results']);
      }
    )
  }

  get time(){
    const milis = this.endDate.getTime() - new Date().getTime();

    const hours = Math.floor(milis / (1000 * 60 * 60));
    const minutes = Math.floor((milis % (1000 * 60 * 60)) / (1000 * 60)) + hours * 60;
    const seconds = Math.floor((milis % (1000 * 60)) / 1000);

    return [minutes, seconds];
  }
}
