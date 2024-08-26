import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const userService = inject(UserService);
  const router = inject(Router);

  if(userService.isLoggedIn()){
    return true;
  }
  else{
    router.navigate(['/login']);
    return false;
  }

};
