import {Component, inject, Output, EventEmitter} from '@angular/core';
import {MatNativeDateModule,
  provideNativeDateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS} from '@angular/material/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, ValidationErrors, AbstractControl} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {DatabaseService} from '../../../services/database.service';
import {RegisterData} from '../../../model/RegisterData';
import {MatFormFieldModule,} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ErrorMessages} from '../../../errors/error-messages';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export const HUNGARIAN_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY.MM.DD',
  },
  display: {
    dateInput: 'YYYY.MM.DD',
    monthYearLabel: 'YYYY MMMM',
    dateA11yLabel: 'YYYY.MM.DD',
    monthYearA11yLabel: 'YYYY MMMM',
  },
};

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'hu-HU' },
    { provide: MAT_DATE_FORMATS, useValue: HUNGARIAN_DATE_FORMATS }
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  @Output() authShowEvent = new EventEmitter<string>();

  readonly errorMessages = ErrorMessages;
  registerForm: FormGroup;
  authService = inject(AuthService);
  databaseService = inject(DatabaseService);
  router = inject(Router);
  snackBar = inject(MatSnackBar)

  minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 100));
  // Set maximum date to 16 years ago (assuming minimum age is 16)
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 16));

  passwordCriteria = {
    length: false,
    number: false,
    uppercase: false,
    matching: false
  };


  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email : ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', [Validators.required, this.dateFormatValidator()]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]]
    });

        // Subscribe to password changes
        this.registerForm.get('password')?.valueChanges.subscribe(password => {
          this.checkPasswordCriteria(password);
        });

        // Subscribe to password confirmation changes
        this.registerForm.get('passwordConfirm')?.valueChanges.subscribe(() => {
          this.checkPasswordsMatch();
        });
  }

  onRegister(){
    const form: RegisterData = this.registerForm.getRawValue()

    if(this.checkRegisterValuesEmpty(form) || form.dateOfBirth === null){
      this.createSnackbar(this.errorMessages.AUTH.GENERIC.EMPTY_FIELDS, 'cancel', 'error');
      return;
    }

    if(this.checkRegisterValuesNotValid()){
      this.createSnackbar(this.errorMessages.AUTH.GENERIC.NOT_VALID, 'cancel', 'error');
      return;
    }

    form.dateOfBirth = this.convertDate(form.dateOfBirth);

    this.authService.register(form).subscribe({
      next: () => {
        console.log(form);
        console.log("Registered successfully");
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.createSnackbar(error.error.message, 'cancel', 'error');
      }
    });
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

  checkRegisterValuesEmpty(form: any){
    return Object.values(form).every(value => value === '');
  }

  checkRegisterValuesNotValid(){
    if(!this.nameErrors.required || !this.nameErrors.length){
      return false;
    }
    if(!this.emailErrors.required || !this.emailErrors.email){
      return false;
    }
    if(!this.dateOfBirthErrors.required || !this.dateOfBirthErrors.format || !this.dateOfBirthErrors.min || !this.dateOfBirthErrors.max){
      return false;
    }
    if(!this.passwordErrors.required || !this.passwordErrors.requirements){
      return false;
    }

    return true;
  }

  private checkPasswordCriteria(password: string) {
    this.passwordCriteria.length = password?.length >= 8;
    this.passwordCriteria.number = /\d/.test(password);
    this.passwordCriteria.uppercase = /[A-Z]/.test(password);
    this.checkPasswordsMatch();
  }

  private checkPasswordsMatch() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('passwordConfirm')?.value;
    this.passwordCriteria.matching = password === confirmPassword && password !== '';
  }

  private dateFormatValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      // Check if it's a valid Date object
      if (!(control.value instanceof Date) || isNaN(control.value.getTime())) {
        return { format: true };
      }

      // Check if date is within allowed range
      if (control.value < this.minDate || control.value > this.maxDate) {
        return control.value < this.minDate ? { min: true } : { max: true };
      }

      return null;
    };
  }

  private convertDate(date: any): string {
    return date.toISOString().split('T')[0].replace(/-/g, '.')+'.';
  }

  get emailErrors() {
    const control = this.registerForm.get('email');
    return {
      required: control?.hasError('required') && control?.touched,
      email: control?.hasError('email') && control?.touched && !control?.hasError('required')
      };
    }

  get nameErrors() {
    const control = this.registerForm.get('name');
    return {
      required: control?.hasError('required') && control?.touched,
      length: control?.hasError('minlength') && control?.touched
    };
  }

  get dateOfBirthErrors() {
    const control = this.registerForm.get('dateOfBirth');
    return {
      required: control?.hasError('required') && control?.touched,
      format: control?.hasError('format') && control?.touched,
      min: control?.hasError('min') && control?.touched,
      max: control?.hasError('max') && control?.touched
    };
  }

  get passwordErrors() {
    const control = this.registerForm.get('password');
    return {
      required: control?.hasError('required') && control?.touched,
      requirements: !(this.passwordCriteria.length &&
        this.passwordCriteria.number &&
        this.passwordCriteria.uppercase &&
        this.passwordCriteria.matching) &&
        control?.touched && !control?.hasError('required')
    };
  }

}
