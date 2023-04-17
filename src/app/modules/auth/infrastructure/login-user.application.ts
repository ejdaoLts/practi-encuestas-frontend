import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginPayload, LoginResponse, LoginUserService } from '../application';
import { firstValueFrom, retry, throwError, timeout } from 'rxjs';
import { END_POINTS } from '@shared/constants';

@Injectable({ providedIn: 'root' })
export class LoginUserApplication implements LoginUserService {
  constructor(private _http: HttpClient) {}

  public async execute(payload: LoginPayload): Promise<LoginResponse> {
    return firstValueFrom(
      this._http.post<LoginResponse>(END_POINTS.V1.AUTH.LOGIN, payload).pipe(
        timeout({
          each: 4000,
          with: () =>
            throwError(() => {
              //new Error('No se autenticó correctamente');
            }),
        }),
        retry(3)
      )
    );
  }
}
