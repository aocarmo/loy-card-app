import { Camera, CameraOptions } from '@ionic-native/camera';
import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';



@Injectable()
export class CameraService {


  constructor(public camera: Camera, private diagnostic: Diagnostic) { }


  takePicture(sourceType: number): Promise<string> {

    let retorno = {
      status: "",
      base64Image: "",
      mensagem: ""
    };

    return new Promise(resolve => {

      this.diagnostic.isCameraAuthorized().then((data: any) => {

        if (data) {

          const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: sourceType,
            allowEdit: true
          }

          this.camera.getPicture(options).then((imageData) => {
            retorno.status = "true";
            retorno.base64Image = imageData;
            resolve(JSON.stringify(retorno));

          }, (err) => {
            retorno.status = "false";          
            if(JSON.stringify(err) == '"No Image Selected"'){
              retorno.mensagem = "Nenhuma imagem foi selecionada."
            }else  if(JSON.stringify(err) == '"has no access to assets"'){
              retorno.mensagem = "Nenhuma imagem foi selecionada."
            }else  if(JSON.stringify(err) == '"No camera available"'){
              retorno.mensagem = "Operação cancelada.";
            }         
            resolve(JSON.stringify(retorno));
          });

        } else {

          this.diagnostic.requestCameraAuthorization().then((data: string) => {

            if (data == "authorized") {
              this.takePicture(sourceType);
            } else {
              retorno.status = "false";
              retorno.mensagem = "Sem permissão para acessar a câmera, por favor conceda permissão ao LoyCard para acessar a câmera do seu dispositivo em configurações.";
              resolve(JSON.stringify(retorno));
            }
          }).catch((err: any) => {
            retorno.status = "false";
            retorno.mensagem = ("Ocorreu um erro ao scanear o QrCode: " + JSON.stringify(err));
            resolve(JSON.stringify(retorno));
          });
        }
      }).catch((err: any) => {

        retorno.status = "false";
        retorno.mensagem = JSON.stringify(err);
        resolve(JSON.stringify(retorno));
      });
    });
  }
}
