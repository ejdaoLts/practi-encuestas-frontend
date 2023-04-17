import { LoginUserService } from './login-user.service';
import { LoginPayload, LoginResponse } from './login.data-transfers';

export class AuthenticateUser {
  constructor(private _auth: LoginUserService) {}

  public execute(payload: LoginPayload): Promise<LoginResponse> {
    return this._auth.execute(payload);
  }
}
