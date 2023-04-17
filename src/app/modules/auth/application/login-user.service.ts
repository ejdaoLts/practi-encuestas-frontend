import { LoginPayload, LoginResponse } from '../application';

export interface LoginUserService {
  execute(payload: LoginPayload): Promise<LoginResponse>;
}
