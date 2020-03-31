import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterPage } from './register';
import { BrMasker4Module  } from 'brmasker4';

@NgModule({
  declarations: [
    RegisterPage
  ],
  imports: [
    IonicPageModule.forChild(RegisterPage),
    BrMasker4Module
  ],
  exports: [
    RegisterPage
  ]
})

export class RegisterPageModule { }
