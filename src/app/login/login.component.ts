import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule]
})
export class LoginComponent {

  username: string = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {

    if (this.username.trim()) {
      this.userService.setUsername(this.username);
      this.router.navigate(['/rooms']);
    }

  }

}
