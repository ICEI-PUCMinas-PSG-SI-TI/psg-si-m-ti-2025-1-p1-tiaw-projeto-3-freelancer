import { retornarIdSeLogado, retornarIdSeLoginValido } from "./credenciais.mjs";

// TODO: Verificar necessidade de validar /*.html
const PATH_INDEX = "/";
const PATH_HOMEPAGE = "/homepage";
const PATH_404 = "/404";
const PATH_AUTH = "/auth";

// Redireciona para um caminho especifico dentro do mesmo host
function redirectToPath(path) {
    if (typeof path !== "string") throw new Error("redirectToPath: Invalid path");

    const url = new URL(location.href);
    const newUrl = `${url.origin}${path}`;

    location.assign(newUrl);
}

function redirect() {
    const url = new URL(window.location.href);
    const urlPathname = url.pathname;

    // INFO: 3001 = Sinaliza que esta rodando como desenvolvimento e desabilita todos os redirecionamentos
    // if (url.port === "3001") return;
    if (urlPathname === PATH_404) return;
    if (retornarIdSeLogado({ naoInvalidar: true })) {
        if (urlPathname === PATH_INDEX || urlPathname === PATH_AUTH) redirectToPath(PATH_HOMEPAGE);
        else retornarIdSeLoginValido();
    } else if (urlPathname !== PATH_INDEX && urlPathname !== PATH_AUTH) {
        redirectToPath(PATH_INDEX);
    }
}

redirect();
