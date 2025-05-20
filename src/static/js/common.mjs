//@ts-check
import * as JSONQL_S from "./jsonql.service.mjs"; // Serviços
import * as JSONQL_U from "./jsonql.user.mjs"; // Usuários
import * as JSONQL_C from "./jsonql.contract.mjs"; // Contratos
import * as JSONQL_A from "./jsonql.review.mjs"; // Avaliações
import * as JSONQL_P from "./jsonql.portfolio.mjs"; // Portfólios

/**
 * Retorna um número aleatório entre 0 e max, o min é opcional
 * Valor máximo
 * @param {number} max Valor máximo
 * @param {number} [min] Valor mínimo (opcional = 0)
 * 
 * @returns {number} Retorna um número aleatório
 */
// TODO: Move to a module
export function genRandomNumber(max, min) {
    if (min) {
        let val = (Math.random() * (max - min) + min)
        // TODO: why convert to string? avoid IDE warning
        // Avoid double values
        return parseInt(val.toString(), 10);
    }

    if (!max)
        return 0;

    return Math.floor(Math.random() * max);
}

export async function getExemplos() {
    if (globalThis._exemplos)
        return globalThis._exemplos
    
    try {
        console.log("chamado de novo");
        // URL assume que você esta na página src/dev.html
        const response = await fetch('data/json/_exemplos.json');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        globalThis._exemplos = json
        return json;
    } catch (error) {
        console.error(error.message);
    }

    return null;
}

/**
 * Verifica se o parametro é um número e retorna
 * 
 * @param {any} value - O valor para verificar
 * @returns {number | null} - Retorna o número ou null se não foi possível confirmar que é um número
 */
export function ensureInteger(value) {
    if (typeof (value) === "number" && Number.isInteger(value)) {
        return value;
    }

    if (typeof value === 'string') {
        const parsed = Number.parseInt(value, 10);
        return Number.isNaN(parsed) ? null : parsed;
    }

    return null;
}

/**
 * Cria N portfólios 
 */
export async function createNPortfolios(number) {
    // TODO: Does this work? Does this validate something?
    let number_int = ensureInteger(number)
    if (!number_int)
        number_int = 10

    // TODO: Make a single call
    if (!exemplos) {
        const json = await getExemplos();
        var exemplos = json.exemplos
    }

    let portfolios = [];

    for (let index = 0; index < number; index++) {
        function createSecao(ordem) {
            let ordem_int = ensureInteger(ordem)
            let secao = {
                ordem: ordem_int,
                // TODO: Verificar dinamicamente as categorias possíveis
                categoriaId: genRandomNumber(3),
                // TODO: Verificar dinamicamente os nomes de acordo com a categoria
                nome: "Seção de Informações",
            }

            // TODO: Criar dinamicamente
            // categorias_secao.json
            switch (secao.categoriaId) {
                // 0: Imagens
                case 0:
                    // TODO: Adicionar imagens reais
                    secao.contents = []
                    for (let j = 0; j < genRandomNumber(10, 5); j++) {
                        let linke = `https://picsum.photos/seed/${genRandomNumber(200)}/200`
                        secao.contents.push({
                            blob: linke, // portfolios.secao.contents.blob - string
                            descricao: "Foto" // portfolios.secao.contents.descricao - string
                        })
                    }
                    secao.nome = "Imagens"
                    secao.descricao = "Imagens de serviços realizados"
                    break;
                    // 1: Avaliações
                case 1:
                    // Faz nada: Essa categoria deve ser controlada pela pagina que mostra as informações
                    secao.nome = "Avaliações"
                    secao.descricao = "Cliente satisfeitos!"
                    break;
                    // 2: Links Externos
                case 2:
                    secao.contents = []
                    for (let j = 0; j < genRandomNumber(6, 3); j++) {
                        let linke = exemplos.links_externos[genRandomNumber(exemplos.links_externos.length)]
                        secao.contents.push({
                            blob: linke, // portfolios.secao.contents.blob - string
                            descricao: "Link Externo" // portfolios.secao.contents.descricao - string
                        })
                        secao.nome = "Redes Sociais"
                        secao.descricao = "Segue lá!"
                    }
                    break;
                default:
                    console.log("createNPortfolios: categoria informada não encontrada!");
                    return null
                    break;
            }

            return secao
        }

        const usuarios = JSONQL_U.readUsuarios();
        if (!usuarios?.length) {
            console.log("createNContratos: Não há usuários criados");
            return null
        }

        // TODO: Avoid creating more than 1 portfolios per user
        let usuarioId = usuarios[genRandomNumber(usuarios.length)].id // number
        let secoes = [];

        // Gera entre 2 e 5 seções para cada portfolio
        for (let i = 0; i < genRandomNumber(5, 2); i++) {
            secoes.push(createSecao(i));
        }

        const element = {
            usuarioId: usuarioId,
            secoes: secoes,
        }

        portfolios.push(element);
    }

    return portfolios;
}

/**
 * Cria N contratos 
 */
