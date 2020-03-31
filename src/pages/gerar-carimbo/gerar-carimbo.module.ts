import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GerarCarimboPage } from './gerar-carimbo';
import { BrMasker4Module } from 'brmasker4';


@NgModule({
  declarations: [
    GerarCarimboPage,
  ],
  imports: [
    IonicPageModule.forChild(GerarCarimboPage),
    BrMasker4Module
  ],
})
export class GerarCarimboPageModule {}
