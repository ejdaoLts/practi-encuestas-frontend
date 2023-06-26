import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IonicModule } from '@ionic/angular';
import { AdminLayoutComponent } from './admin-layout.component';
import { ValidateAccessPipe } from './validate-access.pipe';

@NgModule({
  declarations: [AdminLayoutComponent, ValidateAccessPipe],
  imports: [RouterModule, CommonModule, MatButtonModule, MatMenuModule, MatIconModule, IonicModule],
})
export class AdminLayoutModule {}
