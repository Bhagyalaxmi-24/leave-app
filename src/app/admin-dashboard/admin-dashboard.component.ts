import { Component } from '@angular/core';
import { LeaveService } from '../leave.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  leaveRequests: any[] = [];

  constructor(private leaveService: LeaveService) {
    this.leaveRequests = this.leaveService.getLeaveRequests(); // Fetch all leave requests on component initialization
  }

  // Accept leave request
  acceptLeave(username: string, leaveIndex: number) {
    this.leaveService.updateLeaveRequest(username, leaveIndex, 'Accepted');
    this.leaveRequests = this.leaveService.getLeaveRequests(); // Refresh requests after accepting
    alert('Leave Accepted');
  }

  // Reject leave request
  rejectLeave(username: string, leaveIndex: number) {
    this.leaveService.updateLeaveRequest(username, leaveIndex, 'Rejected');
    this.leaveRequests = this.leaveService.getLeaveRequests(); // Refresh requests after rejecting
    alert('Leave Rejected');
  }
}
