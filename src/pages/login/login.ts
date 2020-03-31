import { Constantes } from './../../constantes/constantes';
import { FuncoesProvider } from './../../providers/funcoes/funcoes';
import { LoginService } from './../../providers/login/login.service';
import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IonicPage, NavController, AlertController, ToastController, MenuController, LoadingController, Platform } from "ionic-angular";
import { Facebook } from '@ionic-native/facebook';
import { Usuario } from '../../model/usuario-model';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs';
import { GooglePlus } from '@ionic-native/google-plus';
import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal';
import { LoginRedeSocialProvider } from '../../providers/login-rede-social/login-rede-social';

@IonicPage({
  name: 'page-login',
  segment: 'login',
  priority: 'high'
})

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;
  public isOnline: boolean = true;
  public user: Usuario = null;
  public idUserOneSignal: string = "";
  connected: Subscription;
  disconnected: Subscription;

  constructor(private _fb: FormBuilder,
    public nav: NavController,
    public forgotCtrl: AlertController,
    public menu: MenuController,
    public toastCtrl: ToastController,
    public loginService: LoginService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public funcoes: FuncoesProvider,
    public facebook: Facebook,
    public network: Network,
    public googlePlus: GooglePlus,
    public platform: Platform,
    private oneSignal: OneSignal,
    public loginRedeSocialProvider: LoginRedeSocialProvider
  ) {
    this.menu.swipeEnable(false);
    this.menu.enable(false);
    this.platform.ready().then(() => {

      this.oneSignal.getIds().then((data: any) => {
        this.idUserOneSignal = data.userId;
      }).catch(err => {
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
    this.onLoginForm = this._fb.group({
      email: ['', Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  // go to register page
  register() {
    this.nav.setRoot('page-register');
  }

  // login and go to home page
  login() {

    if (this.isOnline) {

      let loading = this.funcoes.showLoading("Aguarde...");

      this.loginService.doLogin(this.onLoginForm.value.email, this.onLoginForm.value.password, this.idUserOneSignal)
        .then((data: any) => {
          this.user = data;

          if (data.hasOwnProperty('ok')) {
            loading.dismiss();
            this.funcoes.showAlert("Usuário e/ou senha incorreto(s).");

          } else if (data.hasOwnProperty('name') && data.name == "TimeoutError") {
            loading.dismiss();
            this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
          }
          else {
            loading.dismiss();
            this.nav.setRoot('page-home', { 'usuario': this.user });
          }

        }).catch(((erro: any) => {

          loading.dismiss();
          this.funcoes.showAlert(erro);

        }));
    } else {
      this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
    }
  }

  recuperarSenha() {

    if (this.isOnline) {

      let forgot = this.forgotCtrl.create({
        title: 'Esqueceu a senha?',
        message: "Digite seu endereço de e-mail para enviar um link de redefinição da senha.",
        inputs: [
          {
            name: 'email',
            placeholder: 'Email',
            type: 'email'
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {

            }
          },
          {
            text: 'Enviar',
            handler: data => {

              let loading = this.funcoes.showLoading("Enviando e-mail...");

              this.loginService.recuperarSenha(data.email)
                .then((retornoRecuperarSenha: any) => {

                  if (retornoRecuperarSenha.ok) {
                    loading.dismiss();
                    let toast = this.toastCtrl.create({
                      message: retornoRecuperarSenha.msg,
                      duration: 3000,
                      position: 'top',
                      cssClass: 'dark-trans',
                      closeButtonText: 'OK',
                      showCloseButton: true
                    });
                    toast.present();
                  } else {
                    loading.dismiss();
                    //Testando o time out da requisição para informar sobre conectividade do dispositivo
                    if (retornoRecuperarSenha.hasOwnProperty('name') && retornoRecuperarSenha.name == "TimeoutError") {
                      this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
                    } else {
                      this.funcoes.showAlert(retornoRecuperarSenha.msg);
                    }
                  }


                }).catch(((erro: any) => {

                  loading.dismiss();
                  let toast = this.toastCtrl.create({
                    message: "Ocorreu um erro ao enviar o e-mail" + erro,
                    duration: 3000,
                    position: 'top',
                    cssClass: 'dark-trans',
                    closeButtonText: 'OK',
                    showCloseButton: true
                  });
                  toast.present();
                }));
            }
          }
        ]
      });
      forgot.present();
    } else {
      this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
    }
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
