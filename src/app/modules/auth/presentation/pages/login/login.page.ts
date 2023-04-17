import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AuthenticateUserController } from '../../controllers';
import { STORAGE_KEYS } from '@shared/constants';
import { LoginForm } from './login.form';
import { Router } from '@angular/router';

@Component({
  selector: 'gcm-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  public loginForm = new LoginForm();

  private _isAuthenticating = false;

  constructor(
    private _auth: AuthenticateUserController,
    private _router: Router,
    private _cd: ChangeDetectorRef
  ) {}

  public async clickOnAuthenticate() {
    if (this.loginForm.valid) {
      this._isAuthenticating = true;
      this._cd.markForCheck();

      const result = await this._auth.execute(this.loginForm.model);

      result.fold({
        right: response => {
          localStorage.setItem(STORAGE_KEYS.authToken, response.token!);

          this._router.navigate(['home/home']);
        },
        left: () => {
          //this._toast.simpleNotification('Usuario y/o contraseña incorrectas');
        },
      });

      this._isAuthenticating = false;
      this._cd.markForCheck();
    }
  }

  get isAuthenticating(): boolean {
    return this._isAuthenticating;
  }
}
