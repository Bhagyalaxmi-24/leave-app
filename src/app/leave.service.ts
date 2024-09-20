import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {

  constructor() { }

  getLeaveRequests() {
    const emp = JSON.parse(localStorage.getItem('emp') || '[]');
    return emp.filter((user: any) => user.role === 'user').map((user: any) => {
      return user.leaves.map((leave: any, index: number) => ({
        username: user.username,
        date: leave.date,
        reason: leave.reason,
        status: leave.status,
        days: leave.days,
        leaveIndex: index
      }));
    }).flat();
  }

  // Add a leave request to the specific user
  addLeaveRequest(username: string, leave: any) {
    const emp = JSON.parse(localStorage.getItem('emp') || '[]');
    const user = emp.find((u: any) => u.username === username);
    user.leaves.push(leave);
    localStorage.setItem('emp', JSON.stringify(emp));
  }

  // Update the status of a leave request for both the admin and the user
  updateLeaveRequest(username: string, leaveIndex: number, status: string) {
    const emp = JSON.parse(localStorage.getItem('emp') || '[]');
    const user = emp.find((u: any) => u.username === username);
    if (user && user.leaves[leaveIndex]) {
      user.leaves[leaveIndex].status = status;
    }
    localStorage.setItem('emp', JSON.stringify(emp));
  }
}
