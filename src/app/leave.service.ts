import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private dailySalary: number = 100; // Set daily salary here
  private allowedLeaveDays: number = 5; // Allowed leave days

  constructor() { }
  
  getLeaveRequests() {
    const emp = JSON.parse(localStorage.getItem('emp') || '[]');
    return emp.filter((user: any) => user.role === 'user').flatMap((user: any) => {
      return user.leaves.map((leave: any, index: number) => {
        const salaryDeduction = leave.days > this.allowedLeaveDays ? (leave.days - this.allowedLeaveDays) * this.dailySalary : 0;
        const totalSalary = user.salary - salaryDeduction; // Calculate total salary after deduction
        return {
          employeeId: user.Id,
          employeeDepartment: user.department,
          username: user.username,
          date: leave.date,
          reason: leave.reason,
          type: leave.type,
          status: leave.status,
          days: leave.days,
          deduction: salaryDeduction, // Store deduction
          totalSalary,
          employeeSalary: user.salary, // Add total salary to the leave object
          leaveIndex: index
        };
      });
    });
  }

  addLeaveRequest(username: string, leave: any) {
    const emp = JSON.parse(localStorage.getItem('emp') || '[]');
    const user = emp.find((u: any) => u.username === username);
    if(!user){
      return;
    }
    const salaryDeduction = leave.days > this.allowedLeaveDays ? (leave.days - this.allowedLeaveDays) * this.dailySalary : 0;
    const totalSalary = user.salary - salaryDeduction;
    user.leaves.push({
      ...leave,
      deduction: salaryDeduction,
      totalSalary: totalSalary,
    });
    localStorage.setItem('emp', JSON.stringify(emp));
  }
  acceptLeaveRequest(username: string, leaveIndex: number) {
    const emp = JSON.parse(localStorage.getItem('emp') || '[]');
    const user = emp.find((u: any) => u.username === username);

    if (!user || !user.leaves[leaveIndex]) {
      return;
    }

    // Change leave status to accepted
    user.leaves[leaveIndex].status = 'Accepted';

    // Save the updated employee data back to localStorage
    localStorage.setItem('emp', JSON.stringify(emp));
  }
  rejectLeaveRequest(username: string, leaveIndex: number) {
    const emp = JSON.parse(localStorage.getItem('emp') || '[]');
    const user = emp.find((u: any) => u.username === username);

    if (!user || !user.leaves[leaveIndex]) {
      return;
    }

    // Change leave status to rejected
    user.leaves[leaveIndex].status = 'Rejected';

    // Save the updated employee data back to localStorage
    localStorage.setItem('emp', JSON.stringify(emp));
  }

  updateLeaveRequest(username: string, leaveIndex: number, status: string) {
    const emp = JSON.parse(localStorage.getItem('emp') || '[]');
    const user = emp.find((u: any) => u.username === username);
    
    if (user && user.leaves[leaveIndex]) {
      user.leaves[leaveIndex].status = status;

      // If the status is rejected, set deduction to zero and total salary to original salary
      // if (status === 'Rejected') {
      //   const leave = user.leaves[leaveIndex];
      //   leave.deduction = 0;
      //   leave.totalSalary = user.salary; 
      // }
    }

    localStorage.setItem('emp', JSON.stringify(emp));
  }
  private calculateSalaryDeduction(days: number): number {
    const unpaidLeaveDays = days > this.allowedLeaveDays ? (days - this.allowedLeaveDays) : 0;
    return unpaidLeaveDays * this.dailySalary;
  }
}
