import { Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log("Logged out successfully");
        this.router.navigate(['/auth']);
      }
    });
  }
}
