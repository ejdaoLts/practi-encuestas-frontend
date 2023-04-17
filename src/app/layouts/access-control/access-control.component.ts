import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessControlComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
