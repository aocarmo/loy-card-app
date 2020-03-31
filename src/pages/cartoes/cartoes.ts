import { Cartao } from './../../model/cartao-model';
import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, AlertController} from "ionic-angular";
import { Storage } from '@ionic/storage';
import { Usuario } from "../../model/usuario-model";
import { FuncoesProvider } from './../../providers/funcoes/funcoes';
import { CartoesService } from "../../providers/cartoes/cartoes.service";
import { QrCodeScannerService } from '../../providers/qr-code-scanner/qr-code-scanner-service';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';

@IonicPage({
  name: 'page-cartoes',
  segment: 'cartoes'
})

@Component({
  selector: 'page-cartoes',
  templateUrl: 'cartoes.html'
})
export class CartoesPage {
  // list of cartoes
  public cartoes: Cartao[] = [];
 // flipped: boolean = false;
  public user: Usuario;
  public objUsuario: any; 
  
  constructor(public nav: NavController,             
              public storage: Storage,
              public funcoes: FuncoesProvider,
              public navParams: NavParams,
              public cartoesService: CartoesService,
              public qrCodeScannerService: QrCodeScannerService,
              private actionSheet: ActionSheet,
              public alertCtrl: AlertController
            ) {
      this.user = this.navParams.get('usuario');
  }
  ionViewWillEnter(){
    this.obterCartoesAbertos(); //Sempre obter os cartões ao entrar na pagina   
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

  doScanQrCodeApp(){
    this.qrCodeScannerService.enviarQrCode(this.user);
  }

  obterCartoesAbertos(){

    let loading = this.funcoes.showLoading("Aguarde...")
    this.cartoesService.obterCartoesAbertos(this.user.access_token,this.user.usuario_id).then((data:any) =>{
      
      loading.dismiss();
      
      if(data.ok){
        this.cartoes = data.cartoes_abertos;
      }else if (data.hasOwnProperty('name') && data.name == "TimeoutError") {
        loading.dismiss();
        this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
      }
      else{
        this.funcoes.showAlert(data.msg);
      }     
 
    }).catch((err:any)=>{
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
                    this.obterCartoesAbertos(); 
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
