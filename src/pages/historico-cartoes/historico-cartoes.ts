import { CartaoInativo } from './../../model/cartao-inativo-model';
import { Cartao } from './../../model/cartao-model';
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, AlertController } from "ionic-angular";
import { Storage } from '@ionic/storage';
import { Usuario } from "../../model/usuario-model";
import { FuncoesProvider } from './../../providers/funcoes/funcoes';
import { CartoesService } from "../../providers/cartoes/cartoes.service";
import { QrCodeScannerService } from '../../providers/qr-code-scanner/qr-code-scanner-service';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
/**
 * Generated class for the HistoricoCartoesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'page-historico-cartoes',
  segment: 'historico-cartoes'
})
@Component({
  selector: 'page-historico-cartoes',
  templateUrl: 'historico-cartoes.html',
})
export class HistoricoCartoesPage {
  // list of cartoes
  public cartoesInativos: CartaoInativo[] = [];
  public cartao: Cartao = null;
  // flipped: boolean = false;
  public user: Usuario;
  constructor(public nav: NavController,
    public storage: Storage,
    public funcoes: FuncoesProvider,
    public navParams: NavParams,
    public cartoesService: CartoesService,
    public qrCodeScannerService: QrCodeScannerService,
    private actionSheet: ActionSheet,
    public alertCtrl: AlertController) {

    this.user = this.navParams.get('usuario');
  }

  ionViewWillEnter() {
    this.obterHistoricoCartoes(); //Sempre obter os cartões ao entrar na pagina   
  }

  // view trip detail
  viewDetail(cartao: Cartao) {
    this.nav.push('page-cartao-detalhe', {
      'cartao': cartao,
      'usuario': this.user
    });
  }

  /*
    flip(){
      this.flipped = !this.flipped;
    }*/

  doScanQrCodeApp() {
    this.qrCodeScannerService.enviarQrCode(this.user);
  }

  obterHistoricoCartoes() {

    let loading = this.funcoes.showLoading("Aguarde...")
    this.cartoesService.obterHistoricoCartoes(this.user.access_token, this.user.usuario_id).then((data: any) => {

      loading.dismiss();

      if (data.ok) {

        this.cartoesInativos = data.retorno;

        for (let i = 0; i < this.cartoesInativos.length; i++) {
          this.cartoesInativos[i].cartao = new Cartao(this.cartoesInativos[i].idCartao,
            this.cartoesInativos[i].idEstabelecimento,
            this.cartoesInativos[i].idUsuarioApp,
            this.cartoesInativos[i].nomeEstabelecimento,
            this.cartoesInativos[i].nomeUsuarioApp,
            this.cartoesInativos[i].qtdCarimbos,
            this.cartoesInativos[i].qtdCarimbosFechaCartao,
            this.cartoesInativos[i].codigoCartao,
            this.cartoesInativos[i].dataValidade,
            this.cartoesInativos[i].fotoEstabelecimentoGrande,
            this.cartoesInativos[i].cartaoFechado,
            this.cartoesInativos[i].brindeEstabelecimento,
            this.cartoesInativos[i].dsValorMinimoEstabelecimento);
        }


      } else if (data.hasOwnProperty('name') && data.name == "TimeoutError") {
        loading.dismiss();
        this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
      }
      else {
        this.funcoes.showAlert(data.msg);
      }

    }).catch((err: any) => {
      loading.dismiss();
      this.funcoes.showAlert("Ocorreu um erro ao obter os Cartões: " + JSON.stringify(err));
    });

  }

  removerCartao(e, idCartao: number) {


    let options: ActionSheetOptions = {
      title: 'Deseja excluir o seu cartão?',
      subtitle: 'ATENÇÃO! Isto implicará na perda do definitiva do cartão e todos os carimbos.',
      buttonLabels: [],
      addCancelButtonWithLabel: 'Cancelar',
      addDestructiveButtonWithLabel: 'Excluir Cartão',
      destructiveButtonLast: true
    };

    this.actionSheet.show(options).then((buttonIndex: number) => {

      if (buttonIndex == 1) {
        let loading = this.funcoes.showLoading("Excluindo cartão...");
        this.cartoesService.removerCartao(this.user.access_token, idCartao, this.user.usuario_id).then((data: any) => {
          loading.dismiss();
          if (data.ok) {

            let alert = this.alertCtrl.create({
              title: data.msg,

              buttons: [
                {
                  text: 'Ok',
                  handler: data => {
                    this.obterHistoricoCartoes(); 
                  }
                }
              ]
            });
            alert.present();
          }else{
            loading.dismiss();
            this.funcoes.showAlert(data.msg);
          }
        }).catch((err: any) => {
          loading.dismiss();
          this.funcoes.showAlert(JSON.stringify(err));
        });
      }

    });

  }


}
