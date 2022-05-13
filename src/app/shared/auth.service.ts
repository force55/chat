import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
// User interface
export class User {
  name!: String;
  email!: String;
  password!: String;
  password_confirmation!: String;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  // User registration

  refreshToken() {
    return this.http.post('http://192.168.1.18:80/api/auth/refresh', '',{headers: { "Content-Type": "application/json"}});
  }
  register(user: User): Observable<any> {
    return this.http.post('http://192.168.1.18:80/api/auth/register', user);
  }
  // Login
  signin(user: User): Observable<any> {
    return this.http.post<any>('http://192.168.1.18:80/api/auth/login', user,{headers: { "Content-Type": "application/json"}});
  }
  // Access user profile
  profileUser(): Observable<any> {
    return this.http.get('http://192.168.1.18:80/api/auth/user-profile');
  }
}
