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
//Profile interface
export class Profile {
  name!: String;
  email!: String;
  country!: String;
  avatarUrl!: String;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  // User registration
  userProfile(): Observable<any> {
    return this.http.get('http://192.168.1.18:80/api/profile/show');
  }
  // Login
  editProfile(profile: Profile): Observable<any> {
    return this.http.post<any>('http://192.168.1.18:80/api/profile/edit', profile);
  }
}