export async function createNContratos(number) {
    // TODO: Does this work? Does this validate something?
    let number_int = ensureInteger(number)
    if (!number_int)
        number_int = 10

    // TODO: Make a single call
    if (!exemplos) {
        const json = await getExemplos();
        var exemplos = json.exemplos
    }

    let contratos = [];

    for (let index = 0; index < number; index++) {

        // TODO: Otimizar query de serviços
        const servicos = JSONQL_S.readServicos();
        if (!servicos?.length) {
            console.log("createNContratos: Não há serviços criados");
            return null
        }

        const usuarios = JSONQL_U.readUsuarios();
        if (!usuarios?.length) {
            console.log("createNContratos: Não há usuários criados");
            return null
        }

        let servicoId = servicos[genRandomNumber(servicos.length)].id // number
        // TODO: Evitar que contratadoId === contratanteId
        let contratadoId = usuarios[genRandomNumber(usuarios.length)].id // number
        let contratanteId = usuarios[genRandomNumber(usuarios.length)].id // number
        let data = genRandomNumber(28) + "/" + genRandomNumber(12) + "/" + genRandomNumber(2006, 1970)
        let valor = genRandomNumber(5000, 100) // number

        const element = {
            servicoId: servicoId, // number
            contratadoId: contratadoId, // number
            contratanteId: contratanteId, // number
            data: data, // string
            valor: valor // number
        }

        contratos.push(element);
    }

    return contratos;
}

/**
 * Cria N avaliações 
 */
export async function createNAvaliacoes(number) {
    // TODO: Does this work? Does this validate something?
    let number_int = ensureInteger(number)
    if (!number_int)
        number_int = 10

    // TODO: Make a single call
    if (!exemplos) {
        const json = await getExemplos();
        var exemplos = json.exemplos
    }

    let avaliacoes = [];

    for (let index = 0; index < number; index++) {

        // TODO: Otimizar query de serviços
        const contrato = JSONQL_C.readContratos();
        if (!contrato?.length) {
            console.log("createNContratos: Não há contrato criados");
            return null
        }

        const usuarios = JSONQL_U.readUsuarios();
        if (!usuarios?.length) {
            console.log("createNContratos: Não há usuários criados");
            return null
        }

        // TODO: Evitar que contratadoId === contratanteId
        let contratoId = contrato[genRandomNumber(contrato.length)].id // number
        let contratanteId = usuarios[genRandomNumber(usuarios.length)].id // number
        let nota = genRandomNumber(11) // number
        let comentario = exemplos.avaliacoes[genRandomNumber(exemplos.avaliacoes.length)] // string

        const element = {
            contratoId: contratoId, // number
            contratanteId: contratanteId, // number
            nota: nota, // number
            comentario: comentario // string
        }

        avaliacoes.push(element);
    }

    return avaliacoes;
}

/**
 * Cria N usuários 
 */
export async function createNUsers(number) {
    // TODO: Does this work? Does this validate something?
    let number_int = ensureInteger(number)
    if (!number_int)
        number_int = 10

    // TODO: Make a single call
    if (!exemplos) {
        const json = await getExemplos();
        var exemplos = json.exemplos
    }

    let usuarios = [];

    for (let index = 0; index < number; index++) {
        let ativo = true
        let nome = exemplos.nomes[genRandomNumber(exemplos.nomes.length)]
        nome += " " + exemplos.sobrenomes[genRandomNumber(exemplos.sobrenomes.length)]
        let foto = `https://picsum.photos/seed/${genRandomNumber(200)}/200`
        let data_nascimento = genRandomNumber(28) + "/" + genRandomNumber(12) + "/" + genRandomNumber(2026, 1970)
        let email = exemplos.email[genRandomNumber(exemplos.email.length)] // string
        let senha = genRandomNumber(999999, 100000).toString() // string
        let tipo = exemplos.tipo[genRandomNumber(exemplos.tipo.length)] // string
        let cpf_cnpj = exemplos.cpf_cnpj[genRandomNumber(exemplos.cpf_cnpj.length)] // string
        let cidade = exemplos.cidades[genRandomNumber(exemplos.cidades.length)] // string
        let biografia = exemplos.biografia[genRandomNumber(exemplos.biografia.length)] // string
        let contatos = [ // Array
            exemplos.contatos[genRandomNumber(exemplos.contatos.length)],
            exemplos.contatos[genRandomNumber(exemplos.contatos.length)]
        ]

        const element = {
            ativo: ativo, // bool
            nome: nome, // string
            foto: foto, // string
            data_nascimento: data_nascimento, // string
            email: email, // string
            senha: senha, // string
            tipo: tipo, // string
            cpf_cnpj: cpf_cnpj, // string
            cidade: cidade, // string
            biografia: biografia, // string
            contatos: contatos // Array
        }

        usuarios.push(element);
    }

    return usuarios;
}

/**
 * Cria N serviços 
 */
export async function createNServicos(number) {
    // TODO: Does this work? Does this validate something?
    let number_int = ensureInteger(number)
    if (!number_int)
        number_int = 10

    // TODO: Make a single call
    if (!exemplos) {
        const json = await getExemplos();
        var exemplos = json.exemplos
    }

    let usuarios = [];

    for (let index = 0; index < number; index++) {

        let titulo = exemplos.categorias_servicos[genRandomNumber(exemplos.categorias_servicos.length)]
        // TODO: categorias_servicos -> array, use id only
        let categoriaId = genRandomNumber(exemplos.categorias_servicos.length)
        let categoria = exemplos.categorias_servicos[genRandomNumber(exemplos.categorias_servicos.length)]
        let contato = exemplos.contatos[genRandomNumber(exemplos.contatos.length)]
        let descricao = exemplos.descricoes[genRandomNumber(exemplos.descricoes.length)]

        const element = {
            titulo: titulo,
            categoriaId: categoriaId,
            categoria: categoria,
            contato: contato,
            descricao: descricao
        }

        usuarios.push(element);
    }

    return usuarios;
}