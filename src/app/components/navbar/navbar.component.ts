import {Component, inject, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatIconButton} from '@angular/material/button';
import {NgOptimizedImage} from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {Overlay, OverlayModule, OverlayRef} from '@angular/cdk/overlay';

@Component({
  selector: 'app-navbar',
  imports: [
    MatIconModule,
    RouterLink,
    RouterLinkActive,
    MatIconButton,
    NgOptimizedImage,
    MatMenuModule,
    OverlayModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  pfp : string = '';
  isOpen: boolean = false;
  overlay = inject(Overlay);

  ngOnInit() {
    this.pfp = this.authService.currentUserSignal()!.pfp ?? '';
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log("Logged out successfully");
        this.router.navigate(['/auth']);
      }
    });
  }

  openOverlay() {
    const overlayRef = this.overlay.create({
      height: '400px',
      width: '600px',
    });
  }

}
