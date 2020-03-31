import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LoginService } from '../../providers/login/login.service';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {App} from "ionic-angular";

@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor{
 
  constructor(public loginService: LoginService, public app: App) { }
  intercept( 
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const dupReq = req.clone({
      headers: req.headers.set('key', 'DCtbqRXC8L'),
    });
    return next.handle(dupReq)
      .do((ev: HttpEvent<any>) => {

        let nav = this.app.getActiveNav(); //Pegando instancia do APP para usar o NAV

        if (ev instanceof HttpResponse) {
          //  console.log('tratando respostas', ev.body);
          if (ev.body.hasOwnProperty('tokenInvalido')) {          
            //Faz logout e redireciona para a pagina de login quando o o token e inválido
            if (ev.body.tokenInvalido) {
              this.loginService.doLogout().then((data: any) => {               
                nav.setRoot('page-login');
              });
            }

          }
        }
      });
  }


}
@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpsRequestInterceptor,
      multi: true,
    },
  ],
})
export class Interceptor { }