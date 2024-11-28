import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent} from './components/auth/login/login.component';
import {NavbarComponent} from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'thesis-frontend';
}
