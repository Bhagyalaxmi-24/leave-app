import { Component } from '@angular/core';
//import { Router } from 'express';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  role = 'user';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    const user = this.authService.login(this.username, this.password, this.role);
    if (user) {
      this.authService.setCurrentUser(user);
      if (user.role === 'user') {
        this.router.navigate(['/user-dashboard']);
      } else if (user.role === 'admin') {
        this.router.navigate(['/admin-dashboard']);
      }
    } else {
      alert('Invalid Credentials');
    }
  }
}
