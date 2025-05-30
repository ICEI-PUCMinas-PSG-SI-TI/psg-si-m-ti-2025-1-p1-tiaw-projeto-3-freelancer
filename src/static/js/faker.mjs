//@ts-check

import * as JSONQL_S from "./jsonql.service.mjs"; // Serviços
import * as JSONQL_U from "./jsonql.user.mjs"; // Usuários
import * as JSONQL_C from "./jsonql.contract.mjs"; // Contratos
import * as JSONQL_A from "./jsonql.review.mjs"; // Avaliações
import * as JSONQL_P from "./jsonql.portfolio.mjs"; // Portfólios
import { generateRandomNumber, ensureInteger } from "./tools.mjs";

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 */

export async function getExemplos() {
    if (globalThis._exemplos) return globalThis._exemplos;

    try {
        console.log("chamado de novo");
        // URL assume que você esta na página src/dev.html
        const response = await fetch("data/json/_exemplos.json");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        globalThis._exemplos = json;
        return json;
    } catch (error) {
        console.error(error.message);
    }

    return null;
}

/**
 * Cria N portfólios
 * @param {number} quantidade
 */
export async function criarNPortfolios(quantidade) {
    const quantidade_int = ensureInteger(quantidade);
    if (typeof quantidade_int !== "number" || quantidade_int <= 0)
        throw new Error("Criação de serviços: A quantidade informada é inválida!");

    // TODO: Make a single call
    if (!exemplos) {
        const json = await getExemplos();
        var exemplos = json.exemplos;
    }

    let portfolios = [];

    for (let index = 0; index < quantidade_int; index++) {
        function createSecao(ordem) {
            let ordem_int = ensureInteger(ordem);
            let secao = {
                ordem: ordem_int,
                // TODO: Verificar dinamicamente as categorias possíveis
                categoriaId: generateRandomNumber(3),
                // TODO: Verificar dinamicamente os nomes de acordo com a categoria
                nome: "Seção de Informações",
            };

            // TODO: Criar dinamicamente
            // categorias_secao.json
            switch (secao.categoriaId) {
                // 0: Imagens
                case 0:
                    // TODO: Adicionar imagens reais
                    secao.contents = [];
                    for (let j = 0; j < generateRandomNumber(10, 5); j++) {
                        let linke = `https://picsum.photos/seed/${generateRandomNumber(200)}/200`;
                        secao.contents.push({
                            blob: linke, // portfolios.secao.contents.blob - string
                            descricao: "Foto", // portfolios.secao.contents.descricao - string
                        });
                    }
                    secao.nome = "Imagens";
                    secao.descricao = "Imagens de serviços realizados";
                    break;
                // 1: Avaliações
                case 1:
                    // Faz nada: Essa categoria deve ser controlada pela pagina que mostra as informações
                    secao.nome = "Avaliações";
                    secao.descricao = "Cliente satisfeitos!";
                    break;
                // 2: Links Externos
                case 2:
                    secao.contents = [];
                    for (let j = 0; j < generateRandomNumber(6, 3); j++) {
                        let linke =
                            exemplos.links_externos[
                                generateRandomNumber(exemplos.links_externos.length)
                            ];
                        secao.contents.push({
                            blob: linke, // portfolios.secao.contents.blob - string
                            descricao: "Link Externo", // portfolios.secao.contents.descricao - string
                        });
                        secao.nome = "Redes Sociais";
                        secao.descricao = "Segue lá!";
                    }
                    break;
                default:
                    console.log("createNPortfolios: categoria informada não encontrada!");
                    return null;
                    break;
            }

            return secao;
        }

        const usuarios = JSONQL_U.readUsuarios();
        if (!usuarios?.length) {
            console.log("createNContratos: Não há usuários criados");
            return null;
        }

        // TODO: Avoid creating more than 1 portfolios per user
        let usuarioId = usuarios[generateRandomNumber(usuarios.length)].id; // number
        let secoes = [];

        // Gera entre 2 e 5 seções para cada portfolio
        for (let i = 0; i < generateRandomNumber(5, 2); i++) {
            secoes.push(createSecao(i));
        }

        const element = {
            usuarioId: usuarioId,
            secoes: secoes,
        };

        portfolios.push(element);
    }

    // TODO: Do it in chunks
    JSONQL_P.createPortfolio(portfolios);
}

/**
 * Cria N contratos
 * @param {number} quantidade
 */
export async function criarNContratos(quantidade) {
    const quantidade_int = ensureInteger(quantidade);
    if (typeof quantidade_int !== "number" || quantidade_int <= 0)
        throw new Error("Criação de contratos: A quantidade informada é inválida!");

    // TODO: Make a single call
    if (!exemplos) {
        const json = await getExemplos();
        var exemplos = json.exemplos;
    }

    let contratos = [];

    for (let index = 0; index < quantidade_int; index++) {
        // TODO: Otimizar query de serviços
        const usuarios = JSONQL_U.readUsuarios();
        if (!usuarios?.length) 
            throw new Error("Criação de contratos: É necessário que haja usuários cadastrados para criar contratos.");

        const servicos = JSONQL_S.readServicos();
        if (!servicos?.length) 
            throw new Error("Criação de contratos: É necessário que haja serviços cadastrados para criar contratos.");

        let servicoId = servicos[generateRandomNumber(servicos.length)].id; // number
        // TODO: Evitar que contratadoId === contratanteId
        let contratadoId = usuarios[generateRandomNumber(usuarios.length)].id; // number
        let contratanteId = usuarios[generateRandomNumber(usuarios.length)].id; // number
        let data =
            generateRandomNumber(28) + "/" + generateRandomNumber(12) + "/" + generateRandomNumber(2006, 1970);
        let valor = generateRandomNumber(5000, 100); // number

        const element = {
            servicoId: servicoId, // number
            contratadoId: contratadoId, // number
            contratanteId: contratanteId, // number
            data: data, // string
            valor: valor, // number
        };

        contratos.push(element);
    }

    // TODO: Do it in chunks
    JSONQL_C.createContrato(contratos)
}

