import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartaoDetalhePage } from './cartao-detalhe';

@NgModule({
  declarations: [
    CartaoDetalhePage
  ],
  imports: [
    IonicPageModule.forChild(CartaoDetalhePage)
  ],
  exports: [
    CartaoDetalhePage
  ]
})

export class CartaoDetalhePageModule { }
