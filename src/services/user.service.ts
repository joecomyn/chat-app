import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private username: string = '';

  setUsername(name: string): void {
    this.username = name;
  }

  getUsername(): string {
    return this.username;
  }

  isLoggedIn(): boolean {
    return this.username !== '';
  }
}