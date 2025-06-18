import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string = '';
  private tokenExpiration: Date | null = null;

  constructor(private http: HttpClient) {
    const storedToken = localStorage.getItem('token');
    const storedTokenExpiration = localStorage.getItem('tokenExpiration');
    if (storedToken && storedTokenExpiration) {
      this.token = storedToken;
      this.tokenExpiration = new Date(storedTokenExpiration);
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('https://dummyjson.com/auth/login', {
      username: username,
      password: password,
      expiresInMins: 30
    });
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>('https://dummyjson.com/auth/refresh', {
      expiresInMins: 30
    }, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(
      switchMap(response => {
        const newToken = response.token;
        this.setToken(newToken);
        return newToken;
      })
    );
  }

  setToken(token: string): void {
    this.token = token;
    this.tokenExpiration = new Date(new Date().getTime() + 30 * 60000);
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiration', this.tokenExpiration.toISOString());
  }

  getToken(): string {
    return this.token;
  }

  isLoggedIn(): boolean {
    return !!this.token && !!this.tokenExpiration && this.tokenExpiration > new Date();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    this.token = '';
    this.tokenExpiration = null;
  }

  getUserData(): Observable<any> {

    if (this.tokenExpiration && this.tokenExpiration.getTime() - new Date().getTime() < 5 * 60000) {
      return this.refreshToken().pipe(
        switchMap(() => {

          return this.http.get<any>('https://dummyjson.com/auth/me', {
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          });
        })
      );
    } else {
      return this.http.get<any>('https://dummyjson.com/auth/me', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
    }
  }
}
