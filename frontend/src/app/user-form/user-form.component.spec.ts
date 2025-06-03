import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from '../user.service';
import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let mockUserService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockUserService = {
      getUser: jasmine.createSpy('getUser').and.returnValue(
        of({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        })
      ),
      createUser: jasmine.createSpy('createUser').and.returnValue(of({})),
      updateUser: jasmine.createSpy('updateUser').and.returnValue(of({})),
    };
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };
    mockActivatedRoute = {
      snapshot: {
        paramMap: { get: jasmine.createSpy('get') },
      },
    };

    await TestBed.configureTestingModule({
      imports: [UserFormComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isEditMode to true and load user data when id is present', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');

      component.ngOnInit();

      expect(component.isEditMode).toBeTrue();
      expect(mockUserService.getUser).toHaveBeenCalledWith(1);
      expect(component.user).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      });
    });

    it('should not set isEditMode and load user if id does not exist', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);

      component.ngOnInit();

      expect(component.isEditMode).toBeFalse();
      expect(mockUserService.getUser).not.toHaveBeenCalled();
      expect(component.user).toEqual({
        id: undefined,
        name: '',
        email: '',
      });
    });
  });

  describe('onSubmit', () => {
    it('should call updateUser if in edit mode', () => {
      component.isEditMode = true;
      component.user = {
        id: 1,
        name: 'Updated User',
        email: 'updated@example',
      };

      component.onSubmit();

      expect(mockUserService.updateUser).toHaveBeenCalledWith(component.user);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
    });

    it('should call createUser if not in edit mode', () => {
      component.isEditMode = false;
      component.user = {
        id: undefined,
        name: 'New User',
        email: 'new@example.com',
      };

      component.onSubmit();

      expect(mockUserService.createUser).toHaveBeenCalledWith(component.user);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
    });
  });

  describe('onCancel', () => {
    it('should navigate to the users list', () => {
      component.onCancel();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
    });
  });
});
