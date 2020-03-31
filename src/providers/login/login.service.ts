import { Storage } from '@ionic/storage';
import { Observable, Subject } from 'rxjs';
import { Usuario } from './../../model/usuario-model';
import { Constantes } from './../../constantes/constantes';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { FuncoesProvider } from '../funcoes/funcoes';
import 'rxjs/add/observable/forkJoin'; 
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

@Injectable()
export class LoginService extends BaseService {

  private logger = new Subject<boolean>();
  loggedIn: boolean;
  user: Usuario;

  constructor(public http: HttpClient, 
              public funcoes: FuncoesProvider,
              private storage: Storage,
              public faceBook: Facebook,
              public googlePlus: GooglePlus       
            ) {
    //console.log('Hello LoginProvider Provider');
    super();//Necessário em classes que extende algumas outra
  }


  doLogin(login: string, senha: string, codigo_onesignal: string) {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let jsonLogin =  {
        "username":login,
        "password":senha,
        "grant_type": Constantes.API_GRANT_TYPE,
        "client_id": Constantes.API_CLIENT_ID,
        "client_secret": Constantes.API_CLIENT_SECRET,
        "codigo_onesignal": codigo_onesignal
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(jsonLogin,null);
    
    return new Promise(resolve => {

      this.http.post(Constantes.API_LOGIN,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);
                
        if (data.hasOwnProperty('access_token')) {

          this.storage.set(Constantes.STORAGE_USER,JSON.stringify(data)).then(data => {
            this.loggedIn = true;
            this.logger.next(this.loggedIn);    
          });             
        }      
      
      }, err => {
        
        resolve(err);
      });
    });
  }

  doLogout(): Promise<void>{

    return this.storage.remove(Constantes.STORAGE_USER).then(data =>{
      this.faceBook.logout().then(data =>{});
      this.googlePlus.disconnect().then(data =>{});
      this.loggedIn = false;
      this.logger.next(this.loggedIn);
    });   
    
  }


  isLoggedIn(): Observable<boolean> {
    return this.logger.asObservable();
  }

  recuperarSenha(email: string) {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let json =  {
        "email":email       
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(json,null);

    return new Promise(resolve => {

      this.http.post(Constantes.API_RECUPERAR_SENHA,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);
             
      }, err => {
        resolve(err);
      });
    });
  }


  cadastraUsuario(nome: string, email: string, telefone: string, senha: string , reSenha: string) {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let json =  {
        "nome": nome,
        "email":email,
        "telefone": telefone,
        "senha":senha,
        "repetir_senha": reSenha
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(json,null);

    return new Promise(resolve => {

      this.http.post(Constantes.API_CADASTRAR_USUARIO,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);
             
      }, err => {
        resolve(err);
      });
    });
  }


  alterarSenha(email: string, usuario_id: number, senhaAtual: string, novaSenha: string, reNovaSenha: string, access_token: string) {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let json =  {
        "email":email,
        "usuario_id": usuario_id,
        "senhaAntiga": senhaAtual,
        "novaSenha": novaSenha,
        "repetirNovaSenha": reNovaSenha,
        "access_token": access_token
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(json,null);

    return new Promise(resolve => {

      this.http.post(Constantes.API_ALTERAR_SENHA,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);
             
      }, err => {
        resolve(err);
      });
    });
  }

  doLoginExterno(nome: string, email: string, urlFoto: string, codigo_onesignal: string) {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let jsonLogin =  {
        "nome":nome,
        "email":email,
        "grant_type": Constantes.API_GRANT_TYPE,
        "client_id": Constantes.API_CLIENT_ID,
        "client_secret": Constantes.API_CLIENT_SECRET,
        "username": email,
        "password": Constantes.API_SENHA_LOGIN_EXTERNO,
        "foto": urlFoto,
        "codigo_onesignal": codigo_onesignal

      };
      
    let urlParams  = this.funcoes.JSON_to_URLEncoded(jsonLogin,null);
   
    return new Promise(resolve => {

      this.http.post(Constantes.API_LOGIN_EXTERNO,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);
                
        if (data.hasOwnProperty('access_token')) {

          this.storage.set(Constantes.STORAGE_USER,JSON.stringify(data)).then(data => {
            this.loggedIn = true;
            this.logger.next(this.loggedIn);    
          });             
        }      
      
      }, err => {
        
        resolve(err);
      });
    });
  }

  permanecerLogado(condicao: boolean){
    this.loggedIn = condicao;
    this.logger.next(this.loggedIn);    
  }

 }
