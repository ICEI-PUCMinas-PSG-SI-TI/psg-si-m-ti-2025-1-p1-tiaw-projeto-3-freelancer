//@ts-check
import * as JSONQL_S from "./jsonql.service.mjs"; // Serviços
import * as JSONQL_U from "./jsonql.user.mjs"; // Usuários
import * as JSONQL_C from "./jsonql.contract.mjs"; // Contratos
import * as JSONQL_A from "./jsonql.review.mjs"; // Avaliações
import * as JSONQL_P from "./jsonql.portfolio.mjs"; // Portfólios

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 *
 */

/**
 * Retorna um número aleatório entre 0 e max, o min é opcional
 * Valor máximo
 * @param {number} max Valor máximo
 * @param {number} [min] Valor mínimo (opcional = 0)
 * 
 * @returns {number} Retorna um número aleatório
 */
function genRandomNumber(max, min) {
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

async function getExemplos() {
    try {
        // URL assume que você esta na página src/dev.html
        const response = await fetch('data/json/_exemplos.json');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
    }

    return null;
}

/**
 * Cria N portfólios 
 */
async function createNPortfolios(number) {
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
                    break;
                    // 1: Avaliações
                case 1:
                    // Faz nada: Essa categoria deve ser controlada pela pagina que mostra as informações
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
async function createNContratos(number) {
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
async function createNAvaliacoes(number) {
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
async function createNUsers(number) {
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
async function createNServicos(number) {
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


/**
 * Verifica se o parametro é um número e retorna
 * 
 * @param {any} value - O valor para verificar
 * @returns {number | null} - Retorna o número ou null se não foi possível confirmar que é um número
 */
function ensureInteger(value) {
    if (typeof (value) === "number" && Number.isInteger(value)) {
        return value;
    }

    if (typeof value === 'string') {
        const parsed = Number.parseInt(value, 10);
        return Number.isNaN(parsed) ? null : parsed;
    }

    return null;
}

function setupDevTools() {
    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_create_usuarios_n = document.getElementById('dev-create-usuarios-n');
    let dev_create_usuarios = document.getElementById('dev-create-usuarios');
    let dev_delete_usuarios_all = document.getElementById('dev-delete-usuarios-all');
    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_delete_usuarios_id = document.getElementById('dev-delete-usuarios-id');
    let dev_delete_usuarios = document.getElementById('dev-delete-usuarios');
    let dev_read_usuarios = document.getElementById('dev-read-usuarios');

    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_create_servicos_n = document.getElementById('dev-create-servicos-n');
    let dev_create_servicos = document.getElementById('dev-create-servicos');
    let dev_delete_servicos_all = document.getElementById('dev-delete-servicos-all');
    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_delete_servicos_id = document.getElementById('dev-delete-servicos-id');
    let dev_delete_servicos = document.getElementById('dev-delete-servicos');
    let dev_read_servicos = document.getElementById('dev-read-servicos');

    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_create_contratos_n = document.getElementById('dev-create-contratos-n');
    let dev_create_contratos = document.getElementById('dev-create-contratos');
    let dev_delete_contratos_all = document.getElementById('dev-delete-contratos-all');
    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_delete_contratos_id = document.getElementById('dev-delete-contratos-id');
    let dev_delete_contratos = document.getElementById('dev-delete-contratos');
    let dev_read_contratos = document.getElementById('dev-read-contratos');

    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_create_avaliacoes_n = document.getElementById('dev-create-avaliacoes-n');
    let dev_create_avaliacoes = document.getElementById('dev-create-avaliacoes');
    let dev_delete_avaliacoes_all = document.getElementById('dev-delete-avaliacoes-all');
    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_delete_avaliacoes_id = document.getElementById('dev-delete-avaliacoes-id');
    let dev_delete_avaliacoes = document.getElementById('dev-delete-avaliacoes');
    let dev_read_avaliacoes = document.getElementById('dev-read-avaliacoes');

    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_create_portfolios_n = document.getElementById('dev-create-portfolios-n');
    let dev_create_portfolios = document.getElementById('dev-create-portfolios');
    let dev_delete_portfolios_all = document.getElementById('dev-delete-portfolios-all');
    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_delete_portfolios_id = document.getElementById('dev-delete-portfolios-id');
    let dev_delete_portfolios = document.getElementById('dev-delete-portfolios');
    let dev_read_portfolios = document.getElementById('dev-read-portfolios');

    let dev_outros_clear = document.getElementById('dev-outros-clear');

    // Usuários

    dev_create_usuarios?.addEventListener('click', async () => {
        const quantidade = dev_create_usuarios_n?.value;
        const quantidade_int = ensureInteger(quantidade)
        if (!quantidade_int) {
            console.log("dev_create_usuarios: Não foi possível realizar o parse da quantidade");
            return
        }

        const usuarios = await createNUsers(quantidade_int);
        usuarios.forEach((value) => JSONQL_U.createUsuario(value));
    })

    dev_delete_usuarios_all?.addEventListener('click', JSONQL_U.clearUsuarios)

    dev_delete_usuarios?.addEventListener('click', () => {
        const id = dev_delete_usuarios_id?.value;
        const id_int = ensureInteger(id)

        if (!id_int) {
            console.log("dev_delete_usuarios: Não foi possível realizar o parse do id");
            return
        }

        if (JSONQL_U.deleteUsuario(id_int)) {
            console.log(`dev_delete_usuarios: usuário ${id_int} foi deletado!`);
        } else {
            console.log(`dev_delete_usuarios: Não foi possível encontrar o usuário ou ocorreu um erro.`);
        }
    })

    dev_read_usuarios?.addEventListener('click', () => console.log(JSONQL_U.readUsuarios()))

    // Serviços

    dev_create_servicos?.addEventListener('click', async () => {
        let quantidade = dev_create_servicos_n?.value;
        const quantidade_int = ensureInteger(quantidade)
        if (!quantidade_int) {
            console.log("dev_create_servicos: Não foi possível realizar o parse da quantidade");
            return
        }
        let servicos = await createNServicos(quantidade_int);
        servicos.forEach((value) => JSONQL_S.createServicos(value));
    })

    dev_delete_servicos_all?.addEventListener('click', JSONQL_S.clearServicos)

    dev_delete_servicos?.addEventListener('click', () => {
        const id = dev_delete_servicos_id?.value;
        const id_int = ensureInteger(id)
        if (!id_int) {
            console.log("dev_delete_servicos: Não foi possível realizar o parse do id");
            return
        }

        if (JSONQL_S.deleteServicos(id_int)) {
            console.log(`dev_delete_servicos: serviço ${id_int} foi deletado!`);
        } else {
            console.log(`dev_delete_servicos: Não foi possível encontrar o serviço ou ocorreu um erro.`);
        }
    })

    dev_read_servicos?.addEventListener('click', () => console.log(JSONQL_S.readServicos()))

    // Contratos

    dev_create_contratos?.addEventListener('click', async () => {
        let quantidade = dev_create_contratos_n?.value;
        const quantidade_int = ensureInteger(quantidade)
        if (!quantidade_int) {
            console.log("dev_create_contratos: Não foi possível realizar o parse da quantidade");
            return
        }
        let contratos = await createNContratos(quantidade_int);
        contratos?.forEach((value) => JSONQL_C.createContrato(value));
    })

    dev_delete_contratos_all?.addEventListener('click', JSONQL_C.clearContratos)

    dev_delete_contratos?.addEventListener('click', () => {
        const id = dev_delete_contratos_id?.value;
        const id_int = ensureInteger(id)
        if (!id_int) {
            console.log("dev_delete_contratos: Não foi possível realizar o parse do id");
            return
        }

        if (JSONQL_C.deleteContrato(id_int)) {
            console.log(`dev_delete_contratos: contrato ${id_int} foi deletado!`);
        } else {
            console.log(`dev_delete_contratos: Não foi possível encontrar o contrato ou ocorreu um erro.`);
        }
    })

    dev_read_contratos?.addEventListener('click', () => console.log(JSONQL_C.readContratos()))

    // Avaliações

    dev_create_avaliacoes?.addEventListener('click', async () => {
        let quantidade = dev_create_avaliacoes_n?.value;
        const quantidade_int = ensureInteger(quantidade)
        if (!quantidade_int) {
            console.log("dev_create_avaliacoes: Não foi possível realizar o parse da quantidade");
            return
        }
        let avaliacoes = await createNAvaliacoes(quantidade_int);
        avaliacoes?.forEach((value) => JSONQL_A.createAvaliacao(value));
    })

    dev_delete_avaliacoes_all?.addEventListener('click', JSONQL_A.clearAvaliacoes)

    dev_delete_avaliacoes?.addEventListener('click', () => {
        const id = dev_delete_avaliacoes_id?.value;
        const id_int = ensureInteger(id)
        if (!id_int) {
            console.log("dev_delete_avaliacoes: Não foi possível realizar o parse do id");
            return
        }

        if (JSONQL_A.deleteAvaliacao(id_int)) {
            console.log(`dev_delete_avaliacoes: avaliação ${id_int} foi deletado!`);
        } else {
            console.log(`dev_delete_avaliacoes: Não foi possível encontrar a avaliação ou ocorreu um erro.`);
        }
    })

    dev_read_avaliacoes?.addEventListener('click', () => console.log(JSONQL_A.readAvaliacoes()))

    // Portfólio

    dev_create_portfolios?.addEventListener('click', async () => {
        let quantidade = dev_create_portfolios_n?.value;
        const quantidade_int = ensureInteger(quantidade)
        if (!quantidade_int) {
            console.log("dev_create_portfolios: Não foi possível realizar o parse da quantidade");
            return
        }
        let portfolios = await createNPortfolios(quantidade_int);
        portfolios?.forEach((value) => JSONQL_P.createPortfolio(value));
    })

    dev_delete_portfolios_all?.addEventListener('click', JSONQL_P.clearPortfolios)

    dev_delete_portfolios?.addEventListener('click', () => {
        const id = dev_delete_portfolios_id?.value;
        const id_int = ensureInteger(id)
        if (!id_int) {
            console.log("dev_delete_portfolios: Não foi possível realizar o parse do id");
            return
        }

        if (JSONQL_P.deletePortfolio(id_int)) {
            console.log(`dev_delete_portfolios: portfolio ${id_int} foi deletado!`);
        } else {
            console.log(`dev_delete_portfolios: Não foi possível encontrar o portfolio ou ocorreu um erro.`);
        }
    })

    dev_read_portfolios?.addEventListener('click', () => console.log(JSONQL_P.readPortfolios()))

    // Outros

    dev_outros_clear?.addEventListener('click', () => {
        // Limpa todas as informações do localStorage
        localStorage.clear()
        // Recarrega a página
        location.reload();
    })

}

setupDevTools();