/**
 * Cria N avaliações
 * @param {number} quantidade
 */
export async function criarNAvaliacoes(quantidade) {
    const quantidade_int = ensureInteger(quantidade);
    if (typeof quantidade_int !== "number" || quantidade_int <= 0)
        throw new Error("Criação de contratos: A quantidade informada é inválida!");

    // TODO: Make a single call
    if (!exemplos) {
        const json = await getExemplos();
        var exemplos = json.exemplos;
    }

    let avaliacoes = [];

    for (let index = 0; index < quantidade_int; index++) {
        // TODO: Otimizar query de serviços
        const usuarios = JSONQL_U.readUsuarios();
        if (!usuarios?.length) 
            throw new Error("Criação de avaliações: É necessário que haja usuários cadastrados para criar avaliações.");

        const contratos = JSONQL_C.readContratos();
        if (!contratos?.length) 
            throw new Error("Criação de avaliações: É necessário que haja contratos cadastrados para criar avaliações.");

        // TODO: Evitar que contratadoId === contratanteId
        let contratoId = contratos[generateRandomNumber(contratos.length)].id; // number
        let contratanteId = usuarios[generateRandomNumber(usuarios.length)].id; // number
        let nota = generateRandomNumber(11); // number
        let comentario = exemplos.avaliacoes[generateRandomNumber(exemplos.avaliacoes.length)]; // string

        const element = {
            contratoId: contratoId, // number
            contratanteId: contratanteId, // number
            nota: nota, // number
            comentario: comentario, // string
        };

        avaliacoes.push(element);
    }

    // TODO: Do it in chunks
    JSONQL_A.createAvaliacao(avaliacoes)
}

/**
 * Cria N usuários
 * @param {number} quantidade
 */
export async function criarNUsuarios(quantidade) {
    const quantidade_int = ensureInteger(quantidade);
    if (typeof quantidade_int !== "number" || quantidade_int <= 0)
        throw new Error("Criação de usuários: A quantidade informada é inválida!");

    // TODO: Make a single call
    if (!exemplos) {
        const json = await getExemplos();
        var exemplos = json.exemplos;
    }

    let usuarios = [];

    for (let index = 0; index < quantidade_int; index++) {
        let ativo = true;
        let nome = exemplos.nomes[generateRandomNumber(exemplos.nomes.length)];
        nome += " " + exemplos.sobrenomes[generateRandomNumber(exemplos.sobrenomes.length)];
        let foto = `https://picsum.photos/seed/${generateRandomNumber(200)}/200`;
        let data_nascimento =
            generateRandomNumber(28) +
            "/" +
            generateRandomNumber(12) +
            "/" +
            generateRandomNumber(2026, 1970);
        let email = exemplos.email[generateRandomNumber(exemplos.email.length)]; // string
        let senha = generateRandomNumber(999999, 100000).toString(); // string
        let tipo = exemplos.tipo[generateRandomNumber(exemplos.tipo.length)]; // string
        let cpf_cnpj = exemplos.cpf_cnpj[generateRandomNumber(exemplos.cpf_cnpj.length)]; // string
        let cidade = exemplos.cidades[generateRandomNumber(exemplos.cidades.length)]; // string
        let biografia = exemplos.biografia[generateRandomNumber(exemplos.biografia.length)]; // string
        let contatos = [
            // Array
            exemplos.contatos[generateRandomNumber(exemplos.contatos.length)],
            exemplos.contatos[generateRandomNumber(exemplos.contatos.length)],
        ];

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
            contatos: contatos, // Array
        };

        usuarios.push(element);
    }

    // TODO: Do it in chunks
    JSONQL_U.createUsuario(usuarios);
}

/**
 * Cria N serviços
 * @param {number} quantidade
 */
export async function criarNServicos(quantidade) {
    const quantidade_int = ensureInteger(quantidade);
    if (typeof quantidade_int !== "number" || quantidade_int <= 0)
        throw new Error("Criação de serviços: A quantidade informada é inválida!");

    // TODO: Make a single call
    if (!exemplos) {
        const json = await getExemplos();
        var exemplos = json.exemplos;
    }

    let servicos = [];

    for (let index = 0; index < quantidade_int; index++) {
        let titulo =
            exemplos.categorias_servicos[generateRandomNumber(exemplos.categorias_servicos.length)];
        // TODO: categorias_servicos -> array, use id only
        let categoriaId = generateRandomNumber(exemplos.categorias_servicos.length);
        let categoria =
            exemplos.categorias_servicos[generateRandomNumber(exemplos.categorias_servicos.length)];
        let contato = exemplos.contatos[generateRandomNumber(exemplos.contatos.length)];
        let descricao = exemplos.descricoes[generateRandomNumber(exemplos.descricoes.length)];

        const element = {
            titulo: titulo,
            categoriaId: categoriaId,
            categoria: categoria,
            contato: contato,
            descricao: descricao,
        };

        servicos.push(element);
    }

    // TODO: Do it in chunks
    JSONQL_S.createServicos(servicos)
}
