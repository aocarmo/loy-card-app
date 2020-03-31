import { Network } from '@ionic-native/network';
import { Interceptor } from './auth/interceptor.module';
import { QrCodeScannerService } from './../providers/qr-code-scanner/qr-code-scanner-service';
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { OneSignal } from '@ionic-native/onesignal';


import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Keyboard} from '@ionic-native/keyboard';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ActionSheet } from '@ionic-native/action-sheet';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Diagnostic } from '@ionic-native/diagnostic';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NgxQRCodeModule } from 'ngx-qrcode2';

import {ionBookingApp} from "./app.component";
import { LoginService } from '../providers/login/login.service';
import { FuncoesProvider } from '../providers/funcoes/funcoes';
import { CameraService } from '../providers/camera/camera-service';
import { PerfilService } from '../providers/perfil/perfil.service';
import { CartoesService } from '../providers/cartoes/cartoes.service';
import { HomeService } from '../providers/home/home.service';
import { ContatoService} from '../providers/contato/contato.service';
import { LoginRedeSocialProvider } from '../providers/login-rede-social/login-rede-social';
import { CarimboProvider } from '../providers/carimbo/carimbo';




@NgModule({
  declarations: [
    ionBookingApp
  ],
  imports: [
    BrowserModule,
    NgxQRCodeModule,
    HttpClientModule,    
    Interceptor,
    IonicModule.forRoot(
      ionBookingApp,
      {
        backButtonText: 'Voltar',
        iconMode: 'ios',
        modalEnter: 'modal-slide-in',
        modalLeave: 'modal-slide-out',
        tabsPlacement: 'bottom',
        pageTransition: 'ios-transition',
        preloadModules: true,
        scrollPadding: false,
        scrollAssist: true,
        autoFocusAssist: true
      }
    ),
    IonicStorageModule.forRoot({
      name: '__ionBookingDB',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ionBookingApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    QrCodeScannerService,
    BarcodeScanner,
    LoginService,
    FuncoesProvider,
    CameraService,
    ActionSheet,
    Camera,
    PerfilService,
    HttpClient,
    Network,
    Facebook,
    GooglePlus,
    CartoesService,
    Geolocation,
    HomeService,
    ContatoService,
    OneSignal,
    OpenNativeSettings,
    Diagnostic,
    LoginRedeSocialProvider,
    SocialSharing,
    CarimboProvider
    
  ]
})

export class AppModule {
}
