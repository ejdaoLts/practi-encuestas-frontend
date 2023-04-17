import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoginPage } from './login.page';
import { LoginRouting } from './login.routing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginPage],
  imports: [CommonModule, ReactiveFormsModule, LoginRouting, IonicModule],
  exports: [LoginPage],
})
export class LoginPageModule {}
