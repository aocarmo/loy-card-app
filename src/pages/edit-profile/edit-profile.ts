import { Network } from '@ionic-native/network';
import { LoginService } from './../../providers/login/login.service';
import { FuncoesProvider } from './../../providers/funcoes/funcoes';
import { PerfilService } from './../../providers/perfil/perfil.service';
import { CameraService } from './../../providers/camera/camera-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Usuario } from '../../model/usuario-model';
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { Storage } from '@ionic/storage';
import { Constantes } from './../../constantes/constantes';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';



@IonicPage({
  name: 'page-edit-profile',
  segment: 'edit-profile'
})


@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})


export class EditProfilePage {

  public registrarUsuarioForm: FormGroup;
  public isOnline: boolean =  true;
  connected: Subscription;
  disconnected: Subscription;

  profiledata: Boolean = true;
  user: Usuario = new Usuario();

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    private actionSheet: ActionSheet,
    public camera: CameraService,
    public perfilService: PerfilService,
    public funcoes: FuncoesProvider,
    public storage: Storage,
    private _fb: FormBuilder,
    public alertCtrl: AlertController,
    public loginService: LoginService,
    public network: Network
    ) {

  }

  ionViewDidEnter() {
    this.connected = this.network.onConnect().subscribe(()=>{      
      this.isOnline = true;       
     });
     this.disconnected = this.network.onDisconnect().subscribe(()=>{
      this.isOnline = false;  
    });      
  }

  ionViewWillLeave(){
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }

  ionViewWillEnter() {
    this.user = this.navParams.data;
  }

  ngOnInit() {
    this.registrarUsuarioForm = this._fb.group({
      nome: ['', Validators.compose([
        Validators.required
      ])],
      email: ['', Validators.compose([
        Validators.required,
      ])],
      telefone: ['', Validators.compose([
       
      ])]
    });
  }

  // process send button
  alterarDadosUsuario() {
    if (this.isOnline) {
      let loader = this.funcoes.showLoading("Atualizando informacões...");

      loader.present();
      this.perfilService.alterDadosUsuario(this.user.access_token, this.user.usuario_id, this.registrarUsuarioForm.value.nome, this.registrarUsuarioForm.value.telefone).then((retornoAlterarDados: any) => {

        if (retornoAlterarDados.ok) {


          this.user.nome = this.registrarUsuarioForm.value.nome;
          this.user.telefone = this.registrarUsuarioForm.value.telefone;

          this.storage.get(Constantes.STORAGE_USER).then((dadosUsuarioSessao: string) => {

            let objUsuario = JSON.parse(dadosUsuarioSessao);
            objUsuario.nome = this.registrarUsuarioForm.value.nome;
            objUsuario.telefone = this.registrarUsuarioForm.value.telefone;

            this.storage.set(Constantes.STORAGE_USER, JSON.stringify(objUsuario)).then(data => {
              // show message
              let toast = this.toastCtrl.create({
                showCloseButton: true,
                cssClass: 'profile-bg',
                message: retornoAlterarDados.msg,
                duration: 3000,
                position: 'bottom'
              });

              loader.dismiss();
              toast.present();
            });

          });

        } else {
          loader.dismiss();

          //Testando o time out da requisição para informar sobre conectividade do dispositivo
          if (retornoAlterarDados.hasOwnProperty('name') && retornoAlterarDados.name == "TimeoutError") {
            this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
          } else {
            this.funcoes.showAlert(retornoAlterarDados.msg);
          }

        }

      }).catch((erro: any) => {
        loader.dismiss();
        this.funcoes.showAlert("Ocorreu um erro ao alterar o usuário: " + erro);
      });
    } else {
      this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
    }

  }

  alteraFoto(): void {

    if (this.isOnline) {

      let buttonLabels = ['Tirar Foto', 'Escolher da Galeria'];

      const options: ActionSheetOptions = {
        title: 'Como gostaria de obter a imagem?',
        subtitle: 'Escolha uma opção',
        buttonLabels: buttonLabels,
        addCancelButtonWithLabel: 'Cancelar',
        // addDestructiveButtonWithLabel: 'Delete',
        // androidTheme: this.actionSheet.ANDROID_THEMES.THEME_HOLO_DARK,
        destructiveButtonLast: true
      };

      this.actionSheet.show(options).then((buttonIndex: number) => {

        this.camera.takePicture(buttonIndex).then((data: string) => {

          //Transformando o retorno em objeto para validar o retorno
          let retorno = JSON.parse(data);

          let loading = this.funcoes.showLoading("Alterando foto...");
          //Testando se a foto foi tirada ou selecionada da camera ou biblioteca
          if (retorno.status == "true") {

            //Chamada para requisição alterar foto
            this.perfilService.alterFoto(retorno.base64Image, this.user.access_token, this.user.usuario_id).then((retornoAlterarFoto: any) => {

              //Testando se a requisção foi enviada com sucesso
              if (retornoAlterarFoto.ok) {
                this.user.foto = retornoAlterarFoto.urlFoto;
                this.storage.get(Constantes.STORAGE_USER).then((dadosUsuarioSessao: string) => {

                  let objUsuario = JSON.parse(dadosUsuarioSessao);
                  objUsuario.foto = retornoAlterarFoto.urlFoto;

                  this.storage.set(Constantes.STORAGE_USER, JSON.stringify(objUsuario)).then(data => {

                    loading.dismiss();
                  });

                });

              } else {

                loading.dismiss();
                //Verifica se o erro foi por timeout para exibir alerta
                if (retornoAlterarFoto.hasOwnProperty('name') && retornoAlterarFoto.name == "TimeoutError") {
                  this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
                } else {
                  this.funcoes.showAlert(retornoAlterarFoto.msg);
                }

              }

            }).catch((erro: any) => {
              loading.dismiss();
              this.funcoes.showAlert("Ocorreu um erro ao alterar o usuário: " + erro);
            });
          }else{
            loading.dismiss();
            this.funcoes.showAlert(retorno.mensagem);
          }

        });

      });

    } else {
      this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
    }
  }

  alterarSenha() {

    if (this.isOnline) {
      let alterar = this.alertCtrl.create({
        title: 'Deseja alterar sua senha?',
        message: "Digite sua senha atual e em seguida sua nova senha.",
        inputs: [
          {
            name: 'senhaAtual',
            placeholder: 'Senha Atual',
            type: 'password'
          },
          {
            name: 'novaSenha',
            placeholder: 'Nova senha',
            type: 'password'
          },
          {
            name: 'reSenha',
            placeholder: 'Repetir senha',
            type: 'password'
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Alterar',
            handler: data => {

              let loading = this.funcoes.showLoading("Alterando senha...");

              this.loginService.alterarSenha(this.user.email, this.user.usuario_id, data.senhaAtual, data.novaSenha, data.reSenha, this.user.access_token)
                .then((retornoAlterarSenha: any) => {

                  //Testando se a requisção foi enviada com sucesso
                  if (retornoAlterarSenha.ok) {

                    let toast = this.toastCtrl.create({
                      message: retornoAlterarSenha.msg,
                      duration: 3000,
                      position: 'top',
                      cssClass: 'dark-trans',
                      closeButtonText: 'OK',
                      showCloseButton: true
                    });

                    loading.dismiss();
                    toast.present();
                  } else {
                    loading.dismiss();
                    //Verifica se o erro foi por timeout para exibir alerta
                    if (retornoAlterarSenha.hasOwnProperty('name') && retornoAlterarSenha.name == "TimeoutError") {
                      this.funcoes.showAlert("Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!");
                    } else {
                      this.funcoes.showAlert(retornoAlterarSenha.msg);
                    }

                  }

                }).catch(((erro: any) => {


                  let toast = this.toastCtrl.create({
                    message: "Ocorreu um erro ao alterar a senha: " + erro,
                    duration: 3000,
                    position: 'top',
                    cssClass: 'dark-trans',
                    closeButtonText: 'OK',
                    showCloseButton: true
                  });
                  loading.dismiss();
                  toast.present();
                }));
            }
          }
        ]
      });
      alterar.present();
    } else {
      this.funcoes.showAlert(Constantes.INTERNET_INDISPONIVEL);
    }
  }

}
