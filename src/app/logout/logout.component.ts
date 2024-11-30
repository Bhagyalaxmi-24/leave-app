import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor(private router: Router) {}

  logout() {
    // Clear any authentication tokens or user data here

    // Navigate to the login component
    this.router.navigate(['/login']); // Assumes your login route is configured as 'login'
  }

}
