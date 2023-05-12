import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  //PreloadingStrategy,
  RouteReuseStrategy,
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

if (environment.production) {
  enableProdMode();
  console.log = () => {};
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    importProvidersFrom(
      IonicModule.forRoot({ mode: 'ios' }),
      /*RouterModule.forRoot([], { preloadingStrategy: PreloadingStrategy }),*/
      HttpClientModule
    ),
    provideRouter(routes),
    { provide: HTTP_INTERCEPTORS, useClass: UnauthorizedInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpTimeoutInterceptor, multi: true },
  ],
});
