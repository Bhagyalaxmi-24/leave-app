import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  id='';
  username = '';
  password = '';
  department = '';
  salary = 0;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    const newUser = {
      Id: this.id,
      username: this.username,
      password: this.password,
      department: this.department,
      salary: this.salary,
      role: 'user',
      leaves: []
    };
  
    if (this.authService.register(newUser)) {  // Check if registration is successful
      alert('Registration successful! You can now log in.');
      this.router.navigate(['/login']);
    }else {
      alert('Registration failed. Employee ID already exists.');
    }
  
  }
  

    
}
