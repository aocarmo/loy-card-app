import { Cartao } from './cartao-model';
export class CartaoInativo {

    constructor(public idCartao?:number, 
                public situacaoCartao?: string,
                public idEstabelecimento?: number,
                public idUsuarioApp?: number,
                public nomeEstabelecimento?: string,
                public nomeUsuarioApp?: string,
                public qtdCarimbos?: number,
                public qtdCarimbosFechaCartao?: number,
                public codigoCartao?: string,
                public dataValidade?: string,
                public dtResgate?: string,
                public dtCriacao?: string,
                public fotoEstabelecimentoGrande?: string,
                public fotoEstabelecimentoPequena?: string,
                public cartaoFechado?: boolean,
                public brindeEstabelecimento?: string,
                public dsValorMinimoEstabelecimento?: string,
                public cartao?: Cartao
                ){
    }

    
}