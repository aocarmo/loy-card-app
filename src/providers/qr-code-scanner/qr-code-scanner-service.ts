import { ToastController } from 'ionic-angular';
import { Usuario } from './../../model/usuario-model';
import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FuncoesProvider } from '../funcoes/funcoes';
import { Constantes } from './../../constantes/constantes';
import { App } from "ionic-angular";
import { Diagnostic } from '@ionic-native/diagnostic';


/*
  Generated class for the QrCodeScannerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class QrCodeScannerService {

  constructor(private barcodeScanner: BarcodeScanner,
    public funcoes: FuncoesProvider,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public app: App,
    private diagnostic: Diagnostic
    //     public nav: NavController
  ) {

  }

  doScanQrCode(): Promise<string> {

    let retorno = {
      status: "",
      base64Image: ""
    };

    return new Promise(resolve => {

      this.barcodeScanner.scan().then((barcodeData: any) => {

        retorno.status = "true";
        retorno.base64Image = barcodeData;
        resolve(JSON.stringify(retorno));

      }).catch(err => {
        retorno.status = "false";
        retorno.base64Image = err;
        resolve(JSON.stringify(retorno));

      });

    });
  }

  registarCarimbo(access_token: string, hash: string, usuario_id: number) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    let json = {
      "access_token": access_token,
      "hash": hash,
      "usuario_id": usuario_id
    };

    let urlParams = this.funcoes.JSON_to_URLEncoded(json, null);

    return new Promise(resolve => {

      this.http.post(Constantes.API_REGISTRAR_CARIMBO, urlParams, httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);

      }, err => {
        resolve(err);
      });
    });
  }

  enviarQrCode(user: Usuario) {

    let loading = this.funcoes.showLoading("Aguarde...");

    this.diagnostic.isCameraAuthorized().then((data: any) => {

      if (data) {
        this.doScanQrCode().then((data: string) => {

          let retorno = JSON.parse(data);

          if (retorno.status == "true") {

            if (retorno.base64Image.cancelled == 0) {
              this.registarCarimbo(user.access_token, retorno.base64Image.text, user.usuario_id).then((data: any) => {
                if (data.hasOwnProperty('name') && data.name == "TimeoutError") {
                  loading.dismiss();
                  this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
                } else {
                  loading.dismiss();
                  let toast = this.toastCtrl.create({
                    message: data.msg,
                    duration: 5000,
                    position: 'top',
                    cssClass: 'dark-trans',
                    closeButtonText: 'OK',
                    showCloseButton: true
                  });
                  toast.present();

                  if (data.ok) {
                    let nav = this.app.getActiveNav();
                    nav.push('page-cartao-detalhe', {
                      'cartao': data.cartao[0],
                      'usuario': user
                    });
                  }
                }
              });
            } else {
              loading.dismiss();
            }

          } else {
            loading.dismiss();
            this.funcoes.showAlert("Ocorreu um erro ao scanear o QrCode: " + JSON.stringify(retorno.base64Image));
          }

        }).catch((err: any) => {
          loading.dismiss();
          this.funcoes.showAlert("Ocorreu um erro ao scanear o QrCode: " + JSON.stringify(err));
        });
      }else{

        this.diagnostic.requestCameraAuthorization().then((data:string)=>{
          loading.dismiss();
          if(data == "authorized"){          
            this.enviarQrCode(user);
          }else{           
            this.funcoes.showAlert("Sem permissão para acessar a câmera, por favor conceda permissão ao LoyCard para acessar a câmera do seu dispositivo em configurações.");
          }
        }).catch((err:any)=>{
          loading.dismiss();
          this.funcoes.showAlert("Ocorreu um erro ao scanear o QrCode: " + JSON.stringify(err));
        });
        
      }

    }).catch((err: any) => {
      loading.dismiss();
      this.funcoes.showAlert("Ocorreu um erro ao scanear o QrCode: " + JSON.stringify(err));
    });

  }


}
