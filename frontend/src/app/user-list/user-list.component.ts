import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  deleteUser(id?: number): void {
    this.userService.deleteUser(id).subscribe(() => this.getUsers());
  }

  private getUsers(): void {
    this.userService
      .getUsers()
      .subscribe((data: User[]) => (this.users = data));
  }
}
