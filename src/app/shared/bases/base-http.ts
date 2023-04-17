import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BaseHttp {
  constructor(protected _http: HttpClient) {}
}
