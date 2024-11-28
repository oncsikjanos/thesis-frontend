import {Component, inject} from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  authService = inject(AuthService)
  router = inject(Router)

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email : ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin(){
    const form = this.loginForm.getRawValue();
    this.authService.login(form.email, form.password).subscribe(() => {
      console.log(form)
      console.log("Logged in successfully");
      this.router.navigate(['/']);
    })
  }
}
