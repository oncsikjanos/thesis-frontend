import {Component, inject, OnInit} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule} from '@angular/material/tabs';
import {DatabaseService} from '../../services/database.service';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {MatIcon} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SnackbarComponent} from '../snackbar/snackbar.component';

@Component({
  selector: 'app-administration',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTabsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    MatIcon,
    MatPrefix,
    FormsModule,
  ],
  providers: [provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'hu-HU' },],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.scss'
})
export class AdministrationComponent implements OnInit {
  databaseService = inject(DatabaseService);
  formBuilder = inject(FormBuilder)
  snackBar = inject(MatSnackBar)

  adminColums = ['name', 'email', 'role', 'button']
  resultColums = ['subject', 'date', 'student', 'result']

  newResults: { [key: string]: any } = {};
  users:any = [];
  results:any = [];

  adminForm: FormGroup;
  resultForm: FormGroup;

  filteredUsers: any;
  filteredResults: any;

  constructor() {
    this.adminForm = this.formBuilder.group({
      name: [''],
      email : [''],
    })

    this.resultForm = this.formBuilder.group({
      subject: [''],
      date : [''],
    })

    this.adminForm.valueChanges.subscribe(() => this.filterAdmins());
    this.resultForm.valueChanges.subscribe(() => this.filterResults())
  }

  ngOnInit() {
    this.databaseService.getUsers().subscribe({
      next: data => {
        this.users = data.body.users;
        this.filteredUsers = [...this.users]
        console.log(this.users)
        },
      error: err => {
        console.error(err.error);
      }
    })

    this.databaseService.getUnValuatedResults().subscribe({
      next: data => {
        this.results = data.body.results;
        this.filteredResults = [...this.results];
        console.log(this.results)
      },
      error: err => {
        console.error(err.error);
      }
    })
  }

  convertDateFormat(date: string){
    const dateNew = new Date(date);

    return dateNew.toLocaleDateString('hu-HU');
  }

  filterAdmins() {
    const { name, email } = this.adminForm.value;

    this.filteredUsers = this.users.filter((user: { name: string; email: string; }) => {
      return (
        (!name || user.name.toLowerCase().includes(name.toLowerCase())) &&
        (!email || user.email.toLowerCase().includes(email.toLowerCase()))
      );
    });

    if (!name && !email) {
      this.filteredUsers = [...this.users];
    }

  }

  filterResults() {
    const { subject, date } = this.resultForm.value;

    this.filteredResults = this.results.filter((result: { subject: string; startTill: string; }) => {
      return (
        (!subject || result.subject.toLowerCase().includes(subject.toLowerCase())) &&
        (!date || new Date(result.startTill).toDateString() === new Date(date).toDateString())
      );

    });

    if (!subject && !date) {
      this.filteredResults = [...this.results];
    }

  }

  makeAdmin(email: any){
    this.databaseService.makeAdmin(email).subscribe({
      next: data => {
        this.createSnackbar('Successfuly set admin role!', 'check', 'success');
        this.databaseService.getUsers().subscribe({
          next: data => {
            this.users = data.body.users;
            this.filterAdmins()
            console.log(this.users)
          },
          error: err => {
            console.error(err.error);
          }
        })
      },
      error: err => {
        this.createSnackbar(err.error.error, 'cancel', 'error')
      }
    })
  }

  revoke(email: any){
    this.databaseService.makeStudent(email).subscribe({
      next: data => {
        this.createSnackbar('Successfuly revoked admin role!', 'check', 'success');
        this.databaseService.getUsers().subscribe({
          next: data => {
            this.users = data.body.users;
            this.filterAdmins()
            console.log(this.users)
          },
          error: err => {
            console.error(err.error);
          }
        })
      },
      error: err => {
        this.createSnackbar(err.error.error, 'cancel', 'error')
      }
    })
  }

  setResult(result: any, id: any){
    this.databaseService.setResult(result, id).subscribe({
      next: data => {
        this.createSnackbar('Successful result setting!', 'check', 'success');
        this.databaseService.getUnValuatedResults().subscribe({
          next: data => {
            this.results = data.body.results;
            this.filterResults()

          },
          error: err => {
            console.error(err.error);
          }
        })
      },
      error: err => {
        this.createSnackbar(err.error.error, 'cancel', 'error');
      }
    })
  }

  createSnackbar(message: string, icon: string, type: string){
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message: message,
        icon: icon,
        class: type
      },
      duration: 1000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

}
