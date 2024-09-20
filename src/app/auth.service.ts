import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private emp = [
    { username: 'user1', password: 'password', role: 'user', leaves: [] },
    { username: 'admin', password: 'admin123', role: 'admin' }
  ];

  constructor() {
    if (!localStorage.getItem('emp')) {
      localStorage.setItem('emp', JSON.stringify(this.emp));
    }
  }

  login(username: string, password: string, role: string) {
    const users = JSON.parse(localStorage.getItem('emp') || '[]');
    return users.find((user: any) => user.username === username && user.password === password && user.role === role);
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  setCurrentUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
