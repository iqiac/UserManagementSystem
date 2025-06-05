import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  user: User = { id: undefined, name: '', email: '' };
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.userService.getUser(+id).subscribe((user) => {
        this.user = user;
      });
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.userService
        .updateUser(this.user)
        .subscribe(() => this.gotoUserList());
    } else {
      this.userService
        .createUser(this.user)
        .subscribe(() => this.gotoUserList());
    }
  }

  onCancel(): void {
    this.gotoUserList();
  }

  gotoUserList(): void {
    this.router.navigate(['/users']);
  }
}
