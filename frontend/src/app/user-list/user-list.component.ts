import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loadUserId: number | undefined = undefined;
  progress = 0;
  progressInterval: ReturnType<typeof setInterval> | undefined = undefined;
  holdTimeout: ReturnType<typeof setTimeout> | undefined = undefined;
  private router = inject(Router);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.getUsers();
  }

  onDeleteHoldStart(id?: number) {
    this.loadUserId = id;
    this.progress = 0;

    this.progressInterval = setInterval(() => {
      if (this.progress < 100) {
        this.progress += 2; // 2s / (100 / 2) = 40 intervals, 50ms each
      }
    }, 50);

    this.holdTimeout = setTimeout(() => {
      this.deleteUser(id);
      this.onDeleteHoldEnd();
    }, 2000);
  }

  onDeleteHoldEnd() {
    clearTimeout(this.holdTimeout);
    clearInterval(this.progressInterval);
    this.holdTimeout = undefined;
    this.progressInterval = undefined;
    this.loadUserId = undefined;
    this.progress = 0;
  }

  deleteUser(id?: number) {
    this.userService.deleteUser(id).subscribe(() => this.getUsers());
  }

  editUser(id?: number) {
    this.router.navigate(['/users/edit', id]);
  }

  private getUsers() {
    this.userService
      .getUsers()
      .subscribe((data: User[]) => (this.users = data));
  }
}
