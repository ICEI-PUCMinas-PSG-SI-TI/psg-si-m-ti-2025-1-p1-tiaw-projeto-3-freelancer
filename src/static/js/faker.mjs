//@ts-check

import * as JSONQL_C from "./jsonql.contract.mjs"; // Contratos
import * as JSONQL_A from "./jsonql.review.mjs"; // Avaliações
import * as JSONQL_P from "./jsonql.portfolio.mjs"; // Portfólios

import {
    generateRandomNumberOld as generateRandomNumber,
    generateRandomNumber as genRandNumber,
    ensureInteger,
    assertPositiveInt,
} from "./tools.mjs";

import { Usuarios } from "./jsonf/usuarios.mjs"; // Usuários
import { Servicos } from "./jsonf/servicos.mjs"; // Serviços

const crud_usuarios = new Usuarios();
const crud_servicos = new Servicos();

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 */

// eslint-disable-next-line no-unused-vars
class Exemplos {
    /** @type {any[]} */
    avaliacoes = [];
    /** @type {any[]} */
    biografia = [];
    /** @type {any[]} */
    categorias_servicos = [];
    /** @type {any[]} */
    cidades = [];
    /** @type {any[]} */
    contatos = [];
    /** @type {any[]} */
    cpf_cnpj = [];
    /** @type {any[]} */
    descricoes = [];
    /** @type {any[]} */
    email = [];
    /** @type {any[]} */
    links_externos = [];
    /** @type {any[]} */
    nomes = [];
    /** @type {any[]} */
    sobrenomes = [];
    /** @type {any[]} */
    tipo = [];
}

class ExemploFetcher {
    json = null;

    /**
     *
     * @returns {Promise<Exemplos|null>}
     */
    async getFakeData() {
        if (this.json) return this.json;

        const response = await fetch("/exemplos");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        this.json = await response.json();
        return this.json;
    }
}

const exemplos = new ExemploFetcher();

/**
 * Cria N portfólios
 * @param {number} quantidade
 */
