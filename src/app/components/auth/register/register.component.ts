import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerform: FormGroup;
  authService = inject(AuthService)
  router = inject(Router);

  constructor(private formBuilder: FormBuilder) {
    this.registerform = this.formBuilder.group({
      fullName: this.formBuilder.group({
        surName: [''],
        foreName:['']
      }),
      email : ['', Validators.required],
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
}
