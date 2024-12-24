import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent],
  styleUrl: './auth.component.scss',
  template: `
      <div class="auth-container">
        <!--<div class="tabs">
          <button [class.active]="activeTab === 'login'" (click)="activeTab = 'login'">Login</button>
          <button [class.active]="activeTab === 'register'" (click)="activeTab = 'register'">Register</button>
        </div>
        <app-login *ngIf="activeTab === 'login'"></app-login>
        <app-register *ngIf="activeTab === 'register'"></app-register>-->
        <app-login></app-login>
      </div>
  `
})
export class AuthComponent {
  activeTab: 'login' | 'register' = 'login';
}
