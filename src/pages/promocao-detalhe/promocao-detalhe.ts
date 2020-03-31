import { OfertaEstabelecimento } from './../../model/oferta_estabelecimento';
import { FuncoesProvider } from './../../providers/funcoes/funcoes';
import { Component, ViewChild, NgZone } from "@angular/core";
import { IonicPage, NavController, NavParams, Platform, ToastController, Content } from "ionic-angular";


declare var google: any;

@IonicPage({
  name: 'page-promocao-detalhe',
  segment: 'promocao-detalhe/:id'
})

@Component({
  selector: 'page-promocao-detalhe',
  templateUrl: 'promocao-detalhe.html'
})
export class PromocaoDetalhePage {
  @ViewChild(Content) content: Content;

  public oferta: OfertaEstabelecimento = {};
  public ofertasEstabelecimentos: OfertaEstabelecimento[] = [];
  public maisOfertas: OfertaEstabelecimento[] = [];
  initialMapLoad: boolean = true;
  // Map
  public map: any;
  //
  public arr: any = Array;

  constructor(public nav: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public toastCtrl: ToastController,
    public funcoes: FuncoesProvider,
    public zone: NgZone) {


    this.oferta = this.navParams.get('oferta');
    this.ofertasEstabelecimentos = this.navParams.get('ofertasEstabelecimento');
    //Removendo ofertas de outros estabelicmentos
    for (let i = 0; i < this.ofertasEstabelecimentos.length; i++) {
      if (this.oferta.id_estabelecimento == this.ofertasEstabelecimentos[i].id_estabelecimento) {
        this.maisOfertas.push(this.ofertasEstabelecimentos[i]);
      }
    }

  }


  ionViewDidEnter() {
    this.initializeMap();
  }

  // view hotel detail
  verPromocaoDetalhe(oferta) {    
    //Faz o reload das variáveis na tela, para carregar carimbos
    this.zone.run(() => {
      this.oferta = oferta;
    });
  }

  initializeMap() {

    let latLng = new google.maps.LatLng(this.oferta.latitude_estabelecimento, this.oferta.longitude_estabelecimento);

    let mapOptions = {
      center: latLng,
      zoom: 16,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false
    }


    this.map = new google.maps.Map(document.getElementById("map-detail"), mapOptions);
    var infowindow = new google.maps.InfoWindow({ maxWidth: 700 });

    let informacoesEstabelecimentoBalaoMapa = '<table style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;"><tr style="padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;"><td><img align="center" style="vertical-align: middle;width: 70px;height: 70px;border-radius: 100%;" src="' + this.oferta.caminho_logo_pequena_estabelecimento + '"></td><td>&nbsp;</td>' + '<td><span><h4>' + this.oferta.nome_estabelecimento + '</h4></span>' +
       '<span>'  + this.oferta.endereco_estabelecimento + ', ' + this.oferta.numero_endereco_estabelecimento + ' - ' + this.oferta.municipio_estabelecimento + '/' + this.oferta.estado_estabelecimento + '.</span><br>';

      if (this.oferta.numero_telefone_estabelecimento != "" && this.oferta.numero_telefone_estabelecimento != null) {
        informacoesEstabelecimentoBalaoMapa += '<a href="tel:'+this.oferta.numero_telefone_estabelecimento+'">' + this.oferta.numero_telefone_estabelecimento + '</a><br>';
      }
      if (this.oferta.email_estabelecimento != "" && this.oferta.email_estabelecimento != null) {
        // informacoesEstabelecimentoBalaoMapa += '<h3>Email<h3><br>'; 
        informacoesEstabelecimentoBalaoMapa += '<a href="mailto:'+this.oferta.email_estabelecimento+'">' + this.oferta.email_estabelecimento + '</a><br>';
      }
      informacoesEstabelecimentoBalaoMapa += '<a style="color: blue;" href="https://www.google.com/maps/dir/?api=1&origin='+this.oferta.latitude_dipositivo+','+this.oferta.longitude_dipositivo+'&destination='+this.oferta.latitude_estabelecimento+','+this.oferta.longitude_estabelecimento+'" target="_blank">Visualize no Google Maps</a>';
      informacoesEstabelecimentoBalaoMapa += "</td></tr></table>";

   
    /*'<a href="http://google.com" target="_blank">Ver site</a>');*/

    var marker  = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      icon: {
        url: 'assets/img/marcadorGoogleMaps.png',
      }
    });

    google.maps.event.addListener(marker, 'click', function () {
      infowindow.close(); // Close previously opened infowindow
      infowindow.setContent(informacoesEstabelecimentoBalaoMapa);
      infowindow.open(this.map, this);
    });
   // google.maps.event.trigger(this.map, 'resize');
    // refresh map
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 300);
  }

}
