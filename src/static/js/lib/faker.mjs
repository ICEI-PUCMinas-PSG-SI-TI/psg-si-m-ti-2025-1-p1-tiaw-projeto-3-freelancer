//@ts-check

import { generateRandomNumber as genRandNumber } from "../tools.mjs";

import { assertBoolean, assertPositiveInt } from "../lib/validate.mjs";

import { Usuarios } from "../jsonf/usuarios.mjs"; // Usuários
import { Servicos } from "../jsonf/servicos.mjs"; // Serviços
import { Contratos } from "../jsonf/contratos.mjs"; // Contratos
import { Avaliacoes } from "../jsonf/avaliacoes.mjs"; // Avaliações
import { Portfolios } from "../jsonf/portfolios.mjs"; // Portfólios

const crud_usuarios = new Usuarios();
const crud_servicos = new Servicos();
const crud_contratos = new Contratos();
const crud_avaliacoes = new Avaliacoes();
const crud_portfolios = new Portfolios();

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
    cpfCnpj = [];
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

        for (let i = 0; i < quantidade; i++) {
            // OPTIMIZE: Ler os usuários anteriormente e escolher um número aleatorio
            const usuarios = await crud_usuarios.lerUsuarios();

            if (!usuarios?.length)
                throw new Error(
                    "Criação de portfólios: É necessário que haja usuários cadastrados para criar portfólios.",
                );

            const userIdIndex = genRandNumber({ max: usuarios.length });

            // TODO: Avoid creating more than 1 portfolios per user
            let secoes = [];

            // Gera entre 2 e 5 seções para cada portfolio
            const quant_secoes = genRandNumber({ min: 2, max: 6 });

            for (let i = 0; i < quant_secoes; i++) {
                let secao = {
                    ordem: i,
                    // TODO: Verificar dinamicamente as categorias possíveis
                    categoriaId: genRandNumber({ max: 3 }),
                };

                // TODO: Criar dinamicamente via categorias_secao.json
                switch (secao.categoriaId) {
                    // 0: Imagens
                    case 0:
                        // TODO: Adicionar imagens reais
                        secao.contents = [];
                        secao.nome = "Imagens";
                        secao.descricao = "Imagens de serviços realizados";
                        {
                            const quant_imagens = genRandNumber({ min: 5, max: 11 });
                            for (let j = 0; j < quant_imagens; j++) {
                                secao.contents.push({
                                    blob: `https://picsum.photos/seed/${genRandNumber({
                                        max: 200,
                                    })}/200`, // portfolios.secao.contents.blob - string
                                    descricao: "Foto", // portfolios.secao.contents.descricao - string
                                });
                            }
                        }
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
                        secao.nome = "Redes Sociais";
                        secao.descricao = "Segue lá!";
                        {
                            const quant_links = genRandNumber({ min: 3, max: 7 });
                            for (let j = 0; j < quant_links; j++) {
                                const linkIndex = genRandNumber({
                                    max: json.links_externos.length,
                                });

                                secao.contents.push({
                                    blob: json.links_externos[linkIndex], // portfolios.secao.contents.blob - string
                                    descricao: "Link Externo", // portfolios.secao.contents.descricao - string
                                });
                            }
                        }
                        break;
                }

                secoes.push(secao);
            }

            portfolios.push({
                usuarioId: usuarios[userIdIndex].id, // number
                secoes: secoes,
            });
        }

        // TODO: Verificar os pós/contras de inserir os valoroes diretamente
        // na base de dados sem necessidade de um vetor
        portfolios.forEach((portfolio) => crud_portfolios.criarPortfolio(portfolio));
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

    for (let i = 0; i < quantidade; i++) {
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

        const servicoIdIndex = genRandNumber({ max: servicos.length });
        const usuarioIdIndex = genRandNumber({ max: usuarios.length });

        const dataDia = genRandNumber({ min: 1, max: 29 });
        const dataMes = genRandNumber({ min: 1, max: 13 });
        const dataAno = genRandNumber({ min: 1970, max: 2026 });

        if (
            typeof servicoIdIndex !== "number" ||
            typeof usuarioIdIndex !== "number" ||
            typeof dataDia !== "number" ||
            typeof dataMes !== "number" ||
            typeof dataAno !== "number"
        ) {
            console.log("criarNContratos: null check");
            continue;
        }

        contratos.push({
            servicoId: servicos[servicoIdIndex].id, // number
            usuarioid: usuarios[usuarioIdIndex].id, // number
            data: `${dataDia}/${dataMes}/${dataAno}`, // string
            valor: genRandNumber({ min: 1518, max: 8000 }), // number
            status: genRandNumber({ max: 3 }), // number
        });
    }

    // TODO: Verificar os pós/contras de inserir os valoroes diretamentev
    // na base de dados sem necessidade de um vetor
    contratos.forEach((contrato) => crud_contratos.criarContrato(contrato));
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

        for (let i = 0; i < quantidade; i++) {
            // OPTIMIZE: Ler os usuários anteriormente e escolher um número aleatorio
            const usuarios = await crud_usuarios.lerUsuarios();
            if (!usuarios?.length)
                throw new Error(
                    "Criação de avaliações: É necessário que haja usuários cadastrados para criar avaliações.",
                );

            const contratos = await crud_contratos.lerContratos();
            if (!contratos?.length)
                throw new Error(
                    "Criação de avaliações: É necessário que haja contratos cadastrados para criar avaliações.",
                );

            const contratoIdIndex = genRandNumber({ max: contratos.length });
            const contratanteIdIndex = genRandNumber({ max: usuarios.length });
            const comentarioIndex = genRandNumber({ max: json.avaliacoes.length });

            if (
                typeof contratoIdIndex !== "number" ||
                typeof contratanteIdIndex !== "number" ||
                typeof comentarioIndex !== "number"
            ) {
                console.log("criarNAvaliacoes: null check");
                continue;
            }

            // TODO: Evitar que contratadoId === contratanteId
            avaliacoes.push({
                contratoId: contratos[contratoIdIndex].id, // number
                contratanteId: usuarios[contratanteIdIndex].id, // number
                nota: genRandNumber({ max: 11 }), // number
                comentario: json.avaliacoes[comentarioIndex], // string
            });
        }

        // TODO: Verificar os pós/contras de inserir os valoroes diretamente
        // na base de dados sem necessidade de um vetor
        avaliacoes.forEach((avaliacao) => crud_avaliacoes.criarAvaliacao(avaliacao));
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

        for (let i = 0; i < quantidade; i++) {
            const nomeIndex = genRandNumber({ max: json.nomes.length });
            const sobrenomesIndex = genRandNumber({ max: json.sobrenomes.length });
            const fotoSeed = genRandNumber({ max: 200 });
            const emailIndex = genRandNumber({ max: json.email.length });
            const tipoIndex = genRandNumber({ max: json.tipo.length });
            const cpfCnpjIndex = genRandNumber({ max: json.cpfCnpj.length });
            const cidadeIndex = genRandNumber({ max: json.cidades.length });
            const biografiaIndex = genRandNumber({ max: json.biografia.length });
            const contato1Index = genRandNumber({ max: json.contatos.length });
            const contato2Index = genRandNumber({ max: json.contatos.length });

            const dataNascimentoDia = genRandNumber({ min: 1, max: 29 });
            const dataNascimentoMes = genRandNumber({ min: 1, max: 13 });
            const dataNascimentoAno = genRandNumber({ min: 1970, max: 2006 });

            if (
                typeof nomeIndex !== "number" ||
                typeof sobrenomesIndex !== "number" ||
                typeof fotoSeed !== "number" ||
                typeof emailIndex !== "number" ||
                typeof tipoIndex !== "number" ||
                typeof cpfCnpjIndex !== "number" ||
                typeof cidadeIndex !== "number" ||
                typeof biografiaIndex !== "number" ||
                typeof contato1Index !== "number" ||
                typeof contato2Index !== "number" ||
                typeof dataNascimentoDia !== "number" ||
                typeof dataNascimentoMes !== "number" ||
                typeof dataNascimentoAno !== "number"
            ) {
                console.log("criarNUsuarios: null check");
                continue;
            }

            // TODO: pendente alguns parametros
            usuarios.push({
                ativo: true, // ativo(bool)
                nome: `${json.nomes[nomeIndex]} ${json.sobrenomes[sobrenomesIndex]}`, // nome(string)
                foto: `https://picsum.photos/seed/${fotoSeed}/200`, // foto(string)
                dataNascimento: `${dataNascimentoDia}/${dataNascimentoMes}/${dataNascimentoAno}`, // dataNascimento(string)
                email: json.email[emailIndex], // email(string)
                senha: genRandNumber({ min: 100000, max: 1000000 }).toString(), // senha(string)
                tipo: json.tipo[tipoIndex], // tipo(string)
                cpfCnpj: json.cpfCnpj[cpfCnpjIndex], // cpfCnpj(string)
                cidade: json.cidades[cidadeIndex], // cidade(string)
                biografia: json.biografia[biografiaIndex], // biografia(string)
                contatos: [json.contatos[contato1Index], json.contatos[contato2Index]], // contatos(Array)
                fake: true,
            });
        }

        // TODO: Verificar os pós/contras de inserir os valoroes diretamente
        // na base de dados sem necessidade de um vetor
        usuarios.forEach((usuario) => crud_usuarios.criarUsuario(usuario));
    });
}

