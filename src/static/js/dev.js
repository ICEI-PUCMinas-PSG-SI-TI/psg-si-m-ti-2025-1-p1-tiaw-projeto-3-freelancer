//@ts-check
import * as JSONQL from "./jsonql.mjs";
import * as JSONQL_U from "./jsonql.user.mjs";

/*
 * Esse script adiciona os recursos necessários para o funcionamento da página de dev-tools
 *
 */

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

    dev_create_usuarios?.addEventListener('click', () => {
        let quantidade = dev_create_usuarios_n?.value;
        const user = JSONQL_U.factoryUsuario(
            true,
            "Simas da Silva",
            "01/01/1970",
            "simarsilvaturbo@example.com",
            "123456",
            "admin", "123.456.789-10",
            "São Paulo, SP",
            "Empresário, trabalha com manutenção de automóveis.",
            [
                "(31) 97070-7070",
                "(31) 97070-7071"
            ]
        );
        JSONQL_U.createUsuario(user);
        // TODO: Criar {quantidade} usuários
    })

    dev_delete_usuarios_all?.addEventListener('click', () => {
        let id = dev_delete_usuarios_id?.value;
        // TODO: Deletar {id} usuários
    })

    dev_delete_usuarios?.addEventListener('click', () => {
        // TODO: Deletar {todos} usuários
    })

    dev_read_usuarios?.addEventListener('click', () => console.log(JSONQL_U.readUsuarios()))

    // Serviços

    dev_create_usuarios?.addEventListener('click', () => {})
    dev_delete_usuarios?.addEventListener('click', () => {})
    dev_delete_usuarios_all?.addEventListener('click', () => {})
    // dev_read_usuarios?.addEventListener('click', () => console.log(JSONQL.readUsuarios()))

    // Avaliações

    dev_create_usuarios?.addEventListener('click', () => {})
    dev_delete_usuarios?.addEventListener('click', () => {})
    dev_delete_usuarios_all?.addEventListener('click', () => {})
    // dev_read_usuarios?.addEventListener('click', () => console.log(JSONQL.readUsuarios()))

}

setupDevTools();