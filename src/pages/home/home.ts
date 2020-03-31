import { Estabelecimento } from './../../model/estabelecimento';
import { OfertaEstabelecimento } from './../../model/oferta_estabelecimento';
import { FuncoesProvider } from './../../providers/funcoes/funcoes';
import { Component, NgZone } from "@angular/core";
import { IonicPage, NavController, NavParams, MenuController, ModalController, PopoverController, ToastController, Platform, AlertController } from "ionic-angular";
import { QrCodeScannerService } from "../../providers/qr-code-scanner/qr-code-scanner-service";
import { Usuario } from '../../model/usuario-model';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { HomeService } from "../../providers/home/home.service";
import { OpenNativeSettings } from '../../../node_modules/@ionic-native/open-native-settings';
import { Diagnostic } from '@ionic-native/diagnostic';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Observable } from '../../../node_modules/rxjs';



declare var google: any;

@IonicPage({
  name: 'page-home',
  segment: 'home',
  priority: 'high'
})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  dDate: Date = new Date();
  showItems: boolean = false;
  user: Usuario;
  objUsuario: any;
  public map: any;

  public estabelecimetos: Estabelecimento[] = [];
  public ofertasEstabelecimentos: OfertaEstabelecimento[] = [];


  constructor(public nav: NavController, public navParams: NavParams,
    public menuCtrl: MenuController, public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public qrCodeScannerService: QrCodeScannerService,
    public funcoes: FuncoesProvider,
    public storage: Storage,
    public toastCtrl: ToastController,
    public geolocation: Geolocation,
    public homeService: HomeService,
    public platform: Platform,
    public alertCtrl: AlertController,
    private openNativeSettings: OpenNativeSettings,
    public zone: NgZone,
    public diagnostic: Diagnostic,
    private socialSharing: SocialSharing
  ) {
    // set sample data
    this.menuCtrl.swipeEnable(true, 'authenticated');
    this.menuCtrl.enable(true);
    this.user = this.navParams.get('usuario');
   
  }

  ionViewDidLoad() {
    // init map
    //this.recarregaHome();    
    this.verificaPermissoesAcessoLocalizacao();
  
  }

  recarregaHome() {
    let loading = this.funcoes.showLoading("Buscando promoções...");

    this.platform.ready().then(() => {
      
      this.geolocation.getCurrentPosition().then((resp) => {       
       
        this.ObterEstabelecimentosProximos(resp.coords.latitude, resp.coords.longitude).then((data:any)=>{    
          loading.dismiss();      
          /*if(data != ""){           
           this.funcoes.showAlert(data);
          }*/
        });

      }).catch((error) => {
        loading.dismiss();
        if (error.code == 1) {
          loading.dismiss();    
          this.verificaPermissoesAcessoLocalizacao();
        }else{        
        this.funcoes.showAlert(JSON.stringify(error));
          //this.funcoes.showAlert("Ops... Ocorreu algum erro ao acessar sua localização. Conceda as permissões de localização do LoyCard em configurações e reinicie o aplicativo.");
        }
        console.log('Error getting location', error);
      });
     
    });

    setTimeout(() => {
      loading.dismiss();      
    }, 60000);

  }

  doRefresh(refresher) {
    this.verificaPermissoesAcessoLocalizacao();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


  initializeMap(latDispositivo, lonDispositivo, estabelecimetos: Estabelecimento[]) {
    let latLng = new google.maps.LatLng(latDispositivo, lonDispositivo);

    let mapOptions = {
      center: latLng,
      zoom: 12,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false
    }

    this.map = new google.maps.Map(document.getElementById("home-map"), mapOptions);
    var infowindow = new google.maps.InfoWindow({ maxWidth: 700 });
    var contentString = [];

    // add markers to map by hotel
    for (let i = 0; i < estabelecimetos.length; i++) {
      let informacoesEstabelecimentoBalaoMapa = '<table><tr><td><img align="center" style="vertical-align: middle;width: 70px;height: 70px;border-radius: 100%;" src="' + estabelecimetos[i].caminho_logo_pequena_estabelecimento + '"></td><td>&nbsp;</td>' + '<td><h2>' + estabelecimetos[i].nome_estabelecimento + '</h2>' +
        '<p>' + estabelecimetos[i].endereco_estabelecimento + ', ' + estabelecimetos[i].numero_endereco_estabelecimento + ' - ' + estabelecimetos[i].municipio_estabelecimento + '/' + estabelecimetos[i].estado_estabelecimento + '.</p>';

      if (estabelecimetos[i].numero_telefone_estabelecimento != "" && estabelecimetos[i].numero_telefone_estabelecimento != null) {
        informacoesEstabelecimentoBalaoMapa += '<p><a href="tel:'+estabelecimetos[i].numero_telefone_estabelecimento+'">' + estabelecimetos[i].numero_telefone_estabelecimento + '</a></p>';
      }
      if (estabelecimetos[i].email_estabelecimento != "" && estabelecimetos[i].email_estabelecimento != null) {
        // informacoesEstabelecimentoBalaoMapa += '<h3>Email<h3><br>'; 
        informacoesEstabelecimentoBalaoMapa += '<p><a href="mailto:'+estabelecimetos[i].email_estabelecimento+'">' + estabelecimetos[i].email_estabelecimento + '</a></p>';
      }
      informacoesEstabelecimentoBalaoMapa += '<a style="color: blue;" href="https://www.google.com/maps/dir/?api=1&origin='+latDispositivo+','+lonDispositivo+'&destination='+estabelecimetos[i].latitude_estabelecimento+','+estabelecimetos[i].longitude_estabelecimento+'" target="_blank">Visualize no Google Maps</a>';
      informacoesEstabelecimentoBalaoMapa += "</td></tr></table>";
      contentString.push(informacoesEstabelecimentoBalaoMapa);

      

      var marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(estabelecimetos[i].latitude_estabelecimento, estabelecimetos[i].longitude_estabelecimento),
        icon: {
          url: 'assets/img/marcadorGoogleMaps.png',
        }
      });

      google.maps.event.addListener(marker, 'click', function () {
        infowindow.close(); // Close previously opened infowindow
        infowindow.setContent(contentString[i]);
        infowindow.open(this.map, this);
      });

    }
    // refresh map
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 300);
  }


  // view hotel detail
  verPromocaoDetalhe(oferta) {
    // console.log(hotel.id)
    this.nav.push('page-promocao-detalhe', {
      'oferta': oferta,
      'ofertasEstabelecimento': this.ofertasEstabelecimentos
    });
  }

  // view all hotels
  viewHotels() {
    this.nav.push('page-promocao');
  }

  doScanQrCodeApp() {
    this.qrCodeScannerService.enviarQrCode(this.user);
  }



  ObterEstabelecimentosProximos(latitude: number, longitude: number): Promise<string> {

    let retorno: string = "";
    this.ofertasEstabelecimentos = [];
    
   return this.homeService.ObterEstabelecimentosProximos(this.user.access_token, latitude.toString(), longitude.toString()).then((data: any) => {
    
      if (data.ok) {
    
        this.estabelecimetos = data.retorno;
        //Pegando todas a promoções de todos estabelecimentos
        for (let i = 0; i < this.estabelecimetos.length; i++) {
          if (this.estabelecimetos[i].ofertas_estabelecimento && this.estabelecimetos[i].ofertas_estabelecimento.length) {
            for (let j = 0; j < this.estabelecimetos[i].ofertas_estabelecimento.length; j++) {
              this.estabelecimetos[i].ofertas_estabelecimento[j].nome_estabelecimento = this.estabelecimetos[i].nome_estabelecimento;
              this.estabelecimetos[i].ofertas_estabelecimento[j].latitude_estabelecimento = this.estabelecimetos[i].latitude_estabelecimento;
              this.estabelecimetos[i].ofertas_estabelecimento[j].longitude_estabelecimento = this.estabelecimetos[i].longitude_estabelecimento;
              this.estabelecimetos[i].ofertas_estabelecimento[j].id_estabelecimento = this.estabelecimetos[i].id_estabelecimento;
              this.estabelecimetos[i].ofertas_estabelecimento[j].endereco_estabelecimento = this.estabelecimetos[i].endereco_estabelecimento;
              this.estabelecimetos[i].ofertas_estabelecimento[j].numero_endereco_estabelecimento = this.estabelecimetos[i].numero_endereco_estabelecimento;
              this.estabelecimetos[i].ofertas_estabelecimento[j].municipio_estabelecimento = this.estabelecimetos[i].municipio_estabelecimento;
              this.estabelecimetos[i].ofertas_estabelecimento[j].estado_estabelecimento = this.estabelecimetos[i].estado_estabelecimento;
              this.estabelecimetos[i].ofertas_estabelecimento[j].caminho_logo_pequena_estabelecimento = this.estabelecimetos[i].caminho_logo_pequena_estabelecimento;
              this.estabelecimetos[i].ofertas_estabelecimento[j].numero_telefone_estabelecimento = this.estabelecimetos[i].numero_telefone_estabelecimento;
              this.estabelecimetos[i].ofertas_estabelecimento[j].numero_telefone2_estabelecimento = this.estabelecimetos[i].numero_telefone2_estabelecimento;
              this.estabelecimetos[i].ofertas_estabelecimento[j].numero_telefone3_estabelecimento = this.estabelecimetos[i].numero_telefone3_estabelecimento;
              this.estabelecimetos[i].ofertas_estabelecimento[j].email_estabelecimento = this.estabelecimetos[i].email_estabelecimento;
              this.estabelecimetos[i].ofertas_estabelecimento[j].latitude_dipositivo = latitude.toString();
              this.estabelecimetos[i].ofertas_estabelecimento[j].longitude_dipositivo = longitude.toString();
              this.ofertasEstabelecimentos.push(this.estabelecimetos[i].ofertas_estabelecimento[j]);
            }
          }
        }
        //Inicializa o mapa com as latitudes e logitudes
        this.initializeMap(latitude, longitude, this.estabelecimetos);
      
      } else if (data.hasOwnProperty('name') && data.name == "TimeoutError") {       
        retorno = "Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!";
        return retorno;    
      }
      else {
        retorno = data.msg;
        return retorno;    
      }

    }).catch((err: any) => {
     
      retorno = JSON.stringify(err);
      return retorno;    
    });



  }

  verificaPermissoesAcessoLocalizacao(){
    this.diagnostic.isLocationEnabled().then((isLocationEnabled:boolean) =>{
      this.diagnostic.isLocationAuthorized().then((isLocationAuthorized:any) =>{
        if(isLocationEnabled == false || isLocationAuthorized == false){
          
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
                  this.openNativeSettings.open("location").then((data:any)=>{    
                    alert.dismiss(true);              
                    this.verificaPermissoesAcessoLocalizacao();
                  }).catch((error:any)=>{
                    
                  });
                }
              }
            ]
          });
          alert.present();  
        }else{
          this.recarregaHome();    
        }
      });
    });
  }

  compartilharApp(redeSocial: string){

    let loading = this.funcoes.showLoading('');
    if(redeSocial == 'facebook'){
      this.socialSharing.shareViaFacebook('Click no link para baixar o LoyCard e aproveite as nossas vantagens. ;)',null, 'https://loycard.com.br/redirect_mobile/')
      .then((data:any)=>{
        loading.dismiss();       
      }).catch((err:any)=>{
        loading.dismiss();     
      });
    }else if(redeSocial == 'whatsapp'){
      this.socialSharing.shareViaWhatsApp('Click no link para baixar o LoyCard e aproveite as nossas vantagens. ;)',null, 'https://loycard.com.br/redirect_mobile/')
      .then((data:any)=>{
        loading.dismiss();   
      }).catch((err:any)=>{
        loading.dismiss();     
      });
      
    } 
  }



}
