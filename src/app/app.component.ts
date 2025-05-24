import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { DatabaseService } from './services/database.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  dbService = inject(DatabaseService);
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(){
    this.getUserData();
  }

  private getUserData(){
    this.dbService.getUser().subscribe({
      next: (stateMessage) => {
        if(stateMessage.body.success && stateMessage.status == 202){
          console.log(stateMessage.body);
          this.authService.currentUserSignal.set({
            email: stateMessage.body.user.email,
            name: stateMessage.body.user.name,
            dateOfBirth: stateMessage.body.user.dateOfBirth,
            role: stateMessage.body.user.role,
            pfp: stateMessage.body.user.pfp,
            description: stateMessage.body.user.description,
          });
          //this.router.navigate(['/']);
        }
        else{
          this.authService.currentUserSignal.set(null);
          this.router.navigate(['/auth']);
        }
      },
      error: () => {
        this.authService.currentUserSignal.set(null);
        this.router.navigate(['/auth']);
      }
    })
  }

  title = 'thesis-frontend';
}
