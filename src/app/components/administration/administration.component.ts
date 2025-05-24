import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
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
export class AdministrationComponent implements OnInit, AfterViewInit {
  @ViewChild('usersPaginator') usersPaginator!: MatPaginator;
  @ViewChild('resultsPaginator') resultsPaginator!: MatPaginator;

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

  filteredUsers = new MatTableDataSource<any>();
  filteredResults = new MatTableDataSource<any>();

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
        this.filteredUsers.data = this.users;
        },
      error: err => {
        console.error(err.error);
      }
    })

    this.databaseService.getUnValuatedResults().subscribe({
      next: data => {
        this.results = data.body.results;
        this.filteredResults.data = this.results;
      },
      error: err => {
        console.error(err.error);
      }
    })
  }

  ngAfterViewInit() {
    // Attach the paginators after the view initializes
    this.filteredUsers.paginator = this.usersPaginator;
    this.filteredResults.paginator = this.resultsPaginator;
    console.log(this.usersPaginator);
  }

  convertDateFormat(date: string){
    const dateNew = new Date(date);

    return dateNew.toLocaleDateString('hu-HU');
  }

  filterAdmins() {
    const { name, email } = this.adminForm.value;

    const filteredData = this.users.filter((user: { name: string; email: string }) => {
      return (
        (!name || user.name.toLowerCase().includes(name.toLowerCase())) &&
        (!email || user.email.toLowerCase().includes(email.toLowerCase()))
      );
    });

    this.filteredUsers.data = filteredData;
  }

  filterResults() {
    const { subject, date } = this.resultForm.value;

    const filteredData = this.results.filter((result: { subject: string; startTill: string }) => {
      return (
        (!subject || result.subject.toLowerCase().includes(subject.toLowerCase())) &&
        (!date || new Date(result.startTill).toDateString() === new Date(date).toDateString())
      );
    });

    this.filteredResults.data = filteredData;
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
