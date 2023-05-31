import { FormControl, FormGroup } from '@angular/forms';
import { onlyNumber, required } from '@eklipse/utilities';

export class EvaluacionForm extends FormGroup {
  constructor() {
    super({
      tipo: new FormControl(null, [required, onlyNumber]),
      periodo_academico: new FormControl(null, [onlyNumber]),
      programa_academico: new FormControl(null),
      rotacion: new FormControl(null, [onlyNumber]),
      estudiantes_acargo: new FormControl(null, [onlyNumber]),
      maestro_id: new FormControl(null),
    });
  }

  get tipo(): FormControl {
    return this.get('tipo') as FormControl;
  }
  get periodo_academico(): FormControl {
    return this.get('periodo_academico') as FormControl;
  }

  get programa_academico(): FormControl {
    return this.get('programa_academico') as FormControl;
  }
  get estudiantes_acargo(): FormControl {
    return this.get('estudiantes_acargo') as FormControl;
  }
  get rotacion(): FormControl {
    return this.get('rotacion') as FormControl;
  }
  get maestro_id(): FormControl {
    return this.get('maestro_id') as FormControl;
  }

  public get model() {
    const maestro_id = this.maestro_id.value ? this.maestro_id.value.id : null;
    return {
      tipo_id: this.tipo.value,
      periodo_academico: this.periodo_academico.value,
      programa_academico: this.programa_academico.value,
      rotacion: this.rotacion.value,
      estudiantes_acargo: this.estudiantes_acargo.value,
      maestro_id,
    };
  }

  public get evaluacionValida() {
    if (this.tipo.value) {
      if ([1, 8].indexOf(this.tipo.value) >= 0) return true;
      else if ([2].indexOf(this.tipo.value) >= 0) return this.validate2();
      else if ([3].indexOf(this.tipo.value) >= 0) return this.validate3();
      else if ([4].indexOf(this.tipo.value) >= 0) return this.validate4();
      else if ([5].indexOf(this.tipo.value) >= 0) return this.validate5();
      else if ([6].indexOf(this.tipo.value) >= 0) return this.validate5();
      else if ([7].indexOf(this.tipo.value) >= 0) return this.validate7();
      else return false;
    } else return false;
    //if (this.tipo.value === 7) return true;
  }

  private validate2() {
    if (
      this.periodo_academico.value &&
      this.programa_academico.value &&
      this.rotacion.value &&
      this.maestro_id.value
    ) {
      return true;
    } else return false;
  }

  private validate3() {
    if (this.periodo_academico.value && this.programa_academico.value && this.rotacion.value) {
      return true;
    } else return false;
  }

  private validate4() {
    if (
      this.periodo_academico.value &&
      this.programa_academico.value &&
      this.estudiantes_acargo.value &&
      this.rotacion.value
    ) {
      return true;
    } else return false;
  }

  private validate5() {
    if (this.periodo_academico.value && this.programa_academico.value && this.maestro_id.value) {
      return true;
    } else return false;
  }

  private validate7() {
    if (this.periodo_academico.value && this.programa_academico.value) return true;
    else return false;
  }

  public resett() {
    this.reset();
  }
}
