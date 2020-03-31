import { Usuario } from './../../model/usuario-model';
import { CarimboProvider } from './../../providers/carimbo/carimbo';
import { Carimbo } from './../../model/carimbo-model';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FormGroup, Validators,FormBuilder } from '../../../node_modules/@angular/forms';
import { CarimboModalPage } from '../carimbo-modal/carimbo-modal';
import { FuncoesProvider } from "../../providers/funcoes/funcoes";

/**
 * Generated class for the GerarCarimboPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'page-gerar-carimbo',
  segment: 'gerar-carimbo'
})
@Component({
  selector: 'page-gerar-carimbo',
  templateUrl: 'gerar-carimbo.html',
})
export class GerarCarimboPage {
  public gerarCarimboForm: FormGroup;
  public carimbo: Carimbo = null;
  public dataTual:any;
  public user: Usuario;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private _fb: FormBuilder,
              public modalCtrl: ModalController,
              public carimboService:CarimboProvider,
              public funcoes: FuncoesProvider,
            ) {
          this.dataTual =  new Date().toISOString();
          this.user = this.navParams.get('usuario');
  }
  ionViewWillEnter(){
   
  }
  ngOnInit() {
    this.gerarCarimboForm = this._fb.group({
      nuNota: ['', Validators.compose([
      
      ])],
      vlCompra: ['', Validators.compose([
        Validators.required,
      ])],
      dtCompra: ['', Validators.compose([
        Validators.required,
      ])]
    });

  }


  gerarCarimbo() {

    if(this.gerarCarimboForm.valid){
      let loading = this.funcoes.showLoading("Gerando carimbo...");
      this.carimboService.gerarCarimbo(this.user.access_token,this.user.usuario_id,this.gerarCarimboForm.value.nuNota,this.gerarCarimboForm.value.vlCompra, this.converteData(this.gerarCarimboForm.value.dtCompra))
        .then((data:any)=>{
          if (data.ok) {
            loading.dismiss();
            let myModal = this.modalCtrl.create(CarimboModalPage, { 'qrcode': data.qrcode, 'idCarimboTemporario': data.idCarimboTemporario, 'idEstabelecimento': data.idEstabelecimento});
            myModal.present();

          } else {

            loading.dismiss();
            //Verifica se o erro foi por timeout para exibir alerta
            if (data.hasOwnProperty('name') && data.name == "TimeoutError") {
              this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
            } else {
              this.funcoes.showAlert(data.msg);
            }
          }
        }).catch((err:any)=>{
          loading.dismiss();
          this.funcoes.showAlert(JSON.stringify(err));
        });
  
    }

  }

  converteData(dataHora:string):string{
    let data  = dataHora.split("T");
    let dataPartes = data[0].split("-");
    let retorno = dataPartes[2] +"/"+ dataPartes[1] +"/"+ dataPartes[0];
    return retorno;
  }

  

}
