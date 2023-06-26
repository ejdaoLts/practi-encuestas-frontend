import { Title } from '@angular/platform-browser';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
//import { Contexts, EKLIPSE_STORAGE_KEYS } from '@common/application/constants';
//import { SessionStore } from '@stores/session';
//import { DecodeTokenService } from '@common/application/services';
import { FormControl } from '@angular/forms';
import { SIDE_NAV } from '../app.navigation';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'gcm-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  private _navigation = SIDE_NAV;
  private _authorities: string[] | undefined;
  private _resourcesLoaded = new FormControl();
  //private _context: Contexts | undefined;

  public tabName = 'Home';
  public location = 'Metrik DS';
  public sessionWasLoaded = false;

  constructor(
    //private _decodeToken: DecodeTokenService,
    //private _sessionStore: SessionStore,
    private _alertCtl: AlertController,
    private _cd: ChangeDetectorRef,
    private _router: Router,
    private _title: Title
  ) {}

  public async ngOnInit(): Promise<void> {
    await this.setSession();

    //this._clearStorageLessProtectedItems();

    if (localStorage.getItem('dark-theme')) {
      document.getElementsByTagName('body')[0].classList.toggle('dark-theme');
    }

    this._title.setTitle('Eklipse | Dashboard');

    //this._context = this._decodeToken.execute().context;

    /*  const subs = this._sessionStore.observable().subscribe(_ => {
      this._authorities = _.authorities;
    });
    subs.unsubscribe(); */

    this.sessionWasLoaded = true;
    this._resourcesLoaded.setValue(true);
    this._cd.markForCheck();
  }

  public redirectTo(route: string) {
    this._router.navigate([route]);
  }

  public async setSession(): Promise<void> {
    /*if (this._validateIfTokenIsNotExpired()) {
      let wasLoaded = false;

      await this._sessionStore.autoInstance();

      const subs = this._sessionStore.observable().subscribe(_ => {
        if (_.wasLoaded) wasLoaded = true;
      });
      subs.unsubscribe();

      this._router.navigate(['home']);

      setTimeout(() => {
        if (wasLoaded) this.sessionWasLoaded = true;
        this._cd.markForCheck();
      }, 100);
    } else {
      localStorage.clear();
      this._router.navigate(['access-control/login']);
    }*/
  }

  public async clickOnLogout(): Promise<void> {
    const alert = await this._alertCtl.create({
      header: 'Cerrar sesión',
      message: '¿Está segur@ que desea cerrar la sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {},
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            //this._sessionStore.clear();
            localStorage.clear();
            location.reload();
          },
        },
      ],
    });

    await alert.present();
  }

  private _validateIfTokenIsNotExpired() {
    /*let tokenPrincBackIsValid = false;
    let tokenSecBackIsValid = false;

    const tokenPrincBack = localStorage.getItem(EKLIPSE_STORAGE_KEYS.authTokenPrincBack);
    const tokenSecBack = localStorage.getItem(EKLIPSE_STORAGE_KEYS.authTokenSecBack);

    if (tokenPrincBack) {
      try {
        const tokenDecoded = this._decodeToken.execute(tokenPrincBack);

        if (tokenDecoded.expiredAt > new Date()) {
          tokenSecBackIsValid = true;
        }
      } catch (error) {
        //console.log('token principal invalido');
      }
    }

    if (tokenSecBack) {
      try {
        const tokenDecoded = this._decodeToken.execute(tokenSecBack);

        if (tokenDecoded.expiredAt > new Date()) {
          tokenPrincBackIsValid = true;
        }
      } catch (error) {
        //console.log('token secundario invalido');
      }
    }

    return tokenPrincBackIsValid && tokenSecBackIsValid;*/
    return true;
  }

  private _clearStorageLessProtectedItems(): void {
    for (let i = 0, length = localStorage.length; i < length; i++) {
      const storageKey: string = localStorage.key(i) || '';

      if (!(this._protectedKeys().indexOf(storageKey) >= 0)) localStorage.removeItem(storageKey);
    }
  }

  private _protectedKeys(): string[] {
    return [];
    /*return [
      EKLIPSE_STORAGE_KEYS.authTokenPrincBack,
      EKLIPSE_STORAGE_KEYS.authTokenSecBack,
      EKLIPSE_STORAGE_KEYS.fullName,
      EKLIPSE_STORAGE_KEYS.location,
      'gcm-sidebar-is-compact',
      'dark-theme',
    ];*/
  }

  get navigation() {
    return this._navigation;
  }

  get authorities(): string[] | undefined {
    return this._authorities;
  }

  /* get context(): Contexts | undefined {
    return this._context;
  } */
}
