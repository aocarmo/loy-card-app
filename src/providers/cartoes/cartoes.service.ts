import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FuncoesProvider } from '../funcoes/funcoes';
import { Constantes } from './../../constantes/constantes';

/*
  Generated class for the CartoesServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CartoesService{

  constructor(public http: HttpClient,
              public funcoes: FuncoesProvider
  ) {
   
  }


  obterCartoesAbertos(access_token: string, usuario_id: number): Promise<any> {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let json =  {
        "access_token": access_token,
        "usuario_id": usuario_id      
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(json,null);

    return new Promise(resolve => {

      this.http.post(Constantes.API_OBTER_CARTOES_ABERTOS,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);
             
      }, err => {
        resolve(err);
      });
    });
  }

  resgatarCartao(cartao_id: number, access_token: string): Promise<any> {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let json =  {
        "cartao_id": cartao_id,
        "access_token": access_token      
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(json,null);

    return new Promise(resolve => {

      this.http.post(Constantes.API_RESGATAR_CARTAO,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);
             
      }, err => {
        resolve(err);
      });
    });
  }

  obterHistoricoCartoes(access_token: string, usuario_id: number): Promise<any> {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let json =  {
        "access_token": access_token,
        "usuario_id": usuario_id      
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(json,null);

    return new Promise(resolve => {

      this.http.post(Constantes.API_OBTER_OBTER_HISTORICO_CARTOES,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);
             
      }, err => {
        resolve(err);
      });
    });
  }

  removerCartao(access_token: string, cartao_id: number, usuario_id: number): Promise<any> {

    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let json =  {
        "access_token": access_token,
        "cartao_id": cartao_id,   
        "usuario_id": usuario_id      
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(json,null);

    return new Promise(resolve => {

      this.http.post(Constantes.API_OBTER_REMOVER_CARTAO,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {

        resolve(data);
             
      }, err => {
        resolve(err);
      });
    });
  }



}
