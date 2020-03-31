import { FuncoesProvider } from './../providers/funcoes/funcoes';
import { LoginService } from './../providers/login/login.service';
import { Constantes } from './../constantes/constantes';
import { Usuario } from './../model/usuario-model';
import { Component, ViewChild } from "@angular/core";
import { Platform, Nav, AlertController } from "ionic-angular";
import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Storage } from '@ionic/storage';
import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal';
import { QrCodeScannerService } from '../providers/qr-code-scanner/qr-code-scanner-service';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Diagnostic } from '@ionic-native/diagnostic';



export interface MenuItem {
  title: string;
  component: any;
  user: Usuario,
  class: string
}

@Component({
  templateUrl: 'app.html'
})

export class ionBookingApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'page-login';
  showMenu: boolean = true;
  // rootNavCtrl: NavController;

  appMenuItems: Array<MenuItem>;
  user: Usuario = new Usuario();
  objUsuario: any;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public keyboard: Keyboard,
    private storage: Storage,
    public loginService: LoginService,
    public geolocation: Geolocation,
    private oneSignal: OneSignal,
    public qrCodeScannerService: QrCodeScannerService,
    public funcoes: FuncoesProvider,
    public alertCtrl: AlertController,
    private openNativeSettings: OpenNativeSettings,
    public diagnostic: Diagnostic

  ) {
    //Verifica fica escutando se existe usuario logado para exibir dados no menu
    this.loginService.isLoggedIn().subscribe((data: boolean) => {

      if (data) {

        this.storage.get(Constantes.STORAGE_USER).then((data: string) => {

          this.objUsuario = JSON.parse(data);
          this.user = this.objUsuario;
          
          if(this.user.perfil_id == 12){

            this.appMenuItems = [
              { title: 'Inicio', component: 'page-home', user: this.user, class: 'fa-home' },
              { title: 'Meus Cartões', component: 'page-cartoes', user: this.user, class: 'fa-credit-card' },
              { title: 'Histórico de Cartões', component: 'page-historico-cartoes', user: this.user, class: 'fa-credit-card' },
              { title: 'Ler QrCode', component: 'QrCode', user: this.user, class: 'fa-qrcode' },
              { title: 'Gerar Carimbo', component: 'page-gerar-carimbo', user: this.user, class: 'fa-qrcode' },
              { title: 'Contato', component: 'page-contato', user: this.user, class: 'fa-life-ring' },
              
            ];

          }else{
            this.appMenuItems = [
              { title: 'Inicio', component: 'page-home', user: this.user, class: 'fa-home' },
              { title: 'Meus Cartões', component: 'page-cartoes', user: this.user, class: 'fa-credit-card' },
              { title: 'Histórico de Cartões', component: 'page-historico-cartoes', user: this.user, class: 'fa-credit-card' },
              { title: 'Ler QrCode', component: 'QrCode', user: this.user, class: 'fa-qrcode' },
              { title: 'Contato', component: 'page-contato', user: this.user, class: 'fa-life-ring' },
              
            ];
          }
   

        });

      }
    
    });


    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {

      //Pega os dados de usuario da sessão
      this.storage.get(Constantes.STORAGE_USER).then((data: string) => {
       //Verifica se existe usuario logado com informações salvas no local storage, caso exista manda para tela inicial
        if (data != null) {
          this.splashScreen.hide();
          //Informa a obeservable que o usuario permanece logado
          this.loginService.permanecerLogado(true);
         // this.rootPage ='page-home';
          this.user = JSON.parse(data);
          this.nav.setRoot('page-home', { 'usuario': this.user });

        } else {
         
          //this.rootPage ='page-login';
          // Okay, so the platform is ready and our plugins are available.
          //*** Control Splash Screen
          // this.splashScreen.show();
          // this.splashScreen.hide();
          //*** Control Status Bar
          this.statusBar.styleDefault();
          this.statusBar.overlaysWebView(false);

          //Onesignal instancia plugin
          this.oneSignal.startInit('039b8764-7a4b-4f7d-ae93-a3629cfa2fad', '839626382012');
          this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
          //this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload));
          //this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data.notification.payload));
          this.oneSignal.endInit();

          //Inicia geolocalização
          //Se for ios pede a localização primiero
          /*Criado para pegar a permissão de localização do ios apenas na primeira vez que o App é iniciado
            isto porque no ios precisa pedir a localização antes de verificar se ela foi habilitada*/
          if (this.platform.is('ios')) {
            this.pedirLocalizacaoAtualIos().then((data: any) => { });
          } else {
            this.verificaPermissoesAcessoLocalizacao();
          }

          //*** Control Keyboard
          // this.keyboard.disableScroll(true); //Desabilita a rolagem automatica
        }

      });

    });
  }

  //Funcoes  callbacl push notofications
  /* private onPushReceived(payload: OSNotificationPayload) {
     alert('Push recevied:' + payload.body);
   }
   
   private onPushOpened(payload: OSNotificationPayload) {
     alert('Push opened: ' + payload.body);
   }*/
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component != "QrCode") {
      this.nav.setRoot(page.component, { 'usuario': page.user });
    } else {
      this.qrCodeScannerService.enviarQrCode(page.user);//Caso seja QRCODE so chama a função e não manda pra pagina nenhuma
    }

  }

  logout() {

    this.loginService.doLogout().then(data => {
      this.nav.setRoot('page-login');
    });

  }

  editProfile() {
    this.nav.setRoot('page-edit-profile', this.user);
  }

  verificaPermissoesAcessoLocalizacao() {

    this.diagnostic.isLocationEnabled().then((isLocationEnabled: boolean) => {

      this.diagnostic.isLocationAuthorized().then((isLocationAuthorized: any) => {

        this.splashScreen.hide();

        if (isLocationEnabled == false || isLocationAuthorized == false) {

          let alert = this.alertCtrl.create({
            title: 'Serviço de Localização Desativado',
            message: 'Por favor, ative o GPS do seu dispositivo.',
            buttons: [
              {
                text: 'Não',
                handler: () => {
                  this.funcoes.showAlert("Não será possível exibir estabelecimentos próximos e promoções no mapa.");
                }
              },
              {
                text: 'Sim',
                handler: () => {

                  this.openNativeSettings.open("location").then((data: any) => {
                    alert.dismiss(true);
                    this.pedirLocalizacaoAtual();
                  }).catch((error: any) => {

                  });
                }
              }
            ]
          });

          alert.present();
        } else {

          this.pedirLocalizacaoAtual();

        }
      });
    });
  }

  //Pede a localzação para verificar se foi concedida na permissão

  pedirLocalizacaoAtual(): Promise<void> {

    return this.geolocation.getCurrentPosition().then((resp) => {

    }).catch((error) => {
      if (error.code == 1) {
        this.verificaPermissoesAcessoLocalizacao();
      } else {
        this.funcoes.showAlert("Ops... Ocorreu algum erro ao acessar sua localização. Conceda as permissões de localização do LoyCard em configurações e reinicie o aplicativo.");
      }
      console.log('Error getting location', error);
    });

  }

  /*Criado para pegar a permissão de localização do ios apenas na primeira vez que o App é iniciado
    isto porque no ios precisa pedir a localização antes de verificar se ela foi habilitada*/
  pedirLocalizacaoAtualIos(): Promise<void> {

    return this.geolocation.getCurrentPosition().then((resp) => {
      this.verificaPermissoesAcessoLocalizacao();
    }).catch((error) => {
      if (error.code == 1) {
        this.verificaPermissoesAcessoLocalizacao();
      } else {
        this.funcoes.showAlert("Ops... Ocorreu algum erro ao acessar sua localização. Conceda as permissões de localização do LoyCard em configurações e reinicie o aplicativo.");
      }
      console.log('Error getting location', error);
    });

  }

}
