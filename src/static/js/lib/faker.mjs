//@ts-check

import { generateRandomNumber as genRandNumber } from "../tools.mjs";

import { assertBoolean, assertPositiveInt } from "../lib/validate.mjs";

import { Usuarios } from "../jsonf/usuarios.mjs";
import { Servicos } from "../jsonf/servicos.mjs";
import { Contratos } from "../jsonf/contratos.mjs";
import { Avaliacoes } from "../jsonf/avaliacoes.mjs";
import { Portfolios } from "../jsonf/portfolios.mjs";

const crudUsuarios = new Usuarios();
const crudServicos = new Servicos();
const crudContratos = new Contratos();
const crudAvaliacoes = new Avaliacoes();
const crudPortfolios = new Portfolios();

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
    categoriasServicos = [];
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
    linksExternos = [];
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
            const usuarios = await crudUsuarios.lerUsuarios();
            if (!usuarios?.length)
                throw new Error(
                    "Criação de portfólios: É necessário que haja usuários cadastrados para criar portfólios.",
                );

            const userIdIndex = genRandNumber({ max: usuarios.length });

            // TODO: Avoid creating more than 1 portfolios per user
            let secoes = [];

            // Gera entre 2 e 5 seções para cada portfolio
            const quantSecoes = genRandNumber({ min: 2, max: 6 });

            for (let i = 0; i < quantSecoes; i++) {
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
                            const quantImagens = genRandNumber({ min: 5, max: 11 });
                            for (let j = 0; j < quantImagens; j++) {
                                secao.contents.push({
                                    // portfolios.secao.contents.blob - string
                                    blob: `https://picsum.photos/seed/${genRandNumber({
                                        max: 200,
                                    })}/200`,
                                    // portfolios.secao.contents.descricao - string
                                    descricao: "Foto",
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
                            const quantLinks = genRandNumber({ min: 3, max: 7 });
                            for (let j = 0; j < quantLinks; j++) {
                                const linkIndex = genRandNumber({
                                    max: json.linksExternos.length,
                                });

                                secao.contents.push({
                                    // portfolios.secao.contents.blob - string
                                    blob: json.linksExternos[linkIndex],
                                    // portfolios.secao.contents.descricao - string
                                    descricao: "Link Externo",
                                });
                            }
                        }
                        break;
                }

                secoes.push(secao);
            }

            portfolios.push({
                // number
                usuarioId: usuarios[userIdIndex].id,
                secoes: secoes,
            });
        }

        // TODO: Verificar os pós/contras de inserir os valoroes diretamente
        // na base de dados sem necessidade de um vetor
        portfolios.forEach((portfolio) => crudPortfolios.criarPortfolio(portfolio));
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
        const usuarios = await crudUsuarios.lerUsuarios();
        if (!usuarios?.length)
            throw new Error(
                "Criação de contratos: É necessário que haja usuários cadastrados para criar contratos.",
            );

        const servicos = await crudServicos.lerServicos();
        if (!servicos?.length)
            throw new Error(
                "Criação de contratos: É necessário que haja serviços cadastrados para criar contratos.",
            );

        const servicoIdIndex = genRandNumber({ max: servicos.length });
        const usuarioIdIndex = genRandNumber({ max: usuarios.length });

        const dataDia = genRandNumber({ min: 1, max: 29 });
        const dataMes = genRandNumber({ min: 1, max: 13 });
        const dataAno = genRandNumber({ min: 1970, max: 2026 });

        contratos.push({
            // number
            servicoId: servicos[servicoIdIndex].id,
            // number
            usuarioid: usuarios[usuarioIdIndex].id,
            // string
            data: `${dataDia}/${dataMes}/${dataAno}`,
            // number
            valor: genRandNumber({ min: 1518, max: 8000 }),
            // number
            status: genRandNumber({ max: 3 }),
        });
    }

    // TODO: Verificar os pós/contras de inserir os valoroes diretamentev
    // na base de dados sem necessidade de um vetor
    contratos.forEach((contrato) => crudContratos.criarContrato(contrato));
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
            const usuarios = await crudUsuarios.lerUsuarios();
            if (!usuarios?.length)
                throw new Error(
                    "Criação de avaliações: É necessário que haja usuários cadastrados para criar avaliações.",
                );

            const contratos = await crudContratos.lerContratos();
            if (!contratos?.length)
                throw new Error(
                    "Criação de avaliações: É necessário que haja contratos cadastrados para criar avaliações.",
                );

            const contratoIdIndex = genRandNumber({ max: contratos.length });
            const contratanteIdIndex = genRandNumber({ max: usuarios.length });
            const comentarioIndex = genRandNumber({ max: json.avaliacoes.length });

            // TODO: Evitar que contratadoId === contratanteId
            avaliacoes.push({
                // number
                contratoId: contratos[contratoIdIndex].id,
                // number
                contratanteId: usuarios[contratanteIdIndex].id,
                // number
                nota: genRandNumber({ max: 11 }),
                // string
                comentario: json.avaliacoes[comentarioIndex],
            });
        }

        // TODO: Verificar os pós/contras de inserir os valoroes diretamente
        // na base de dados sem necessidade de um vetor
        avaliacoes.forEach((avaliacao) => crudAvaliacoes.criarAvaliacao(avaliacao));
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

            // TODO: pendente alguns parametros
            usuarios.push({
                // ativo(bool)
                ativo: true,
                // nome(string)
                nome: `${json.nomes[nomeIndex]} ${json.sobrenomes[sobrenomesIndex]}`,
                // foto(string)
                foto: `https://picsum.photos/seed/${fotoSeed}/200`,
                // dataNascimento(string)
                dataNascimento: `${dataNascimentoDia}/${dataNascimentoMes}/${dataNascimentoAno}`,
                // email(string)
                email: json.email[emailIndex],
                // senha(string)
                senha: genRandNumber({ min: 100000, max: 1000000 }).toString(),
                // tipo(string)
                tipo: json.tipo[tipoIndex],
                // cpfCnpj(string)
                cpfCnpj: json.cpfCnpj[cpfCnpjIndex],
                // cidade(string)
                cidade: json.cidades[cidadeIndex],
                // biografia(string)
                biografia: json.biografia[biografiaIndex],
                // contatos(Array)
                contatos: [json.contatos[contato1Index], json.contatos[contato2Index]],
                // fake(boolean)
                fake: true,
            });
        }

        // TODO: Verificar os pós/contras de inserir os valoroes diretamente
        // na base de dados sem necessidade de um vetor
        usuarios.forEach((usuario) => crudUsuarios.criarUsuario(usuario));
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

        let usuarios = await crudUsuarios.lerUsuarios();
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
                max: json.categoriasServicos.length,
            });
            const contatoIndex = genRandNumber({ max: json.contatos.length });
            const descricaoIndex = genRandNumber({ max: json.descricoes.length });

            servicos.push({
                usuarioId: usuarios[genRandNumber({ max: usuarios.length })].id,
                titulo: json.categoriasServicos[categoriasServicosIndex],
                // TODO: categoriasServicos -> array, use id only
                categoriaId: categoriasServicosIndex,
                categoria: json.categoriasServicos[categoriasServicosIndex],
                contato: json.contatos[contatoIndex],
                descricao: json.descricoes[descricaoIndex],
                imagem: `https://picsum.photos/seed/${genRandNumber({ max: 100 })}/200`,
                fake: true,
            });
        }

        // TODO: Verificar os pós/contras de inserir os valoroes diretamente
        // na base de dados sem necessidade de um vetor
        servicos.forEach((servico) => crudServicos.criarServico(servico));
    });
}
