import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadingStrategy,
  //PreloadingStrategy,
  RouteReuseStrategy,
  RouterModule,
  //RouterModule,
  provideRouter,
} from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  AddTokenInterceptor,
  HttpTimeoutInterceptor,
  UnauthorizedInterceptor,
} from '@shared/interceptors';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GcmToastService } from '@eklipse/components/toast';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

if (environment.production) {
  enableProdMode();
  //console.log = () => {};
}

bootstrapApplication(AppComponent, {
  providers: [
    GcmToastService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    importProvidersFrom(
      BrowserAnimationsModule,
      MatSnackBarModule,
      IonicModule.forRoot({ mode: 'ios' }),
      HttpClientModule
    ),
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpTimeoutInterceptor, multi: true },
  ],
});
