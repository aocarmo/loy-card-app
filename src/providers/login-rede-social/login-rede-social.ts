import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FuncoesProvider } from './../../providers/funcoes/funcoes';
import { LoginService } from './../../providers/login/login.service';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { Usuario } from '../../model/usuario-model';
import { Constantes } from './../../constantes/constantes';

import { resolveDefinition } from '../../../node_modules/@angular/core/src/view/util';

/*
  Generated class for the LoginRedeSocialProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginRedeSocialProvider {
  public user: Usuario = null;
  constructor(public http: HttpClient,
    public funcoes: FuncoesProvider,
    public loginService: LoginService,
    public googlePlus: GooglePlus,
    public facebook: Facebook

  ) {
    console.log('Hello LoginRedeSocialProvider Provider');
  }

  //método para chamar api do facebook e salvar no banco o usuario    
  loginFacebook(idUserOneSignal: string): Promise<string> {

    let retorno = {
      status: null,
      mensagem: null,
      dados: null
    }

    let permissions = new Array<string>();
    permissions = ["public_profile", "email"];

    return this.facebook.login(permissions).then((response) => {
      let params = new Array<string>();

      return this.facebook.api("/me?fields=name,email,picture.width(720).height(720).as(picture_large)", params)
        .then((res: any) => {

          return this.loginService.doLoginExterno(res.name, res.email, res.picture_large.data.url, idUserOneSignal)
            .then((data: any) => {

              this.user = data;

              if (data.hasOwnProperty('ok')) {
                retorno.status = false;
                if (!data.ok) {
                  retorno.mensagem = data.msg;
                } else {
                  retorno.mensagem = "Ocorreu algum erro ao fazer o login, por favor, tente novamente";
                }
              } else if (data.hasOwnProperty('name') && data.name == "TimeoutError") {
                retorno.status = false;
                retorno.mensagem = "Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!";
              }
              else {
                retorno.status = true;
                retorno.mensagem = "Login efetuado com sucesso.";
                retorno.dados = this.user;
              }
              return JSON.stringify(retorno);

            }).catch(((erro: any) => {
              retorno.status = false;
              retorno.mensagem = JSON.stringify(erro);
              return JSON.stringify(retorno);
            }));

        }, (error) => {
          retorno.status = false;
          retorno.mensagem = JSON.stringify(error);
          return JSON.stringify(retorno);
        })
    }, (error) => {

      if (error === "User cancelled.") {
        retorno.status = false;
        retorno.mensagem = "O login com o facebook foi cancelado.";
        return JSON.stringify(retorno);
      }else if(error.errorCode == 4201)
      {
        retorno.status = false;
        retorno.mensagem = "O login com o facebook foi cancelado.";
        return JSON.stringify(retorno);

      } 
      else {
        retorno.status = false;
        retorno.mensagem = JSON.stringify(error);
        return JSON.stringify(retorno);
      }
    });
  }

  loginGoogle(idUserOneSignal: string) : Promise<string> {

    let retorno = {
      status: null,
      mensagem: null,
      dados: null
    }

    return this.googlePlus.login({})
      .then((res: any) => {

      return  this.loginService.doLoginExterno(res.displayName, res.email, res.imageUrl, idUserOneSignal)
          .then((data: any) => {
            this.user = data;

            if (data.hasOwnProperty('ok')) {
              retorno.status = false;
              if (!data.ok) {
                retorno.mensagem = data.msg;
              } else {
                retorno.mensagem = "Ocorreu algum erro ao fazer o login, por favor, tente novamente";
              }
            } else if (data.hasOwnProperty('name') && data.name == "TimeoutError") {
              retorno.status = false;
              retorno.mensagem = "Seu dispositivo parece estar sem conexão ou sua conexão está muito lenta. Por favor, tente novamente!";
            }
            else {
              retorno.status = true;
              retorno.mensagem = "Login efetuado com sucesso.";
              retorno.dados = this.user;
            }
            return JSON.stringify(retorno);

          }).catch(((erro: any) => {
           
            retorno.status = false;
            retorno.mensagem = JSON.stringify(erro);
            return JSON.stringify(retorno);

          }));

      }).catch((err: any) => {       

        if (err === "The user canceled the sign-in flow.") {
          retorno.status = false;
          retorno.mensagem = "O login com o Google foi cancelado.";
          return JSON.stringify(retorno);
        
        } else {
          retorno.status = false;
          retorno.mensagem = JSON.stringify(err);
          return JSON.stringify(retorno);
        }
      });

  }

}
