import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageRouting } from './home.page.routing';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

@NgModule({
  declarations: [HomePage],
  imports: [CommonModule, IonicModule, HomePageRouting],
})
export class HomeModule {}
