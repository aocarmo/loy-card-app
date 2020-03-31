import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Network } from '@ionic-native/network';
import { FuncoesProvider } from './../../providers/funcoes/funcoes';
import { ContatoService } from './../../providers/contato/contato.service';
import { Contato } from '../../model/contato-model';
import { Constantes } from '../../constantes/constantes';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Usuario } from '../../model/usuario-model';


@IonicPage({
  name: 'page-contato',
  segment: 'contato'
})

@Component({
  selector: 'page-contato',
  templateUrl: 'contato.html'
})
export class ContatoPage implements OnInit {
  connected: Subscription;
  disconnected: Subscription;
  public isOnline: boolean = true;
  public contato: Contato = {};
  user: Usuario = new Usuario();
  public registrarContatoForm: FormGroup;
  constructor(public navCtrl: NavController,
    public network: Network,
    public funcoes: FuncoesProvider,
    public contatoService: ContatoService,
    private _fb: FormBuilder,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public platform: Platform
  ) {
    this.user = this.navParams.get('usuario');
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      // Do your network stuff now
      this.connected = this.network.onConnect().subscribe((data:any) => {
        this.funcoes.showAlert(JSON.stringify(data));
        this.isOnline = true;      
  
      });
      this.disconnected = this.network.onDisconnect().subscribe((data:any) => {
        this.funcoes.showAlert(JSON.stringify(data));
        this.isOnline = false;
  
      });
      this.ObterInformacoesContato();
      
    });
    
  }


  ngOnInit() {
    this.registrarContatoForm = this._fb.group({
      assunto: ['', Validators.compose([
        Validators.required
      ])],
      mensagem: ['', Validators.compose([
        Validators.required,
      ])]
    });
  }


  ObterInformacoesContato() {

    if (this.isOnline) {

      let loading = this.funcoes.showLoading("Aguarde...");
      this.contatoService.ObterInformacoesContato().then((data: any) => {

        loading.dismiss();

        if (data.ok) {
          this.contato = data.contato;
        } else if (data.hasOwnProperty('name') && data.name == "TimeoutError") {
          loading.dismiss();
          this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
        }
        else {
          this.funcoes.showAlert(data.msg);
        }

      }).catch((err: any) => {
        loading.dismiss();
        this.funcoes.showAlert("Ocorreu um erro ao obter as informações de contato: " + JSON.stringify(err));
      });

    } else {
      this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
    }

  }

  // process send button
  RegistrarContato() {
    if (this.isOnline) {
      let loader = this.funcoes.showLoading("Enviando sua mensagem...");

      loader.present();
      this.contatoService.RegistrarContato(this.user.usuario_id, this.registrarContatoForm.value.assunto, this.registrarContatoForm.value.mensagem).then((retornoRegistrarContato: any) => {

        if (retornoRegistrarContato.ok) {

          let toast = this.toastCtrl.create({
            showCloseButton: true,
            cssClass: 'profile-bg',
            message: retornoRegistrarContato.msg,
            duration: 3000,
            position: 'bottom'
          });

          loader.dismiss();
          toast.present();

        } else {
          loader.dismiss();

          //Testando o time out da requisição para informar sobre conectividade do dispositivo
          if (retornoRegistrarContato.hasOwnProperty('name') && retornoRegistrarContato.name == "TimeoutError") {
            this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
          } else {
            this.funcoes.showAlert(retornoRegistrarContato.msg);
          }

        }

      }).catch((erro: any) => {
        loader.dismiss();
        this.funcoes.showAlert("Ocorreu um erro ao registrar o seu contato: " + erro);
      });
    } else {
      this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
    }

  }

}
