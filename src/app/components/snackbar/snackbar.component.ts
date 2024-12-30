import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [MatIconModule],
  styleUrl: './snackbar.component.scss',
  template: `
    <div class="{{data.class}} snackbar-container">
      <mat-icon class="snackbar-icon">{{ data.icon }}</mat-icon>
      <span class="snackbar-message">{{ data.message }}</span>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
    }
  `]
})
export class SnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string; icon: string, class: string }) {}
}