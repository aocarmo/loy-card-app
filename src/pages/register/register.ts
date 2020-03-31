import { Network } from '@ionic-native/network';
import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IonicPage, NavController, MenuController, ToastController, Platform } from "ionic-angular";
import { LoginService } from "../../providers/login/login.service";
import { FuncoesProvider } from "../../providers/funcoes/funcoes";
import { Constantes } from '../../constantes/constantes';
import { Subscription } from 'rxjs';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal';
import { LoginRedeSocialProvider } from '../../providers/login-rede-social/login-rede-social';
import { Usuario } from '../../model/usuario-model';

@IonicPage({
  name: 'page-register',
  segment: 'register',
  priority: 'high'
})

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup;
  public isOnline: boolean = true;
  public idUserOneSignal: string = "";
  connected: Subscription;
  disconnected: Subscription;
  public user: Usuario = null;

  constructor(private _fb: FormBuilder,
    public nav: NavController,
    public menu: MenuController,
    public loginService: LoginService,
    public toastCtrl: ToastController,
    public funcoes: FuncoesProvider,
    public network: Network,
    public facebook: Facebook,
    public googlePlus: GooglePlus,
    private oneSignal: OneSignal,
    private platform: Platform,
    public loginRedeSocialProvider: LoginRedeSocialProvider
    
  ) {
    this.menu.swipeEnable(false);
    this.menu.enable(false);

    this.platform.ready().then(() => {

      this.oneSignal.getIds().then((data:any) =>{
        this.idUserOneSignal = data.userId;             
      }).catch(err =>{
        alert(JSON.stringify(err));
      });
    });
  }

  ionViewDidEnter() {
    this.connected = this.network.onConnect().subscribe(() => {
      this.isOnline = true;
    });
    this.disconnected = this.network.onDisconnect().subscribe(() => {
      this.isOnline = false;
    });
  }

  ionViewWillLeave() {
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }

  ngOnInit() {
    this.onRegisterForm = this._fb.group({
      nome: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required
      ])],
      telefone: ['', Validators.compose([
       
      ])],
      senha: ['', Validators.compose([
        Validators.required
      ])],
      reSenha: ['', Validators.compose([
        Validators.required
      ])],
    });
  }

  // register and go to home page
  register() {
    if (this.isOnline) {
      let loading = this.funcoes.showLoading("Cadastrando...");

      this.loginService.cadastraUsuario(this.onRegisterForm.value.nome, this.onRegisterForm.value.email, this.onRegisterForm.value.telefone, this.onRegisterForm.value.senha, this.onRegisterForm.value.reSenha)
        .then((dataCadastro: any) => {

          if (dataCadastro.ok) {

            this.loginService.doLogin(this.onRegisterForm.value.email, this.onRegisterForm.value.senha,   this.idUserOneSignal)
              .then((dataLogin: any) => {

                if (dataLogin.hasOwnProperty('access_token')) {
                  loading.dismiss();
                  this.nav.setRoot('page-home', { 'usuario': dataLogin });
                } else {
                  loading.dismiss();
                  if (dataLogin.hasOwnProperty('name') && dataLogin.name == "TimeoutError") {
                    this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
                  }
                }

              }).catch(((erro: any) => {

                loading.dismiss();
                this.funcoes.showAlert(erro);

              }));

          } else {

            loading.dismiss();
            //Verifica se o erro foi por timeout para exibir alerta
            if (dataCadastro.hasOwnProperty('name') && dataCadastro.name == "TimeoutError") {
              this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
            } else {
              this.funcoes.showAlert(dataCadastro.msg);
            }
          }

        });
    } else {
      this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
    }
  }
  // go to login page
  login() {
    this.nav.setRoot('page-login');
  }

  loginRedeSocial(tipoLogin: string) {
    if (this.isOnline) {
      let loading = this.funcoes.showLoading("Aguarde...");

      if (tipoLogin == 'facebook') {

        this.loginRedeSocialProvider.loginFacebook(this.idUserOneSignal).then((data: string) => {

          let retorno = JSON.parse(data);

          if (retorno.status) {
            this.user = retorno.dados;
            loading.dismiss();
            this.nav.setRoot('page-home', { 'usuario': this.user });
          } else {
            loading.dismiss();
            this.funcoes.showAlert(retorno.mensagem);
          }

        }).catch((err: any) => {
          loading.dismiss();
          this.funcoes.showAlert(JSON.stringify(err));
        });
      } else if (tipoLogin == 'google') {

        this.loginRedeSocialProvider.loginGoogle(this.idUserOneSignal).then((data: string) => {

          let retorno = JSON.parse(data);

          if (retorno.status) {
            this.user = retorno.dados;
            loading.dismiss();
            this.nav.setRoot('page-home', { 'usuario': this.user });
          } else {
            loading.dismiss();
            this.funcoes.showAlert(retorno.mensagem);
          }

        }).catch((err: any) => {
          loading.dismiss();
          this.funcoes.showAlert(JSON.stringify(err));
        });

      }
    } else {
      this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
    }

  }
}
