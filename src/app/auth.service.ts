import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private emp = [
    { Id: '101', username: 'user1', department: 'CyberSecurity', password: 'password', role: 'user', salary: 50000, leaves: [] },
    { Id: '102', username: 'Ram', department: 'Data Management', password: 'Ram123', role: 'user', salary: 52000, leaves: [] },
    { Id: '103', username: 'user2', department: 'Project Management', password: 'password1', role: 'user', salary: 60000, leaves: [] },
    { Id: '104', username: 'Bhags', department: 'IT Support', password: 'Bhags123', role: 'user', salary: 59000, leaves: [] },
    { username: 'admin', password: 'admin123', role: 'admin' }
  ];

  constructor() {
    if (!localStorage.getItem('emp')) {
      localStorage.setItem('emp', JSON.stringify(this.emp));
    } else {
      this.syncEmpWithLocalStorage();
    }
  }

  private syncEmpWithLocalStorage() {
    const storedUsers = JSON.parse(localStorage.getItem('emp') || '[]');
    const mergedUsers = [...storedUsers];

    this.emp.forEach((newUser) => {
      const exists = storedUsers.some((user: any) => user.username === newUser.username);
      if (!exists) {
        mergedUsers.push(newUser);
      }
    });

    localStorage.setItem('emp', JSON.stringify(mergedUsers));
  }

  login(username: string, password: string, role: string) {
    const users = JSON.parse(localStorage.getItem('emp') || '[]');
    return users.find((user: any) => user.username === username && user.password === password && user.role === role);
  }

  register(newUser: any): boolean {  // Change return type to boolean
    const users = JSON.parse(localStorage.getItem('emp') || '[]');
  
    // Check for unique ID
    const exists = users.some((user: any) => user.Id === newUser.Id);
    if (exists) {
      alert('This Employee ID is already registered. Please use a different ID.');
      return false; // Indicate failure
    }
  
    users.push(newUser);
    localStorage.setItem('emp', JSON.stringify(users));
    return true; // Indicate success
  }
  

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  setCurrentUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  calculateSalaryAfterLeave(username: string, leavedays: number) {
    const users = JSON.parse(localStorage.getItem('emp') || '[]');
    const user = users.find((u: any) => u.username === username);
    const extraDays = leavedays > 5 ? leavedays - 5 : 0;
    const deduction = extraDays * 100; // 100 Rs per extra day
    user.salary -= deduction; // Deduct from total salary
    localStorage.setItem('emp', JSON.stringify(users));
    return user.salary;
  }
}
