import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RoomSelectionComponent } from './room-selection/room-selection.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'rooms', component: RoomSelectionComponent },
    { path: 'rooms/:id', component: ChatRoomComponent }
];
