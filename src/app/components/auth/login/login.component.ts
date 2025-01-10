import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormGroup, Validators, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {SnackbarComponent} from '../../snackbar/snackbar.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorMessages} from '../../../errors/error-messages';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent{
  @Output() authShowEvent = new EventEmitter<string>();

  readonly errorMessages = ErrorMessages;
  loginForm: FormGroup;
  authService = inject(AuthService)
  router = inject(Router)
  snackBar = inject(MatSnackBar)

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email : ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,]],
    });
  }

  onLogin(){
    const form = this.loginForm.getRawValue();
    if(!this.checkLoginValuesEmpty(form)){
      this.createSnackbar(this.errorMessages.AUTH.GENERIC.EMPTY_FIELDS, 'cancel', 'error');
      return;
    }

    else if(!this.checkEmailValid()){
      this.createSnackbar(this.errorMessages.AUTH.EMAIL.INVALID, 'cancel', 'error');
      return;
    }

    this.authService.login(form.email, form.password).subscribe({
      next: () => {
        console.log(form);
        console.log("Logged in successfully");
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log("Error:", error);
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


  onRegisterClick(event: Event) {
    event.preventDefault(); // Prevent default link behavior
    this.authShowEvent.emit('register');
  }

  checkLoginValuesEmpty(form: any){
    if(form.email === '' || form.password === ''){
      return false;
    }
    return true;
  }

  checkEmailValid(){
    const control = this.loginForm.get('email');
    if(control?.hasError('email') && control?.touched && !control?.hasError('required')){
      return false;
    }
    return true;
  }

get emailErrors() {
  const control = this.loginForm.get('email');
  return {
    required: control?.hasError('required') && control?.touched,
    email: control?.hasError('email') && control?.touched && !control?.hasError('required')
    };
  }

get passwordErrors() {
  const control = this.loginForm.get('password');
  return {
    required: control?.hasError('required') && control?.touched
    };
  }

}
