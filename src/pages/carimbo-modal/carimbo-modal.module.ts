import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarimboModalPage } from './carimbo-modal';

@NgModule({
  declarations: [
    CarimboModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CarimboModalPage),
  ],
  exports: [
    CarimboModalPage
  ],
  entryComponents: [
    CarimboModalPage,
  ]
})
export class CarimboModalPageModule {}
