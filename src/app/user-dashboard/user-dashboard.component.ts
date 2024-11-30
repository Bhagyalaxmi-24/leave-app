import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { LeaveService } from '../leave.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent  {
leaveDate = '';
  leaveReason = '';
  // leaveHistory: any[] = [];
  leavedays: any;
  
  leaveHistory: any[]=[];
  salary: any;
  leaveType='';

  constructor(private authService: AuthService,
    private leaveservice: LeaveService
  ) 
  {
    // this.refreshLeaveHistory();
  }

  // Apply for leave and save it to the user's leave history
  applyLeave() {
    const currentUser = this.authService.getCurrentUser();
    const leaveDays=Number(this.leavedays);
//     let status='pending';
//     let deduction=0
//     this.leaveservice.addLeaveRequest(currentUser.username, { date: this.leaveDate,days: this.leavedays, reason: this.leaveReason, status: 'Pending', deduction: deduction});
//     alert('Leave Applied');
//     // this.refreshLeaveHistory(); // Refresh the leave history after applying
  
//     if(leaveDays>5){
//       const extraDays=leaveDays-5;
//       const dailySalary=currentUser.salary/30;
//       deduction =extraDays * dailySalary;
//       status='Pending (Deduction:₹${deduction.toFixed(2)} )';
//     }
//     const leaveRequest = {
//       date: this.leaveDate,
//       days: leaveDays,
//       reason: this.leaveReason,
//       salary: currentUser.salary,
//       status: 'Pending',
//       deduction: deduction,
//       totalSalary: currentUser.salary - deduction // Calculate total salary after deduction
//     };
  
   
   
    
//   }


  
// }
if (!this.leaveDate || !leaveDays || !this.leaveType) {
  alert('Please fill in all required fields.');
  return;
}

// Leave Policy
const leavePolicy : { [key: string]: number }  = {
  'Casual Leave': 10,
  'Sick Leave': 10,
  'Paid Leave': 20,
  'Maternity/Paternity Leave': 180, // Approx. 26 weeks
};

let remainingDays = leavePolicy[this.leaveType] || 0;
let status = 'Pending';
let deduction = 0;

if (leaveDays > remainingDays) {
  const extraDays = leaveDays - remainingDays;
  const dailySalary = currentUser.salary / 30;
  deduction = extraDays * dailySalary;
  status = `Pending (Deduction: ₹${deduction.toFixed(2)})`;
} else {
  remainingDays -= leaveDays; // Deduct leave days if within allowed range
}

// Create leave request object
const leaveRequest = {
  date: this.leaveDate,
  days: leaveDays,
  type: this.leaveType,
  reason: this.leaveReason,
  salary: currentUser.salary,
  status: status,
  deduction: deduction,
  totalSalary: currentUser.salary - deduction, // Total salary after deduction
};

// Save leave request to the user's history
this.leaveservice.addLeaveRequest(currentUser.username, leaveRequest);

alert('Leave Applied Successfully!');

// Update leave history and clear form
this.refreshLeaveHistory();
this.clearForm();
}

/**
* Refresh the leave history for the logged-in user.
*/
refreshLeaveHistory() {
const currentUser = this.authService.getCurrentUser();
this.leaveHistory = currentUser.leaves || [];
}

/**
* Clear the form fields after leave is applied.
*/
clearForm() {
this.leaveDate = '';
this.leavedays = '';
this.leaveReason = '';
this.leaveType = '';
}
}
