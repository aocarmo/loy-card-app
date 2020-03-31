import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartoesPage } from './cartoes';

@NgModule({
  declarations: [
    CartoesPage
  ],
  imports: [
    IonicPageModule.forChild(CartoesPage)
  ],
  exports: [
    CartoesPage
  ]
})

export class CartoesPageModule { }
