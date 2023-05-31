import { ChangeDetectionStrategy, Component, EnvironmentInjector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { STORAGE_KEYS } from '@shared/constants';

@Component({
  standalone: true,
  imports: [IonicModule],
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsPage {
  constructor(private _router: Router) {}

  public tabName = localStorage.getItem(STORAGE_KEYS.tabsTitle) || 'Home';

  public environmentInjector = inject(EnvironmentInjector);

  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        //this.handlerMessage = 'Alert canceled';
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        localStorage.clear();
        location.reload();
        this.tabName = 'Home';
      },
    },
  ];

  public setTabsName(name: string): void {
    localStorage.setItem(STORAGE_KEYS.tabsTitle, name);
    this.tabName = name;
  }
}
