import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-selection',
  standalone: true,
  imports: [],
  templateUrl: './room-selection.component.html',
  styleUrl: './room-selection.component.css'
})
export class RoomSelectionComponent {

  user: string = "";

  constructor(private userService: UserService, private router: Router) {};

  ngOnInit(): void {
    this.user = this.userService.getUsername();

  };

}
