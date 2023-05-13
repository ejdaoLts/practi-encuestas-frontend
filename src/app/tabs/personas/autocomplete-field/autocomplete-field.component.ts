import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  Optional,
  Input,
  Self,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, FormControl, NgControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PersonasCrudService } from '@http/services/entidades';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';

export class Entidad {
  constructor(private _id: number, private _nombre_completo: string) {}

  get id(): number {
    return this._id;
  }

  get nombre_completo(): string {
    return this._nombre_completo;
  }
}

@Component({
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    CommonModule,
  ],
  selector: 'gcm-autocomplete-field',
  templateUrl: './autocomplete-field.component.html',
})
export class GcmAutocompleteField implements OnInit, OnDestroy, ControlValueAccessor {
  private _unsubscribe$ = new Subject<void>();

  @Input() class = '';

  @Input() style = '';

  @Input() option: string = 'option';

  @Input() autocomplete: 'off' | 'on' = 'off';

  @Input() appearance: 'outline' | 'fill' | 'standard' | 'legacy' = 'standard';

  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';

  @Input() hasClearButton: boolean = true;

  suggestions: any[] = [];

  public onChangeFn = (_: any) => {};

  public onTouchFn = (_: any) => {};

  public isInvalid: boolean = false;

  public isSubmitted: boolean = false;

  public required: boolean = false;

  @Input() disabled: boolean = false;

  public value: string = '';

  public filteredOptions!: Observable<any[]>;

  public notSuggestions = false;

  private _subs2!: Subscription;

  customForm = new FormControl();

  constructor(
    @Self() @Optional() private _control: NgControl,
    @Optional() private _formGroupDirective: FormGroupDirective,
    private _personasCrud: PersonasCrudService,
    private _cd: ChangeDetectorRef
  ) {
    if (_control) {
      this._control.valueAccessor = this;
    }
    if (_formGroupDirective) {
      _formGroupDirective.ngSubmit.pipe(takeUntil(this._unsubscribe$)).subscribe(() => {
        this.isSubmitted = true;
        _cd.markForCheck();
      });
    }
  }

  public async ngOnInit(): Promise<void> {
    this._subs2 = this.customForm.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(1000))
      .subscribe(async value => {
        if (
          value &&
          !this.suggestions.filter(suggestion => suggestion.nombre_completo === value).length
        ) {
          this.suggestions = [];
          const res = await this._personasCrud.suggestions(value);

          res.fold({
            right: entidades => {
              entidades.forEach(entidad => {
                const d = new Entidad(entidad.id, entidad.nombre_completo);
                this.suggestions.push(d);
                this.control.setValue(value);
              });
            },
          });
        }
      });

    this.filteredOptions = this.control.valueChanges.pipe(
      takeUntil(this._unsubscribe$),
      map(() => this._filter())
    );
  }

  private _filter(): any[] {
    const value =
      typeof this.value === 'string'
        ? this.value.toLowerCase()
        : this.control.value[this.option].toLowerCase();
    const option = this.suggestions.filter(res => res[this.option].toLowerCase().includes(value));
    if (!option.length) this.notSuggestions = true;
    else this.notSuggestions = false;
    return option;
  }

  public writeValue(value: string): void {
    if (value === null) {
      this.isInvalid = false;
    }
    this.value = value;
    this.isSubmitted = false;
    this._cd.markForCheck();
  }

  public registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

  public onChange(event: any): void {
    this.value = event.target.value;
    this.customForm.setValue(event.target.value);

    this.onChangeFn(
      this.suggestions.filter(_ => _[this.option].toLowerCase() === this.value.toLowerCase())[0] ||
        null
    );
    if (this.control.touched) {
      this._onValidate();
    }
  }

  public onFocusout(): void {
    this.onTouchFn(true);
    this._onValidate();
  }

  private _onValidate(): void {
    /*  if (this.control.invalid) {
      this.isInvalid = true;
    } else {
      this.isInvalid = false;
    } */
  }

  onUpdate(suggestion: any) {
    this.control.setValue(suggestion);
    this.value = suggestion[this.option];
    this._onValidate();
  }

  onFocus() {
    if (!this.value) {
      this.control.setValue('');
      this.value = '';
    }
  }

  public onClearControl(): void {
    this.control.setValue('');
    this.value = '';
  }

  public ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._subs2.unsubscribe();
  }

  get control(): FormControl {
    return this._control?.control as FormControl;
  }

  get directive(): FormGroupDirective {
    return this._formGroupDirective as FormGroupDirective;
  }
}
