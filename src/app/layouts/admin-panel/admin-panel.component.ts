import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SIDE_NAV_PUBLIC } from 'src/app/app.navigation';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPanelComponent implements OnInit {
  public navigation = SIDE_NAV_PUBLIC;
  public tabName = 'Home';

  constructor(private _router: Router) {}

  ngOnInit() {}

  public redirectTo(route: string) {
    this._router.navigate([route]);
  }
}
