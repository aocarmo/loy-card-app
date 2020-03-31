import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FuncoesProvider } from '../funcoes/funcoes';
import { Constantes } from './../../constantes/constantes';
/*
  Generated class for the CarimboProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CarimboProvider {

  constructor(public http: HttpClient,
              public funcoes: FuncoesProvider) {

  }



  gerarCarimbo(access_token: string, usuario_id: number, numero_nf:string, valor_compra:string, data_compra:string): Promise<any> {
  
    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let json =  {
        "access_token": access_token,
        "usuario_id": usuario_id,
        "numero_nf": numero_nf,
        "valor_compra": valor_compra,
        "data_compra": data_compra
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(json,null);
    
    return new Promise(resolve => {

      this.http.post(Constantes.API_OBTER_GERAR_CARIMBO,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {
     
        resolve(data);
       
      }, err => {
        resolve(err);
      });
    });
  }

  gerarCarimboAvulso(access_token: string, usuario_id: number, cartao_id: number, numero_nf:string, valor_compra:string, data_compra:string, qtd_carimbos: number): Promise<any> {
  
    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let json =  {
        "access_token": access_token,
        "usuario_id": usuario_id,
        "cartao_id": cartao_id,        
        "numero_nf": numero_nf,
        "valor_compra": valor_compra,
        "data_compra": data_compra,
        "qtd_carimbos": qtd_carimbos
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(json,null);
    
    return new Promise(resolve => {

      this.http.post(Constantes.API_OBTER_GERAR_CARIMBO_AVULSO,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {
     
        resolve(data);
       
      }, err => {
        resolve(err);
      });
    });
  }

  verificarLeituraCarimbo(access_token: string, carimbo_temporario_id: number, estabelecimento_id: number): Promise<any> {
  
    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let json =  {
        "access_token": access_token,
        "carimbo_temporario_id": carimbo_temporario_id,
        "estabelecimento_id": estabelecimento_id
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(json,null);
    
    return new Promise(resolve => {

      this.http.post(Constantes.API_OBTER_GERAR_CARIMBO_AVULSO,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {
     
        resolve(data);
       
      }, err => {
        resolve(err);
      });
    });
  }

}
