import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../user';
import { UserService } from '../user.service';
import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', [
      'getUsers',
      'deleteUser',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getUsers on init', () => {
      const usersMock: User[] = [
        { id: 1, name: 'Henry', email: 'henry@skalitz.com' },
        { id: 2, name: 'Radzig', email: 'radzig@skalitz.com' },
        { id: 3, name: 'Robard', email: 'robard@talmberg.com' },
      ];
      mockUserService.getUsers.and.returnValue(of(usersMock));

      component.ngOnInit();

      expect(mockUserService.getUsers).toHaveBeenCalled();
      expect(component.users).toEqual(usersMock);
    });
  });

  describe('onDeleteHoldStart', () => {
    it('should initialize progress and loadUserId on hold start', () => {
      component.onDeleteHoldStart(42);

      expect(component.loadUserId).toBe(42);
      expect(component.progress).toBe(0);
      expect(component.progressInterval).toBeDefined();
      expect(component.holdTimeout).toBeDefined();
      component.onDeleteHoldEnd(); // Clean up after test
    });

    it('should increment progress every 50ms', fakeAsync(() => {
      component.onDeleteHoldStart(42);
      tick(100); // Simulate 2 intervals passing

      expect(component.progress).toBe(4); // 2% progress after 100ms
      component.onDeleteHoldEnd(); // Clean up after test
    }));

    it('should call deleteUser after 2 seconds', fakeAsync(() => {
      mockUserService.deleteUser.and.returnValue(of(undefined));
      mockUserService.getUsers.and.returnValue(of([]));

      component.onDeleteHoldStart(42);
      tick(2000); // Simulate 2 seconds passing

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(42);
      expect(component.progress).toBe(0);
      expect(component.loadUserId).toBeUndefined();
      component.onDeleteHoldEnd(); // Clean up after test
    }));
  });

  describe('onDeleteHoldEnd', () => {
    it('should clean up timers and reset state on hold end', () => {
      component.onDeleteHoldStart(42);

      component.onDeleteHoldEnd();

      expect(component.loadUserId).toBeUndefined();
      expect(component.progressInterval).toBeUndefined();
      expect(component.holdTimeout).toBeUndefined();
      expect(component.progress).toBe(0);
    });
  });

  describe('deleteUser', () => {
    it('should call deleteUser and refresh the user list', () => {
      const usersMock: User[] = [
        { id: 1, name: 'Henry', email: 'henry@skalitz.com' },
        { id: 2, name: 'Radzig', email: 'radzig@skalitz.com' },
      ];
      mockUserService.deleteUser.and.returnValue(of(undefined));
      mockUserService.getUsers.and.returnValue(of(usersMock));

      component.deleteUser(3);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(3);
      expect(mockUserService.getUsers).toHaveBeenCalled();
      expect(component.users).toEqual(usersMock);
    });

    it('should handle undefined id gracefully', () => {
      mockUserService.deleteUser.and.returnValue(of(undefined));
      mockUserService.getUsers.and.returnValue(of([]));

      component.deleteUser(undefined);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(undefined);
      expect(mockUserService.getUsers).toHaveBeenCalled();
      expect(component.users).toEqual([]);
    });
  });

  describe('editUser', () => {
    it('should navigate to the edit user page with the correct id', () => {
      const userId = 1;

      component.editUser(userId);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/users/edit', userId]);
    });

    it('should handle undefined id gracefully', () => {
      component.editUser(undefined);

      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/users/edit',
        undefined,
      ]);
    });
  });
});
