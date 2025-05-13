//@ts-check
import * as JSONQL from "./jsonql.mjs";
import * as JSONQL_U from "./jsonql.user.mjs";

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 *
 */

/**
 * Retorna um número aleatório entre 0 e max, o min é opcional
 */
function genRandomNumber(max, min) {
    if (min) {
        return parseInt(Math.random() * (max - min) + min);
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
 * Cria N usuários 
 */
async function createNUsers(number) {
    // TODO: Does this work? Does this validate something?
    if (!number)
        number = 10;

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
        let contatos = [
            exemplos.contatos[genRandomNumber(exemplos.contatos.length)],
            exemplos.contatos[genRandomNumber(exemplos.contatos.length)]
        ] // Array

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
    if (!number)
        number = 10;

    // TODO: Make a single call
    if(!exemplos){
        const json = await getExemplos();
        var exemplos = json.exemplos
    }

    let usuarios = [];

    for (let index = 0; index < number; index++) {

        let titulo = exemplos.categorias_servicos[genRandomNumber(exemplos.categorias_servicos.length)]
        // TODO: categorias_servicos
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
    let dev_create_avaliacoes_n = document.getElementById('dev-create-avaliacoes-n');
    let dev_create_avaliacoes = document.getElementById('dev-create-avaliacoes');
    let dev_delete_avaliacoes_all = document.getElementById('dev-delete-avaliacoes-all');
    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let dev_delete_avaliacoes_id = document.getElementById('dev-delete-avaliacoes-id');
    let dev_delete_avaliacoes = document.getElementById('dev-delete-avaliacoes');
    let dev_read_avaliacoes = document.getElementById('dev-read-avaliacoes');

    // Usuários

    dev_create_usuarios?.addEventListener('click', async () => {
        let quantidade = dev_create_usuarios_n?.value;
        let usuarios = await createNUsers(quantidade);
        usuarios.forEach((value) => JSONQL_U.createUsuario(value));
    })

    dev_delete_usuarios_all?.addEventListener('click', JSONQL_U.clearUsuarios)

    dev_delete_usuarios?.addEventListener('click', () => {
        const id = dev_delete_usuarios_id?.value;
        if (!id) {
            console.log("dev_delete_usuarios: id é null");
            return
        }

        const id_int = parseInt(id);

        if (typeof (id_int) != "number") {
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
        let servicos = await createNServicos(quantidade);
        servicos.forEach((value) => JSONQL.createServicos(value));
    })

    dev_delete_servicos_all?.addEventListener('click', JSONQL.clearServicos)

    dev_delete_servicos?.addEventListener('click', () => {
        const id = dev_delete_servicos_id?.value;
        if (!id) {
            console.log("dev_delete_servicos: id é null");
            return
        }

        const id_int = parseInt(id);

        if (typeof (id_int) != "number") {
            console.log("dev_delete_servicos: Não foi possível realizar o parse do id");
            return
        }

        if (JSONQL.deleteServicos(id_int)) {
            console.log(`dev_delete_servicos: serviço ${id_int} foi deletado!`);
        } else {
            console.log(`dev_delete_servicos: Não foi possível encontrar o serviço ou ocorreu um erro.`);
        }
    })

    dev_read_servicos?.addEventListener('click', () => console.log(JSONQL.readServicos()))

    // Avaliações

    // TODO: *

}

setupDevTools();