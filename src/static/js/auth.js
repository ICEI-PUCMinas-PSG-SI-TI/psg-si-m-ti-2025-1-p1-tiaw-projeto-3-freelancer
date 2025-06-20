// @ts-check

const htmlInputLoginUsername = document.getElementById("input-login-username");
const htmlInputLoginPassword = document.getElementById("input-login-password");

const htmlFormLogin = document.getElementById("form-login");
const htmlFormSignup = document.getElementById("form-signup");

const htmlDivSignupModal = document.getElementById("modal");

const htmlInputSignupUsername = document.getElementById("input-signup-username");
const htmlInputSignupNome = document.getElementById("input-signup-name");
const htmlInputSignupEmail = document.getElementById("input-signup-email");
const htmlInputSignupSenha = document.getElementById("input-signup-password");
const htmlInputSignupSenha2 = document.getElementById("input-signup-password-2");

const htmlButtonLogin = document.getElementById("button-login");
const htmlButtonRealizarCadastro = document.getElementById("button-realizar-cadastro");
const htmlButtonCancelarCadastro = document.getElementById("button-signup-cancelar");
const htmlButtonCadastrar = document.getElementById("button-signup-cadastro");

const MIN_PASSWORD_LENGHT = 8;
const MIN_USERNAME_LENGHT = 4;
const MIN_NOME_LENGHT = 4;

function mostrarModalCadastro() {
    if (htmlDivSignupModal instanceof HTMLElement) htmlDivSignupModal.classList.remove("d-none");
    const url = new URL(location.href);
    history.pushState(null, "", `${url.origin}${url.pathname}${url.search}#cadastro`);
}

function esconderModalCadastro() {
    if (htmlDivSignupModal instanceof HTMLElement) htmlDivSignupModal.classList.add("d-none");
    const url = new URL(location.href);
    history.pushState(null, "", `${url.origin}${url.pathname}${url.search}`);
}

function showError(htmlElement, error) {
    if (!(htmlElement instanceof HTMLElement)) return;
    if (typeof error !== "string") return;
    htmlElement.classList.add("border-danger");
    htmlElement.classList.remove("d-none");
    let htmlErrorElement = htmlElement.parentElement?.querySelector(
        "div .m-1.form-text.text-danger"
    );
    if (!(htmlErrorElement instanceof HTMLElement)) return;
    htmlErrorElement.classList.remove("d-none");
    htmlErrorElement.innerText = error;
}

function clearError(htmlElement) {
    if (!(htmlElement instanceof HTMLElement)) return;
    htmlElement.classList.remove("border-danger");
    let htmlErrorElement = htmlElement.parentElement?.querySelector(
        "div .m-1.form-text.text-danger"
    );
    if (!(htmlErrorElement instanceof HTMLElement)) return;
    htmlErrorElement.classList.add("d-none");
}

function ValidarUsername(elementUsername) {
    try {
        console.log(elementUsername);
        const username = elementUsername.value;
        console.log(username);
        if (username.length < MIN_USERNAME_LENGHT)
            throw new Error(`O nome deve conter no mínimo ${MIN_USERNAME_LENGHT} caracteres.`);
        clearError(elementUsername);
        return true;
    } catch (err) {
        showError(elementUsername, err.message);
    }
    return false;
}

function ValidarNome(elementNome) {
    try {
        const nome = elementNome.value;
        if (nome.length < MIN_NOME_LENGHT)
            throw new Error(`O nome deve conter no mínimo ${MIN_NOME_LENGHT} caracteres.`);
        clearError(elementNome);
        return true;
    } catch (err) {
        showError(elementNome, err.message);
    }
    return false;
}

function ValidarEmail(elementEmail) {
    try {
        const email = elementEmail.value;
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
            throw new Error("E-mail inválido!");
        clearError(elementEmail);
        return true;
    } catch (err) {
        showError(elementEmail, err.message);
    }
    return false;
}

function ValidarSenha(elementSenha) {
    try {
        const senha = elementSenha.value;
        if (senha.length < MIN_PASSWORD_LENGHT)
            throw new Error(`A senha deve ter no mínimo ${MIN_PASSWORD_LENGHT} caracteres!`);
        clearError(elementSenha);
        return true;
    } catch (err) {
        showError(elementSenha, err.message);
    }
    return false;
}

function ValidarSenha2(elementSenha, elementSenha2) {
    try {
        const senha = elementSenha.value;
        const confirmacao = elementSenha2.value;
        if (senha !== confirmacao) throw new Error("As senhas não conferem!");
        clearError(elementSenha2);
        return true;
    } catch (err) {
        showError(elementSenha2, err.message);
    }
    return false;
}