export async function criarNPortfolios(quantidade) {
    assertPositiveInt(quantidade);

    await exemplos.getFakeData().then(async (json) => {
        if (!json) return;

        let portfolios = [];

        for (let index = 0; index < quantidade; index++) {
            crud_usuarios.lerUsuarios();
            // OPTIMIZE: Ler os usuários anteriormente e escolher um número aleatorio
            const usuarios = await crud_usuarios.lerUsuarios();

            if (!usuarios?.length)
                throw new Error(
                    "Criação de portfólios: É necessário que haja usuários cadastrados para criar portfólios.",
                );

            const userId_index = generateRandomNumber(usuarios.length);
            if (!userId_index) continue;

            // TODO: Avoid creating more than 1 portfolios per user
            let secoes = [];

            // Gera entre 2 e 5 seções para cada portfolio
            const quant_secoes = generateRandomNumber(5, 2) || 2;

            for (let ordem = 0; ordem < quant_secoes; ordem++) {
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
                        {
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
                        }
                        break;
                    // 1: Avaliações
                    case 1: {
                        // Faz nada: Essa categoria deve ser controlada pela pagina que mostra as informações
                        secao.nome = "Avaliações";
                        secao.descricao = "Cliente satisfeitos!";
                        break;
                    }
                    // 2: Links Externos
                    case 2:
                        {
                            secao.contents = [];
                            const quant_links = generateRandomNumber(6, 3) || 3;
                            for (let j = 0; j < quant_links; j++) {
                                const link_ext_index = generateRandomNumber(
                                    json.links_externos.length,
                                );

                                if (!link_ext_index) continue;
                                secao.contents.push({
                                    blob: json.links_externos[link_ext_index], // portfolios.secao.contents.blob - string
                                    descricao: "Link Externo", // portfolios.secao.contents.descricao - string
                                });
                                secao.nome = "Redes Sociais";
                                secao.descricao = "Segue lá!";
                            }
                        }
                        break;
                    default:
                        console.log("createNPortfolios: categoria informada não encontrada!");
                        break;
                }

                secoes.push(secao);
            }

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
    assertPositiveInt(quantidade);

    let contratos = [];

    for (let index = 0; index < quantidade; index++) {
        // OPTIMIZE: Ler os usuários anteriormente e escolher um número aleatorio
        const usuarios = await crud_usuarios.lerUsuarios();
        if (!usuarios?.length)
            throw new Error(
                "Criação de contratos: É necessário que haja usuários cadastrados para criar contratos.",
            );

        const servicos = await crud_servicos.lerServicos();
        if (!servicos?.length)
            throw new Error(
                "Criação de contratos: É necessário que haja serviços cadastrados para criar contratos.",
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
    assertPositiveInt(quantidade);

    await exemplos.getFakeData().then(async (json) => {
        if (!json) return;

        let avaliacoes = [];

        for (let index = 0; index < quantidade; index++) {
            // OPTIMIZE: Ler os usuários anteriormente e escolher um número aleatorio
            const usuarios = await crud_usuarios.lerUsuarios();
            if (!usuarios?.length)
                throw new Error(
                    "Criação de avaliações: É necessário que haja usuários cadastrados para criar avaliações.",
                );

            const contratos = JSONQL_C.readContratos();
            if (!contratos?.length)
                throw new Error(
                    "Criação de avaliações: É necessário que haja contratos cadastrados para criar avaliações.",
                );

            const contratoId_index = generateRandomNumber(contratos.length);
            const contratanteId_index = generateRandomNumber(usuarios.length);
            const comentario_index = generateRandomNumber(json.avaliacoes.length);

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
                comentario: json.avaliacoes[comentario_index], // string
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
    assertPositiveInt(quantidade);

    await exemplos.getFakeData().then((json) => {
        if (!json) return;

        let usuarios = [];

        for (let index = 0; index < quantidade; index++) {
            const nome_index = generateRandomNumber(json.nomes.length);
            const sobrenomes_index = generateRandomNumber(json.sobrenomes.length);
            const foto_seed = generateRandomNumber(200);
            const email_index = generateRandomNumber(json.email.length);
            const tipo_index = generateRandomNumber(json.tipo.length);
            const cpf_cnpj_index = generateRandomNumber(json.cpf_cnpj.length);
            const cidade_index = generateRandomNumber(json.cidades.length);
            const biografia_index = generateRandomNumber(json.biografia.length);
            const contato_1_index = generateRandomNumber(json.contatos.length);
            const contato_2_index = generateRandomNumber(json.contatos.length);

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

            // TODO: pendente alguns parametros
            usuarios.push({
                ativo: true, // ativo(bool)
                nome: `${json.nomes[nome_index]} ${json.sobrenomes[sobrenomes_index]}`, // nome(string)
                foto: `https://picsum.photos/seed/${foto_seed}/200`, // foto(string)
                data_nascimento: `${data_nascimento_dia}/${data_nascimento_mes}/${data_nascimento_ano}`, // data_nascimento(string)
                email: json.email[email_index], // email(string)
                senha: (generateRandomNumber(999999, 100000) || 123456).toString(), // senha(string)
                tipo: json.tipo[tipo_index], // tipo(string)
                cpf_cnpj: json.cpf_cnpj[cpf_cnpj_index], // cpf_cnpj(string)
                cidade: json.cidades[cidade_index], // cidade(string)
                biografia: json.biografia[biografia_index], // biografia(string)
                contatos: [json.contatos[contato_1_index], json.contatos[contato_2_index]], // contatos(Array)
                fake: true,
            });
        }

        // TODO: Do it in chunks
        usuarios.forEach(async (element) => await crud_usuarios.criarUsuario(element));
    });
}

/**
 * Cria N serviços
 * @param {number} quantidade
 * @param {boolean} onlyForFakeUsers
 */
export async function criarNServicos(quantidade, onlyForFakeUsers) {
    assertPositiveInt(quantidade);

    await exemplos.getFakeData().then(async (json) => {
        if (!json) return;

        let usuarios = await crud_usuarios.lerUsuarios();
        // TODO: Adicionar opção de selecionar usuario individual para gera
        // Seleciona apenas usuários que são fakes
        if (onlyForFakeUsers && usuarios?.length) {
            usuarios = usuarios.filter((_user) => _user.fake);
        }
        if (!usuarios?.length) {
            console.error("Nenhum usuário encontrado");
            return;
        }
        let servicos = [];

        for (let index = 0; index < quantidade; index++) {
            const categorias_servicos_index = generateRandomNumber(json.categorias_servicos.length);
            const contato_index = generateRandomNumber(json.contatos.length);
            const descricao_index = generateRandomNumber(json.descricoes.length);

            if (
                typeof categorias_servicos_index !== "number" ||
                typeof contato_index !== "number" ||
                typeof descricao_index !== "number"
            ) {
                console.log("criarNServicos: null check");
                continue;
            }

            servicos.push({
                usuarioId: usuarios[genRandNumber({ min: 0, max: usuarios.length })].id,
                titulo: json.categorias_servicos[categorias_servicos_index],
                // TODO: categorias_servicos -> array, use id only
                categoriaId: categorias_servicos_index,
                categoria: json.categorias_servicos[categorias_servicos_index],
                contato: json.contatos[contato_index],
                descricao: json.descricoes[descricao_index],
                imagem: `https://picsum.photos/seed/${genRandNumber({ min: 0, max: 100 })}/200`,
                fake: true,
            });
        }

        // TODO: Do it in chunks
        servicos.forEach((element) => crud_servicos.criarServico(element));
    });
}
