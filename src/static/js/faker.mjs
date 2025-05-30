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

var exemplos_json = null;

export async function getFakeData() {
    if (exemplos_json) return exemplos_json;

    try {
        // URL assume que você esta na página src/dev.html
        const response = await fetch("data/json/_exemplos.json");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        exemplos_json = json;
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
        throw new Error("Criação de portfólios: A quantidade informada é inválida!");

    await getFakeData().then((json) => {
        const exemplos = json.exemplos;

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
                        const quant_imagens = generateRandomNumber(10, 5) || 5;
                        for (let j = 0; j < quant_imagens; j++) {
                            secao.contents.push({
                                blob: `https://picsum.photos/seed/${
                                    generateRandomNumber(200) || "lucremais"
                                }/200`, // portfolios.secao.contents.blob - string
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
                        const quant_links = generateRandomNumber(6, 3) || 3;
                        for (let j = 0; j < quant_links; j++) {
                            const link_ext_index = generateRandomNumber(
                                exemplos.links_externos.length
                            );

                            if (!link_ext_index) continue;
                            secao.contents.push({
                                blob: exemplos.links_externos[link_ext_index], // portfolios.secao.contents.blob - string
                                descricao: "Link Externo", // portfolios.secao.contents.descricao - string
                            });
                            secao.nome = "Redes Sociais";
                            secao.descricao = "Segue lá!";
                        }
                        break;
                    default:
                        console.log("createNPortfolios: categoria informada não encontrada!");
                        return null;
                }

                return secao;
            }

            const usuarios = JSONQL_U.readUsuarios();

            if (!usuarios || !usuarios.length)
                throw new Error(
                    "Criação de portfólios: É necessário que haja usuários cadastrados para criar portfólios."
                );

            const userId_index = generateRandomNumber(usuarios.length);
            if (!userId_index) continue;

            // TODO: Avoid creating more than 1 portfolios per user
            let secoes = [];

            // Gera entre 2 e 5 seções para cada portfolio
            const quant_secoes = generateRandomNumber(5, 2) || 2;
            for (let i = 0; i < quant_secoes; i++) secoes.push(createSecao(i));

            portfolios.push({
                usuarioId: usuarios[userId_index].id, // number
                secoes: secoes,
            });
        }

        // TODO: Do it in chunks
        portfolios.forEach((element) => JSONQL_P.createPortfolio(element));
    });
}

// TODO: Otimizar query de serviços
/**
 * Cria N contratos
 * @param {number} quantidade
 */
export async function criarNContratos(quantidade) {
    const quantidade_int = ensureInteger(quantidade);
    if (typeof quantidade_int !== "number" || quantidade_int <= 0)
        throw new Error("Criação de contratos: A quantidade informada é inválida!");

    let contratos = [];

    for (let index = 0; index < quantidade_int; index++) {
        const usuarios = JSONQL_U.readUsuarios();
        if (!usuarios || !usuarios.length)
            throw new Error(
                "Criação de contratos: É necessário que haja usuários cadastrados para criar contratos."
            );

        const servicos = JSONQL_S.readServicos();
        if (!servicos || !servicos.length)
            throw new Error(
                "Criação de contratos: É necessário que haja serviços cadastrados para criar contratos."
            );

        const servicoId_index = generateRandomNumber(servicos.length);
        const contratadoId_index = generateRandomNumber(usuarios.length);
        const contratanteId_index = generateRandomNumber(usuarios.length);

        const data_dia = generateRandomNumber(28, 1);
        const data_mes = generateRandomNumber(12, 1);
        const data_ano = generateRandomNumber(2026, 1970);

        if (
            typeof servicoId_index !== "number" ||
            typeof contratadoId_index !== "number" ||
            typeof contratanteId_index !== "number" ||
            typeof data_dia !== "number" ||
            typeof data_mes !== "number" ||
            typeof data_ano !== "number"
        ) {
            console.log("criarNContratos: null check");
            continue;
        }

        contratos.push({
            servicoId: servicos[servicoId_index].id, // number
            contratadoId: usuarios[contratadoId_index].id, // number
            contratanteId: usuarios[contratanteId_index].id, // number
            data: `${data_dia}/${data_mes}/${data_ano}`, // string
            valor: generateRandomNumber(5000, 1518) || 1518, // number
        });
    }

    // TODO: Do it in chunks
    contratos.forEach((element) => JSONQL_C.createContrato(element));
}

// TODO: Otimizar query de serviços
/**
 * Cria N avaliações
 * @param {number} quantidade
 */
export async function criarNAvaliacoes(quantidade) {
    const quantidade_int = ensureInteger(quantidade);
    if (typeof quantidade_int !== "number" || quantidade_int <= 0)
        throw new Error("Criação de avaliações: A quantidade informada é inválida!");

    await getFakeData().then((json) => {
        const exemplos = json.exemplos;

        let avaliacoes = [];

        for (let index = 0; index < quantidade_int; index++) {
            const usuarios = JSONQL_U.readUsuarios();
            if (!usuarios || !usuarios.length)
                throw new Error(
                    "Criação de avaliações: É necessário que haja usuários cadastrados para criar avaliações."
                );

            const contratos = JSONQL_C.readContratos();
            if (!contratos || !contratos.length)
                throw new Error(
                    "Criação de avaliações: É necessário que haja contratos cadastrados para criar avaliações."
                );

            const contratoId_index = generateRandomNumber(contratos.length);
            const contratanteId_index = generateRandomNumber(usuarios.length);
            const comentario_index = generateRandomNumber(exemplos.avaliacoes.length);

            if (
                typeof contratoId_index !== "number" ||
                typeof contratanteId_index !== "number" ||
                typeof comentario_index !== "number"
            ) {
                console.log("criarNAvaliacoes: null check");
                continue;
            }

            // TODO: Evitar que contratadoId === contratanteId
            avaliacoes.push({
                contratoId: contratos[contratoId_index].id, // number
                contratanteId: usuarios[contratanteId_index].id, // number
                nota: generateRandomNumber(11) || 0, // number
                comentario: exemplos.avaliacoes[comentario_index], // string
            });
        }

        // TODO: Do it in chunks
        avaliacoes.forEach((element) => JSONQL_A.createAvaliacao(element));
    });
}

/**
 * Cria N usuários
 * @param {number} quantidade
 */
export async function criarNUsuarios(quantidade) {
    const quantidade_int = ensureInteger(quantidade);
    if (typeof quantidade_int !== "number" || quantidade_int <= 0)
        throw new Error("Criação de usuários: A quantidade informada é inválida!");

    await getFakeData().then((json) => {
        const exemplos = json.exemplos;

        let usuarios = [];

        for (let index = 0; index < quantidade_int; index++) {
            const nome_index = generateRandomNumber(exemplos.nomes.length);
            const sobrenomes_index = generateRandomNumber(exemplos.sobrenomes.length);
            const foto_seed = generateRandomNumber(200);
            const email_index = generateRandomNumber(exemplos.email.length);
            const tipo_index = generateRandomNumber(exemplos.tipo.length);
            const cpf_cnpj_index = generateRandomNumber(exemplos.cpf_cnpj.length);
            const cidade_index = generateRandomNumber(exemplos.cidades.length);
            const biografia_index = generateRandomNumber(exemplos.biografia.length);
            const contato_1_index = generateRandomNumber(exemplos.contatos.length);
            const contato_2_index = generateRandomNumber(exemplos.contatos.length);

            const data_nascimento_dia = generateRandomNumber(28, 1);
            const data_nascimento_mes = generateRandomNumber(12, 1);
            const data_nascimento_ano = generateRandomNumber(2006, 1970);

            if (
                typeof nome_index !== "number" ||
                typeof sobrenomes_index !== "number" ||
                typeof foto_seed !== "number" ||
                typeof email_index !== "number" ||
                typeof tipo_index !== "number" ||
                typeof cpf_cnpj_index !== "number" ||
                typeof cidade_index !== "number" ||
                typeof biografia_index !== "number" ||
                typeof contato_1_index !== "number" ||
                typeof contato_2_index !== "number" ||
                typeof data_nascimento_dia !== "number" ||
                typeof data_nascimento_mes !== "number" ||
                typeof data_nascimento_ano !== "number"
            ) {
                console.log("criarNUsuarios: null check");
                continue;
            }

            usuarios.push({
                ativo: true, // bool
                nome: `${exemplos.nomes[nome_index]} ${exemplos.sobrenomes[sobrenomes_index]}`, // string
                foto: `https://picsum.photos/seed/${foto_seed}/200`, // string
                data_nascimento: `${data_nascimento_dia}/${data_nascimento_mes}/${data_nascimento_ano}`, // string
                email: exemplos.email[email_index], // string
                senha: (generateRandomNumber(999999, 100000) || 123456).toString(), // string
                tipo: exemplos.tipo[tipo_index], // string
                cpf_cnpj: exemplos.cpf_cnpj[cpf_cnpj_index], // string
                cidade: exemplos.cidades[cidade_index], // string
                biografia: exemplos.biografia[biografia_index], // string
                contatos: [exemplos.contatos[contato_1_index], exemplos.contatos[contato_2_index]], // Array
            });
        }

        // TODO: Do it in chunks
        usuarios.forEach((element) => JSONQL_U.createUsuario(element));
    });
}

/**
 * Cria N serviços
 * @param {number} quantidade
 */
export async function criarNServicos(quantidade) {
    const quantidade_int = ensureInteger(quantidade);
    if (typeof quantidade_int !== "number" || quantidade_int <= 0)
        throw new Error("Criação de serviços: A quantidade informada é inválida!");

    await getFakeData().then((json) => {
        const exemplos = json.exemplos;

        let servicos = [];

        for (let index = 0; index < quantidade_int; index++) {
            const categorias_servicos_index = generateRandomNumber(
                exemplos.categorias_servicos.length
            );
            const contato_index = generateRandomNumber(exemplos.contatos.length);
            const descricao_index = generateRandomNumber(exemplos.descricoes.length);

            if (
                typeof categorias_servicos_index !== "number" ||
                typeof contato_index !== "number" ||
                typeof descricao_index !== "number"
            ) {
                console.log("criarNServicos: null check");
                continue;
            }

            const element = {
                titulo: exemplos.categorias_servicos[categorias_servicos_index],
                // TODO: categorias_servicos -> array, use id only
                categoriaId: categorias_servicos_index,
                categoria: exemplos.categorias_servicos[categorias_servicos_index],
                contato: exemplos.contatos[contato_index],
                descricao: exemplos.descricoes[descricao_index],
            };

            servicos.push(element);
        }

        // TODO: Do it in chunks
        servicos.forEach((element) => JSONQL_S.createServicos(element));
    });
}
