//@ts-check

import { generateRandomNumber as genRandNumber } from "../tools.mjs";

import { assertBoolean, assertPositiveInt } from "../lib/validate.mjs";

import { Usuarios } from "../jsonf/usuarios.mjs";
import { Servicos } from "../jsonf/servicos.mjs";
import { Contratos } from "../jsonf/contratos.mjs";
import { Avaliacoes } from "../jsonf/avaliacoes.mjs";
import { Portfolios } from "../jsonf/portfolios.mjs";
// eslint-disable-next-line no-unused-vars
import { TemplatesObject, Templates } from "../jsonf/templates.mjs";

const crudUsuarios = new Usuarios();
const crudServicos = new Servicos();
const crudContratos = new Contratos();
const crudAvaliacoes = new Avaliacoes();
const crudPortfolios = new Portfolios();
const crudTemplates = new Templates();

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 */

class TemplatesFetcher {
    /** @type {TemplatesObject|null} */
    json = null;

    /**
     * @returns {Promise<TemplatesObject|null>}
     */
    async getFakeData() {
        if (this.json) return this.json;
        this.json = await crudTemplates.lerTemplates();
        return this.json;
    }
}

const templates = new TemplatesFetcher();

/**
 * Cria N portfólios
 * @param {number} quantidade
 */
export async function criarNPortfolios(quantidade) {
    assertPositiveInt(quantidade);

    const json = await templates.getFakeData();
    if (!json) return;

    // OPTIMIZE: Ler os usuários anteriormente e escolher um número aleatorio
    const usuarios = await crudUsuarios.lerUsuarios();
    if (!usuarios?.length)
        throw new Error(
            "Criação de portfólios: É necessário que haja usuários cadastrados para criar portfólios.",
        );

    for (let i = 0; i < quantidade; i++) {
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

        // TODO: Verificar os pós/contras de inserir os valoroes diretamente
        // na base de dados sem necessidade de um vetor
        crudPortfolios.criarPortfolio({
            // number
            nome: `Portfólio do ${usuarios[userIdIndex].nome}`,
            usuarioId: usuarios[userIdIndex].id,
            secoes: secoes,
            fake: true,
        });
    }
}

// TODO: Otimizar query de serviços
/**
 * Cria N contratos
 * @param {number} quantidade
 */
export async function criarNContratos(quantidade) {
    assertPositiveInt(quantidade);

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

    for (let i = 0; i < quantidade; i++) {
        const servicoIdIndex = genRandNumber({ max: servicos.length });
        const usuarioIdIndex = genRandNumber({ max: usuarios.length });

        const dataDia = genRandNumber({ min: 1, max: 29 });
        const dataMes = genRandNumber({ min: 1, max: 13 });
        const dataAno = genRandNumber({ min: 1970, max: 2026 });

        // TODO: Verificar os pós/contras de inserir os valoroes diretamentev
        // na base de dados sem necessidade de um vetor
        crudContratos.criarContrato({
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
            fake: true,
        });
    }
}

// TODO: Otimizar query de serviços
/**
 * Cria N avaliações
 * @param {number} quantidade
 */
export async function criarNAvaliacoes(quantidade) {
    assertPositiveInt(quantidade);

    const json = await templates.getFakeData();
    if (!json) return;

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

    for (let i = 0; i < quantidade; i++) {
        const contratoIdIndex = genRandNumber({ max: contratos.length });
        const imagemSeed = genRandNumber({ max: contratos.length });
        const comentarioIndex = genRandNumber({ max: json.avaliacoes.length });
        const contratanteIdIndex = genRandNumber({ max: usuarios.length });

        // TODO: Verificar os pós/contras de inserir os valoroes diretamente
        // na base de dados sem necessidade de um vetor
        crudAvaliacoes.criarAvaliacao({
            // string|number
            servicoId: contratos[contratoIdIndex].servicoId,
            // string|number
            contratoId: contratos[contratoIdIndex].id,
            // string|number
            usuarioId: usuarios[contratanteIdIndex].id,
            // number
            nota: genRandNumber({ min: 2, max: 6 }),
            // string
            comentario: json.avaliacoes[comentarioIndex],
            // string
            imagem: `https://picsum.photos/seed/${imagemSeed}/200`,
            // string
            data: new Date().toISOString(),
            // boolean
            fake: true,
        });
    }
}

/**
 * Cria N usuários
 * @param {number} quantidade
 */
export async function criarNUsuarios(quantidade) {
    assertPositiveInt(quantidade);

    const json = await templates.getFakeData();
    if (!json) return;

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
        // TODO: Verificar os pós/contras de inserir os valoroes diretamente
        // na base de dados sem necessidade de um vetor
        crudUsuarios.criarUsuario({
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
}

/**
 * Cria N serviços
 * @param {number} quantidade
 * @param {boolean} onlyForFakeUsers
 */
export async function criarNServicos(quantidade, onlyForFakeUsers) {
    assertPositiveInt(quantidade);
    assertBoolean(onlyForFakeUsers);

    const json = await templates.getFakeData();
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

    for (let i = 0; i < quantidade; i++) {
        const categoriasServicosIndex = genRandNumber({
            max: json.categoriasServicos.length,
        });
        const contatoIndex = genRandNumber({ max: json.contatos.length });
        const descricaoIndex = genRandNumber({ max: json.descricoes.length });

        // TODO: Verificar os pós/contras de inserir os valoroes diretamente
        // na base de dados sem necessidade de um vetor
        crudServicos.criarServico({
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
}
