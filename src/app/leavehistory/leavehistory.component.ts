import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { LeaveService } from '../leave.service';

@Component({
  selector: 'app-leavehistory',
  templateUrl: './leavehistory.component.html',
  styleUrls: ['./leavehistory.component.css'],
})
export class LeavehistoryComponent {
  leaveHistory: any[] = [];
  totalYearlyFreeLeaves = 24; // Total yearly free leaves
  remainingYearlyLeaves = this.totalYearlyFreeLeaves;
  totalLeaves = {
    sickLeave: 10,
    maternityLeave: 182,
    paidLeave: 20,
    casualLeave: 10,
  };
  yearlyLeaveSummary: any = null;

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

      const yearlyLeaveUsage: { [key: string]: number } = {
        sickLeave: 0,
        maternityLeave: 0,
        paidLeave: 0,
        casualLeave: 0,
      };

      const monthlyLeaveCount: { [key: string]: number } = {};
      let usedFreeLeaves = 0;

      let totalSalary = employee.salary; // Start with full salary

      this.leaveHistory = employee.leaves.map((leave: any) => {
        const leaveDate = new Date(leave.date);
        const monthYearKey = `${leaveDate.getFullYear()}-${leaveDate.getMonth() + 1}`;
        monthlyLeaveCount[monthYearKey] = (monthlyLeaveCount[monthYearKey] || 0) + leave.days;

        let unpaidDays = 0;
        let deduction = 0;

        if (leave.status === 'Accepted') {
          // Deduct from yearly free leaves first
          let remainingFreeLeaves = Math.max(0, this.totalYearlyFreeLeaves - usedFreeLeaves);
          const freeLeavesToUse = Math.min(remainingFreeLeaves, leave.days);

          usedFreeLeaves += freeLeavesToUse;
          const remainingDaysAfterFree = leave.days - freeLeavesToUse;

          // Deduct from leave type balance
          let remainingLeaveBalance = leaveBalances[leave.type] || 0;
          const paidDays = Math.min(remainingLeaveBalance, remainingDaysAfterFree);

          leaveBalances[leave.type] = Math.max(0, remainingLeaveBalance - remainingDaysAfterFree);
          unpaidDays = remainingDaysAfterFree - paidDays;

          // Deduct salary for unpaid days
          if (unpaidDays > 0) {
            deduction = unpaidDays * (employee.salary / 30);
          }

          totalSalary -= deduction; // Update the total salary after deduction

          yearlyLeaveUsage[leave.type] = (yearlyLeaveUsage[leave.type] || 0) + leave.days;

          return {
            date: leave.date,
            type: leave.type,
            days: leave.days,
            reason: leave.reason,
            status: leave.status,
            employeeSalary: employee.salary,
            deduction: deduction,
            totalSalary: totalSalary,
            remainingDays: leaveBalances[leave.type],
          };
        } else {
          // For rejected leave, maintain the previous total salary and balances
          return {
            date: leave.date,
            type: leave.type,
            days: leave.days,
            reason: leave.reason,
            status: leave.status,
            employeeSalary: employee.salary,
            deduction: 0,
            totalSalary: totalSalary, // Keep the total salary unchanged
            remainingDays: leaveBalances[leave.type], // No change in leave balances
          };
        }
      });

      // Update remaining yearly free leaves
      this.remainingYearlyLeaves = Math.max(0, this.totalYearlyFreeLeaves - usedFreeLeaves);

      employee.leaveBalances = leaveBalances;
      employee.yearlyLeaveUsage = yearlyLeaveUsage;
      localStorage.setItem('emp', JSON.stringify(employees));
    }
  }
}
