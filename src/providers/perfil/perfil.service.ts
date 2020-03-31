import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { FuncoesProvider } from '../funcoes/funcoes';
import { Constantes } from './../../constantes/constantes';

/*
  Generated class for the PerfilServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PerfilService {

  constructor(public http: HttpClient,
              public funcoes: FuncoesProvider
            ) {}

  alterFoto(base64Image: string, token: string, usuario_id: number) {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let jsonLogin =  {
        "access_token":token,
        "usuario_id":usuario_id,
        "foto": base64Image      
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(jsonLogin,null);

    return new Promise(resolve => {

      this.http.post(Constantes.API_ALTERAR_USUARIO,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);

      }, err => {
        resolve(err);       
      });
    });
  }

  alterDadosUsuario(token: string, usuario_id: number, nome: string, telefone: string) {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let jsonLogin =  {
        "access_token":token,
        "usuario_id":usuario_id,
        "nome": nome,      
        "telefone": telefone      
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(jsonLogin,null);

    return new Promise(resolve => {

      this.http.post(Constantes.API_ALTERAR_USUARIO,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);
        console.log(data);
      }, err => {
        resolve(err);      
        console.log(JSON.stringify(err));
         
      });
    });
  }

}
