import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoricoCartoesPage } from './historico-cartoes';

@NgModule({
  declarations: [
    HistoricoCartoesPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoricoCartoesPage),
  ],
  exports: [
    HistoricoCartoesPage
  ]
})
export class HistoricoCartoesPageModule {}
