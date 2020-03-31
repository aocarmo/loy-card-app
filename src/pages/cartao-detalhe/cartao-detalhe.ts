import { Cartao } from './../../model/cartao-model';
import {Component, NgZone} from "@angular/core";
import {IonicPage, NavParams, NavController, ToastController} from "ionic-angular";
import { FuncoesProvider } from './../../providers/funcoes/funcoes';
import {QrCodeScannerService} from "../../providers/qr-code-scanner/qr-code-scanner-service";
import { Usuario } from '../../model/usuario-model';
import { CartoesService } from "../../providers/cartoes/cartoes.service";
import { AlertController } from 'ionic-angular';

@IonicPage({
  name: 'page-cartao-detalhe',
  segment: 'cartao-detalhe/:id'
})

@Component({
  selector: 'page-cartao-detalhe',
  templateUrl: 'cartao-detalhe.html'
})
export class CartaoDetalhePage {
  param: number;
  public carimbos = [];
  public resgatar: boolean = false;
   // flipped: boolean = false;
   user: Usuario;

  public cartao: Cartao;

  constructor(public nav: NavController, 
              public navParams: NavParams,              
              public funcoes: FuncoesProvider,
              public qrCodeScannerService: QrCodeScannerService,
              public toastCtrl: ToastController,
              public cartoesService: CartoesService,
              public alertCtrl: AlertController,
              public zone: NgZone) {
   
    this.cartao = this.navParams.get('cartao');
    this.user = this.navParams.get('usuario');
  }

  ionViewDidLoad(){

    this.exibirCarimbos(); //Chamando a função que contabilliza os carimbos
  
  }

  exibirCarimbos(){

    this.carimbos = []; //Zerando os carimbos para quando fizer a leitura na própria pagina atualizar

    if(this.cartao.qtdCarimbosFechaCartao == this.cartao.qtdCarimbos){
      this.resgatar = true;
    }
    var i;
    let urlImgCarimbo = "";
    for (i = 1; i <= this.cartao.qtdCarimbosFechaCartao; i++) { 
      if(i <= this.cartao.qtdCarimbos){
        urlImgCarimbo = "assets/img/carimbo.png";
      }else{
         urlImgCarimbo = "";
      }
      let carimbo = {
        'imagem': urlImgCarimbo
      }
      this.carimbos.push(carimbo);    
    }    

  }

  doScanQrCode(){
    let loading = this.funcoes.showLoading("Aguarde...")
    this.qrCodeScannerService.doScanQrCode().then((data:string) =>{

      let retorno = JSON.parse(data);
  
      if(retorno.status == "true"){
      
        if(retorno.base64Image.cancelled == 0){
          this.qrCodeScannerService.registarCarimbo(this.user.access_token,retorno.base64Image.text,this.user.usuario_id).then((data:any)=>{
          
            if(data.ok){  
              loading.dismiss();         
          
            let alert = this.alertCtrl.create({              
              message: data.msg,
              buttons: [           
                {
                  text: 'Ok',
                  handler: () => {
                    //Faz o reload das variáveis na tela, para carregar carimbos
                    this.zone.run(() => {
                      this.cartao = data.cartao[0];
                      this.exibirCarimbos();
                   
                  });
                   
                   
                  }
                }
              ]
            });

            alert.present();
            }else if (data.hasOwnProperty('name') && data.name == "TimeoutError") {
              loading.dismiss();
              this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
            }else{
             
              loading.dismiss();            
              let toast = this.toastCtrl.create({
                message: data.msg,
                duration: 3000,
                position: 'top',
                cssClass: 'dark-trans',
                closeButtonText: 'OK',
                showCloseButton: true
              });
              toast.present();
            }
            
          });
        }else{          
          loading.dismiss();
        }

      }else{        
        loading.dismiss();
        this.funcoes.showAlert("Ocorreu um erro ao scanear o QrCode: " + JSON.stringify(retorno.base64Image));
      }
 
    }).catch((err:any)=>{
      loading.dismiss();
      this.funcoes.showAlert("Ocorreu um erro ao scanear o QrCode: " + JSON.stringify(err));
    });
    
  }


  resgatarCartao(){
    let forgot = this.alertCtrl.create({
      title: 'Deseja resgatar o cartão?',     
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {

          }
        },
        {
          text: 'Sim',
          handler: data => {

            let loading = this.funcoes.showLoading("Aguarde...")
            this.cartoesService.resgatarCartao(this.cartao.idCartao,this.user.access_token).then((data:any) =>{
      
              if(data.ok){
         
                 loading.dismiss();    
                 let alert = this.alertCtrl.create({
                   title: 'Legal!',
                   message: data.msg,
                   buttons: [           
                     {
                       text: 'Ok',
                       handler: () => {
                         this.nav.pop();
                       }
                     }
                   ]
                 });
                 alert.present();
         
               }else if (data.hasOwnProperty('name') && data.name == "TimeoutError") {
                 loading.dismiss();
                 this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
               }else{
                 this.funcoes.showAlert(data.msg);
               }    
          
             }).catch((err:any)=>{
               loading.dismiss();
               this.funcoes.showAlert("Ocorreu um erro ao obter os Cartões: " + JSON.stringify(err));
             });           
          }
        }
      ]
    });
    forgot.present(); 

  }

  // go to checkout page
/*  checkout(trip) {
    this.nav.push('page-checkout-trip', {
      'id': trip.id
    });
  }*/
}
