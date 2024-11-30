import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { LeaveService } from '../leave.service';

@Component({
  selector: 'app-leavehistory',
  templateUrl: './leavehistory.component.html',
  styleUrls: ['./leavehistory.component.css']
})
export class LeavehistoryComponent {
  leaveHistory: any[] = [];
  totalLeaves = {
    sickLeave: 10,
    maternityLeave: 182,
    paidLeave: 20,
    casualLeave: 10,
  };

  constructor(private authService: AuthService, private leaveService: LeaveService) {
    this.refreshLeaveHistory();
  }

  ngOnInit() {
    this.refreshLeaveHistory();
  }

  refreshLeaveHistory() {
    const currentUser = this.authService.getCurrentUser();
    const employees = JSON.parse(localStorage.getItem('emp') || '[]');
    const employee = employees.find((e: any) => e.username === currentUser.username);

    if (employee) {
      const leaveBalances = employee.leaveBalances || {
        sickLeave: 10,
        maternityLeave: 182,
        paidLeave: 20,
        casualLeave: 10,
      };
      this.leaveHistory = employee.leaves.map((leave: any) => {
        const remainingDays = leaveBalances[leave.type] || 0;
        const unpaidDays = Math.max(0, leave.days - remainingDays);

        const deduction = unpaidDays * (employee.salary / 30);
        const totalSalary = employee.salary - deduction;

        // Update remaining days in leaveBalances
        leaveBalances[leave.type] = Math.max(0, remainingDays - leave.days);
        return {
          date: leave.date,
          type: this.formatLeaveType(leave.type),  // Make sure this matches with Angular template
          days: leave.days,
          reason: leave.reason,  // Make sure this matches with Angular template
          status: leave.status,
          employeeSalary: employee.salary,
          deduction: deduction,
          totalSalary: totalSalary,
          remainingDays: leaveBalances[leave.type],
        };
      });
      // Save updated leaveBalances back to localStorage
      employee.leaveBalances = leaveBalances;
      localStorage.setItem('emp', JSON.stringify(employees));
    }
  }

  formatLeaveType(type: string): string {
    switch (type) {
      case 'sickLeave':
        return 'Sick Leave';
      case 'maternityLeave':
        return 'Maternity/Paternity Leave';
      case 'paidLeave':
        return 'Paid Leave';
      case 'casualLeave':
        return 'Casual Leave';
      default:
        return 'Unknown Leave Type';
    }
  }
}
