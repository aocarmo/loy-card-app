import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { FuncoesProvider } from '../funcoes/funcoes';
import { Constantes } from './../../constantes/constantes';

/*
  Generated class for the ContatoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContatoService {

  constructor(public http: HttpClient,
    public funcoes: FuncoesProvider) {
   
  }

  RegistrarContato(usuario_id: number, assunto: string, mensagem: string) {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let jsonLogin =  {      
        "usuario_id":usuario_id,
        "assunto": assunto,      
        "mensagem": mensagem      
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(jsonLogin,null);

    return new Promise(resolve => {

      this.http.post(Constantes.API_OBTER_REGISTRAR_CONTATO,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);
        
      }, err => {
        resolve(err);      
              
      });
    });
  }

  ObterInformacoesContato() {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let jsonLogin =  {};

    let urlParams  = this.funcoes.JSON_to_URLEncoded(jsonLogin,null);

    return new Promise(resolve => {

      this.http.post(Constantes.API_OBTER_OBTER_INFORMACOES_CONTATO,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);
      
      }, err => {
        resolve(err);      
     
         
      });
    });
  }

}
