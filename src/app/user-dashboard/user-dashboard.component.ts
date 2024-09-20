import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { LeaveService } from '../leave.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
leaveDate = '';
  leaveReason = '';
  leaveHistory: any[] = [];
  leavedays: any;

  constructor(private authService: AuthService,
    private leaveservice: LeaveService
  ) {
    this.refreshLeaveHistory();
  }

  // Apply for leave and save it to the user's leave history
  applyLeave() {
    const currentUser = this.authService.getCurrentUser();
    this.leaveservice.addLeaveRequest(currentUser.username, { date: this.leaveDate,days: this.leavedays, reason: this.leaveReason, status: 'Pending' });
    alert('Leave Applied');
    this.refreshLeaveHistory(); // Refresh the leave history after applying
  }

  // Refresh the leave history from localStorage to get the latest updates
  refreshLeaveHistory() {
    const currentUser = this.authService.getCurrentUser();
    this.leaveHistory = currentUser.leaves;
  }
}
