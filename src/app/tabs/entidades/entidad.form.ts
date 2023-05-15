import { FormControl, FormGroup } from '@angular/forms';
import { maxLength, onlyNumber, required } from '@eklipse/utilities';
import { CreateEntidadPayload } from '@http/payloads';

export class EntidadForm extends FormGroup {
  constructor() {
    super({
      tipo_documento: new FormControl(1, [onlyNumber]),
      numero_documento: new FormControl(null, [required, maxLength(20)]),
      tipo: new FormControl(1, [onlyNumber]),
      nombre_completo: new FormControl(null, [required, maxLength(100)]),
      telefono: new FormControl(null, [required, maxLength(15)]),
    });
  }

  get tipo_documento(): FormControl {
    return this.get('tipo_documento') as FormControl;
  }
  get numero_documento(): FormControl {
    return this.get('numero_documento') as FormControl;
  }
  get tipo(): FormControl {
    return this.get('tipo') as FormControl;
  }
  get nombre_completo(): FormControl {
    return this.get('nombre_completo') as FormControl;
  }
  get telefono(): FormControl {
    return this.get('telefono') as FormControl;
  }

  public get model(): CreateEntidadPayload {
    return {
      tipo_documento: this.tipo_documento.value,
      numero_documento: this.numero_documento.value,
      tipo: this.tipo.value,
      nombre_completo: ((this.nombre_completo.value || '') as string).toUpperCase(),
      telefono: this.telefono.value,
    };
  }
}
