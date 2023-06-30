import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AdminPanelComponent } from './admin-panel.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AdminPanelComponent],
  imports: [CommonModule, IonicModule, RouterModule],
})
export class AdminPanelModule {}
