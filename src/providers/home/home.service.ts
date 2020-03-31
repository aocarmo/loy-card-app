import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FuncoesProvider } from '../funcoes/funcoes';
import { Constantes } from './../../constantes/constantes';

/*
  Generated class for the HomeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HomeService{

  constructor(public http: HttpClient,
              public funcoes: FuncoesProvider) { 
  }

  ObterEstabelecimentosProximos(access_token: string, latitude: string, longitude:string): Promise<any> {
  
    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type':  'application/x-www-form-urlencoded'   
      })
    };

    let json =  {
        "access_token": access_token,
        "latitude": latitude,
        "longitude": longitude
      };

    let urlParams  = this.funcoes.JSON_to_URLEncoded(json,null);
    
    return new Promise(resolve => {

      this.http.post(Constantes.API_OBTER_ESTABELECIMENTOS_PROXIMOS,urlParams,httpOptions).timeout(Constantes.TIMEOUT_RESQUEST).subscribe(data => {
     
        resolve(data);
       
      }, err => {
        resolve(err);
      });
    });
  }


}
