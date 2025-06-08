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
  private router = inject(Router);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.getUsers();
  }

  deleteUser(id?: number): void {
    this.userService.deleteUser(id).subscribe(() => this.getUsers());
  }

  editUser(id?: number): void {
    this.router.navigate(['/users/edit', id]);
  }

  private getUsers(): void {
    this.userService
      .getUsers()
      .subscribe((data: User[]) => (this.users = data));
  }
}
