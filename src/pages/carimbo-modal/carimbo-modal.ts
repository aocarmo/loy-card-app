import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { Carimbo } from '../../model/carimbo-model';

/**
 * Generated class for the CarimboModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'page-carimbo-modal',
  segment: 'carimbo-modal'
})
@Component({
  selector: 'page-carimbo-modal',
  templateUrl: 'carimbo-modal.html',
})
export class CarimboModalPage {
  hash = null;
  carimbo: Carimbo = null;
  public qrcode: string;
  public idCarimboTemporario: number;
  public idEstabelecimento: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,public barcodescanner:BarcodeScanner) {
    this.qrcode = this.navParams.get('qrcode');
    this.idCarimboTemporario = this.navParams.get('idCarimboTemporario');
    this.idEstabelecimento = this.navParams.get('idEstabelecimento');
  }

  ionViewWillEnter() {
    alert(this.qrcode+"|"+this.idCarimboTemporario+"|"+this.idEstabelecimento);
  /*  this.barcodescanner.encode(this.barcodescanner.Encode.TEXT_TYPE, 'Hello World').then((data:any)=>{
      this.hash = "file:/"+data.file;
    
    }).catch((data:any)=>{
      
    });*/
  
  }

 

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
