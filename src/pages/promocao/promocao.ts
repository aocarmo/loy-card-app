import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, Platform} from "ionic-angular";

declare var google: any;

@IonicPage({
  name: 'page-promocao',
  segment: 'promocao'
})

@Component({
  selector: 'page-promocao',
  templateUrl: 'promocao.html'
})
export class PromocaoPage {
  // list of promocoes
  public promocoes: any;
  // Map
  public map: any;

  constructor(public nav: NavController, public navParams: NavParams, public platform: Platform) {
    // set sample data
 
  }

  ionViewDidLoad() {
    // init map
    this.initializeMap();
  }

  // view promocao detail
  viewPromocao(promocao) {
    
    this.nav.push('page-hotel-detail', {
      'id': promocao.id
    });
  }

  initializeMap() {
    let latLng = new google.maps.LatLng(this.promocoes[0].location.lat, this.promocoes[0].location.lon);

    let mapOptions = {
      center: latLng,
      zoom: 11,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false
    }

    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // add markers to map by promocao
    for (let i = 0; i < this.promocoes.length; i++) {
      let promocao = this.promocoes[i];
      new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(promocao.location.lat, promocao.location.lon),
        icon:  {
          url: 'assets/img/marcadorGoogleMaps.png',         
        }
      });
    }

    // refresh map
    setTimeout(() => {
      google.maps.event.trigger(this.map, 'resize');
    }, 300);
  }

  // view all promocoes
  viewPromocoes() {
    this.nav.push('page-promocao');
  }
}
