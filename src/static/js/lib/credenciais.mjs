// @ts-check

import { Usuarios } from "../jsonf/usuarios.mjs";

const crudUsuarios = new Usuarios();

const lucreMaisKey = "LucreM";

const buildKey = (key) => `${lucreMaisKey}.${key}`;

function apagarDados() {
    // does this remove and get objectkeys again?
    for (const item of Object.keys(localStorage).filter((key) => key.startsWith(lucreMaisKey))) {
        localStorage.removeItem(item);
    }
}

export function realizarLogout() {
    apagarDados();
    // recarregarCaminho()
    location.reload();
}

/**
 * @param {{naoInvalidar?: boolean}} opts
 * @returns {string} ID do usuário logado
 */
export function retornarIdSeLogado(opts = {}) {
    const userId = localStorage.getItem(buildKey("id"));
    if (userId) return userId;

    if (opts.naoInvalidar === true) return "";
    alert("Informações de usuário não encontradas, realizando logout!");
    realizarLogout();
    return "";
}

/**
 * @param {{naoInvalidar?: boolean}} opts
 * @returns {string} Nome do usuário logado
 */
export function retornaNomeSeLogado(opts = {}) {
    const userNome = localStorage.getItem(buildKey("nome"));
    if (userNome) return userNome;

    if (opts.naoInvalidar === true) return "";
    alert("Informações de usuário não encontradas, realizando logout!");
    realizarLogout();
    return "";
}

export async function retornarIdSeLoginValido() {
    const usuarioCorrente = retornarIdSeLogado();
    let usuarioRequest;
    try {
        usuarioRequest = await crudUsuarios.lerUsuario(usuarioCorrente);
    } catch (err) {
        alert(err.message);
        realizarLogout();
    }
    if (usuarioRequest && usuarioCorrente && usuarioRequest.id === usuarioCorrente)
        return usuarioCorrente;

    apagarDados();
    return "";
}
