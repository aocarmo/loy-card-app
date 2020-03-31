
export class Usuario {

    constructor(
                public access_token?: string,
                public expires_in?: string,
                public token_type?: string,
                public scope?: string,                
                public usuario_id?:number, 
                public perfil_id?: number,
                public nome?: string,
                public email?: string,
                public telefone?: string,
                public foto?: string,
                public ultimo_acesso?: string,
                public refresh_token?: string              
                ){
    }

    
}