import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {DatabaseService} from '../../../services/database.service';
import {User} from '../../../model/User';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerform: FormGroup;
  authService = inject(AuthService);
  databaseService = inject(DatabaseService);
  router = inject(Router);

  constructor(private formBuilder: FormBuilder) {
    this.registerform = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email : ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    });
  }

  onRegister(){
    const form = this.registerform.getRawValue()
    this.authService.register(form.email, form.password).subscribe(() =>{
      console.log(form);
      console.log("Registered successfully");
      this.router.navigate(['/']);
    })
  }

  testDatabase(){
    const form = this.registerform.getRawValue()

    let user: User = {
      userId: "23",
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      dateOfBirth: form.dateOfBirth,
      role: 'Student'
    };

    console.log(user);
    this.databaseService.register(user).subscribe({
      next: (response) => {
        console.log('Response:', response);
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }
}
