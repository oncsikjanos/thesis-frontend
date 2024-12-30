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
        <app-login *ngIf="activeTab === 'login'" (authShowEvent)="authShow($event)"></app-login>
        <app-register *ngIf="activeTab === 'register'" (authShowEvent)="authShow($event)"></app-register>
      </div>
  `
})
export class AuthComponent {
  activeTab: 'login' | 'register' = 'login';

  authShow(show: string) {
    this.activeTab = show === 'register' ? 'register' : 'login';
  }

}
