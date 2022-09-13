import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService {
  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this._authService.getToken()) {
      return true;
    }
    // navigate to login page
    this._router.navigate(['/admin']);
    // you can save redirect url so after authing we can move them back to the page they requested
    return  false;
  }
}
