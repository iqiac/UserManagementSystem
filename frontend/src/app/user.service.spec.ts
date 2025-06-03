import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all users via GET', () => {
    const dummyUsers = [
      { id: 1, name: 'Henry', email: 'henry@skalitz.com' },
      { id: 2, name: 'Radzig', email: 'radzig@skalitz.com' },
      { id: 3, name: 'Robard', email: 'robard@talmberg.com' },
    ];

    service.getUsers().subscribe((users) => {
      expect(users.length).toBe(3);
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should retrieve a user by ID via GET', () => {
    const dummyUser = { id: 1, name: 'Henry', email: 'henry@skalitz.com' };

    service.getUser(1).subscribe((user) => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should create a user via POST', () => {
    const newUser = { name: 'Henry', email: 'henry@skalitz.com' };

    service.createUser(newUser).subscribe((user) => {
      expect(user).toEqual({ id: 1, ...newUser });
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush({ id: 1, ...newUser });
  });

  it('should update a user via PUT', () => {
    const updatedUser = { id: 1, name: 'Henry', email: 'henry@skalitz.com' };

    service.updateUser(updatedUser).subscribe((user) => {
      expect(user).toEqual(updatedUser);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedUser);
    req.flush(updatedUser);
  });

  it('should delete a user via DELETE', () => {
    service.deleteUser(1).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/users/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
