import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PromocaoDetalhePage } from './promocao-detalhe';

@NgModule({
  declarations: [
    PromocaoDetalhePage
  ],
  imports: [
    IonicPageModule.forChild(PromocaoDetalhePage)
  ],
  exports: [
    PromocaoDetalhePage
  ]
})

export class PromocaoDetalhePageModule { }
