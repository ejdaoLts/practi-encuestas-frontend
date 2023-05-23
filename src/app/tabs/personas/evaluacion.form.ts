import { FormControl, FormGroup } from '@angular/forms';
import { onlyNumber, required } from '@eklipse/utilities';

export class EvaluacionForm extends FormGroup {
  constructor() {
    super({
      tipo: new FormControl(null, [required, onlyNumber]),
      periodo_academico: new FormControl(null, [onlyNumber]),
      //programa_academico_nom: new FormControl(null),
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
/*   get programa_academico_nom(): FormControl {
    return this.get('programa_academico_nom') as FormControl;
  } */
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
      //programa_academico_nom: ((this.programa_academico_nom.value || '') as string).toUpperCase(),
      programa_academico: this.programa_academico.value,
      rotacion: this.rotacion.value,
      estudiantes_acargo: this.estudiantes_acargo.value,
      maestro_id,
    };
  }

  public resett() {
    this.tipo.setValue(null);
    this.periodo_academico.setValue(null);
    this.programa_academico.setValue(null);
    //this.programa_academico_nom.setValue(null);
    this.rotacion.setValue(null);
    this.estudiantes_acargo.setValue(null);
    this.maestro_id.setValue(null);
  }
}
