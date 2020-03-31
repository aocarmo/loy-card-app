export class Cartao {

    constructor(public idCartao?:number, 
                public idEstabelecimento?: number,
                public idUsuarioApp?: number,
                public nomeEstabelecimento?: string,
                public nomeUsuarioApp?: string,
                public qtdCarimbos?: number,
                public qtdCarimbosFechaCartao?: number,
                public codigoCartao?: string,
                public dataValidade?: string,
                public fotoEstabelecimento?: string,
                public cartaoFechado?: boolean,
                public brindeEstabelecimento?: string,
                public dsValorMinimoEstabelecimento?: string,
                public flExibirBotaoResgatar?: boolean
                ){
    }

    
}