function redirecionarParaHomepage() {
    window.location.assign("/homepage");
}

const LUCRE_KEY = "LucreM";

// Função para alterar keys, isso garante que nenhuma aplicativo rodando e/ou
// salvando dados no localStorage/sessionStorage interfica nessa aplicação.
function lucreKey(key){
    return `${LUCRE_KEY}.${key}`
}

function saveCredentials(obj) {
    Object.keys(obj).forEach((k) => sessionStorage.setItem(lucreKey(k), obj[k]));
}

function realizarLogin() {}

function realizarCadastro() {
    if (
        !ValidarEmail(htmlInputSignupEmail) ||
        !ValidarUsername(htmlInputSignupUsername) ||
        !ValidarNome(htmlInputSignupNome) ||
        !ValidarSenha(htmlInputSignupSenha) ||
        !ValidarSenha2(htmlInputSignupSenha, htmlInputSignupSenha2)
    )
        return;

    // 1. Verificar se login já existe
    // @mock

    // 2. Criar usuário
    // @mock

    // 3. Informar se cadastro foi realizado com sucesso
    // @mock

    // 4. Reseta a form e redireciona para o login
    if (htmlFormSignup instanceof HTMLFormElement) htmlFormSignup.reset();
    esconderModalCadastro();
}

function inicializarCampos() {
    if (
        !(htmlButtonRealizarCadastro instanceof HTMLElement) ||
        !(htmlButtonCancelarCadastro instanceof HTMLElement) ||
        !(htmlFormLogin instanceof HTMLElement) ||
        !(htmlFormSignup instanceof HTMLElement)
    ) {
        console.error("Null html instace");
        return;
    }

    if (new URL(location.href).hash === "#cadastro") mostrarModalCadastro();

    htmlButtonRealizarCadastro.addEventListener("click", mostrarModalCadastro);
    htmlButtonCancelarCadastro.addEventListener("click", esconderModalCadastro);
    htmlFormLogin.addEventListener("submit", (event) => {
        event.preventDefault();
        realizarLogin();
    });
    // htmlButtonLogin.addEventListener("click", realizarLogin)
    htmlFormSignup.addEventListener("submit", (event) => {
        event.preventDefault();
        realizarCadastro();
    });
    // htmlButtonCadastrar.addEventListener("click", realizarCadastro)

    if (
        !(htmlInputSignupUsername instanceof HTMLElement) ||
        !(htmlInputSignupNome instanceof HTMLElement) ||
        !(htmlInputSignupEmail instanceof HTMLElement) ||
        !(htmlInputSignupSenha instanceof HTMLElement) ||
        !(htmlInputSignupSenha2 instanceof HTMLElement)
    ) {
        console.error("Null html instace");
        return;
    }

    let timeout_signin_username;
    let timeout_signin_nome;
    let timeout_signin_email;
    let timeout_signin_senha;
    let timeout_signin_senha_2;

    function updateTimeoutValidacaoUsername() {
        if (timeout_signin_username) clearTimeout(timeout_signin_username);
        timeout_signin_username = setTimeout(() => ValidarUsername(htmlInputSignupUsername), 1000);
    }

    function updateTimeoutValidacaoNome() {
        if (timeout_signin_nome) clearTimeout(timeout_signin_nome);
        timeout_signin_nome = setTimeout(() => ValidarNome(htmlInputSignupNome), 1000);
    }

    function updateTimeoutValidacaoEmail() {
        if (timeout_signin_email) clearTimeout(timeout_signin_email);
        timeout_signin_email = setTimeout(() => ValidarEmail(htmlInputSignupEmail), 1000);
    }

    function updateTimeoutValidacaoSenha() {
        if (timeout_signin_senha) clearTimeout(timeout_signin_senha);
        timeout_signin_senha = setTimeout(() => ValidarSenha(htmlInputSignupSenha), 1000);
    }

    function updateTimeoutValidacaoSenha2() {
        if (timeout_signin_senha_2) clearTimeout(timeout_signin_senha_2);
        timeout_signin_senha_2 = setTimeout(
            () => ValidarSenha2(htmlInputSignupSenha, htmlInputSignupSenha2),
            1000
        );
    }

    htmlInputSignupUsername.addEventListener("input", updateTimeoutValidacaoUsername);
    htmlInputSignupNome.addEventListener("input", updateTimeoutValidacaoNome);
    htmlInputSignupEmail.addEventListener("input", updateTimeoutValidacaoEmail);
    htmlInputSignupSenha.addEventListener("input", updateTimeoutValidacaoSenha);
    htmlInputSignupSenha2.addEventListener("input", updateTimeoutValidacaoSenha2);
}

inicializarCampos();
