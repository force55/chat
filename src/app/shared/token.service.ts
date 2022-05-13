import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private issuer = {
    login: 'http://192.168.1.18:80/api/auth/login',
    register: 'http://192.168.1.18:80/api/auth/register',
  };

  constructor(private router: Router) {
  }

  handleData(token: any) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Verify the token
  isValidToken() {
    const token = this.getToken();
    if (token) {
      const payload = this.payload(token);
      const expire = this.tokenExpired(payload.exp)
      // console.log( new Date(payload.exp));
      if (!expire) {
        return true
      } else {
        return false
      }
    } else {
      return false;
    }
  }

  private tokenExpired(timeNumber: number) {
    const expiry = timeNumber;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  payload(token: any) {
    const jwtPayload = token.split('.')[1];
    if (jwtPayload) {
      return JSON.parse(atob(jwtPayload));
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

  // User state based on valid token
  isLoggedIn() {
    return this.isValidToken();
  }

  // Remove token
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  }
}