/**
 * Cria N serviços
 * @param {number} quantidade
 * @param {boolean} onlyForFakeUsers
 */
export async function criarNServicos(quantidade, onlyForFakeUsers) {
    assertPositiveInt(quantidade);
    assertBoolean(onlyForFakeUsers);

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

        for (let i = 0; i < quantidade; i++) {
            const categoriasServicosIndex = genRandNumber({
                max: json.categorias_servicos.length,
            });
            const contatoIndex = genRandNumber({ max: json.contatos.length });
            const descricaoIndex = genRandNumber({ max: json.descricoes.length });

            if (
                typeof categoriasServicosIndex !== "number" ||
                typeof contatoIndex !== "number" ||
                typeof descricaoIndex !== "number"
            ) {
                console.log("criarNServicos: null check");
                continue;
            }

            servicos.push({
                usuarioId: usuarios[genRandNumber({ max: usuarios.length })].id,
                titulo: json.categorias_servicos[categoriasServicosIndex],
                // TODO: categorias_servicos -> array, use id only
                categoriaId: categoriasServicosIndex,
                categoria: json.categorias_servicos[categoriasServicosIndex],
                contato: json.contatos[contatoIndex],
                descricao: json.descricoes[descricaoIndex],
                imagem: `https://picsum.photos/seed/${genRandNumber({ max: 100 })}/200`,
                fake: true,
            });
        }

        // TODO: Verificar os pós/contras de inserir os valoroes diretamente
        // na base de dados sem necessidade de um vetor
        servicos.forEach((servico) => crud_servicos.criarServico(servico));
    });
}
