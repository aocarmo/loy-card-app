import { OfertaEstabelecimento } from './oferta_estabelecimento';
export class Estabelecimento {

    constructor(public id_estabelecimento?:number, 
                public nome_estabelecimento?: string,
                public numero_cep_estabelecimento?: number,
                public endereco_estabelecimento?: string,
                public numero_endereco_estabelecimento?: number,
                public complemento_endereco_estabelecimento?: string,
                public bairro_estabelecimento?: string,
                public municipio_estabelecimento?: string,
                public estado_estabelecimento?: string,
                public caminho_logo_grande_estabelecimento?: string,
                public latitude_estabelecimento?: string,
                public longitude_estabelecimento?: string,
                public cor_cartao_estabelecimento?: string,
                public distancia_estabelecimento?: string,            
                public ofertas_estabelecimento?: OfertaEstabelecimento[],
                public caminho_logo_pequena_estabelecimento?: string,
                public numero_telefone_estabelecimento?: string,
                public numero_telefone2_estabelecimento?: string,
                public numero_telefone3_estabelecimento?: string,
                public email_estabelecimento?: string,                   
                
                ){
    }

}