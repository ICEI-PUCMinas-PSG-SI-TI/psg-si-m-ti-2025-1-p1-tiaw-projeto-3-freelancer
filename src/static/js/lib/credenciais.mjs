// @ts-check

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

export function retornarIdSeLogado() {
    const userId = localStorage.getItem(buildKey("id"));
    if (userId) return userId;

    alert("Informações de usuário não encontradas, realizando logout!");
    realizarLogout();
    return "";
}

export function retornaNomeSeLogado() {
    const userNome = localStorage.getItem(buildKey("nome"));
    if (userNome) return userNome;

    alert("Informações de usuário não encontradas, realizando logout!");
    realizarLogout();
    return "";
}
