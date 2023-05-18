import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { STORAGE_KEYS } from '@shared/constants';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private _router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem(STORAGE_KEYS.authToken) !== null) {
      this._router.navigate(['home/personas']);
      return false;
    }

    return true;
  }
}
