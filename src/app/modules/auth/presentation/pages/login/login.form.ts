import { FormControl, FormGroup } from '@angular/forms';
import { LoginPayload } from '@auth/application';
import { required } from '@common/validators';

export class LoginForm extends FormGroup {
  constructor() {
    super({
      username: new FormControl(null, [required]),
      password: new FormControl(null, [required]),
    });
  }

  get username(): FormControl {
    return this.get('username') as FormControl;
  }
  get password(): FormControl {
    return this.get('password') as FormControl;
  }

  public get model(): LoginPayload {
    return {
      email: this.username.value,
      password: this.password.value,
    };
  }
}
