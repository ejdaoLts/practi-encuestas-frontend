import { Injectable } from '@angular/core';
import { Either } from '@eklipse/utilities';
import { AuthenticateUser, LoginPayload, LoginResponse } from '@auth/application';
import { LoginUserApplication } from '@auth/infrastructure';

type Result = Either<boolean, LoginResponse>;

@Injectable({ providedIn: 'root' })
export class AuthenticateUserController {
  constructor(private _loginUser: LoginUserApplication) {}

  public async execute(payload: LoginPayload): Promise<Result> {
    const authenticateUser = new AuthenticateUser(this._loginUser);

    try {
      const result = await authenticateUser.execute(payload);

      return Either.right(result);
    } catch (error) {
      return Either.left(false);
    }
  }
}
