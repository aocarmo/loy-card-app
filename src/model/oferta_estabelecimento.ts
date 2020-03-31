export class OfertaEstabelecimento {
                public nome_estabelecimento?: string;
                public longitude_estabelecimento?: string;
                public latitude_estabelecimento?: string;
                public id_estabelecimento?:number;              
                public endereco_estabelecimento?: string;
                public numero_endereco_estabelecimento?: number;
                public municipio_estabelecimento?:string;
                public estado_estabelecimento?:string;       
                public caminho_logo_pequena_estabelecimento?: string;
                public numero_telefone_estabelecimento?: string;
                public numero_telefone2_estabelecimento?: string;
                public numero_telefone3_estabelecimento?: string;
                public email_estabelecimento?: string;    
                public latitude_dipositivo?: string;
                public longitude_dipositivo?: string; 
    constructor(public titulo_oferta?:string, 
                public descricao_oferta?: string,
                public percentual_desconto_oferta?: number,
                public imagens_oferta?: string[],
                public valor_oferta?: string,
                public valor_final_oferta?: string,
                public created_oferta?: string                              
                ){
    }

}