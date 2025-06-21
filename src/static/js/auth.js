// @ts-check

const htmlInputLoginUsername = document.getElementById("input-login-username");
const htmlInputLoginPassword = document.getElementById("input-login-password");

const htmlFormLogin = document.getElementById("form-login");
const htmlFormSignup = document.getElementById("form-signup");

const htmlDivSignupModal = document.getElementById("modal");

const htmlInputShowPassword = document.getElementById("input-login-show-password");

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

function ValidarLogin(elementLogin) {
    try {
        const username = elementLogin.value;
        if (username.length < 1) throw new Error(`O campo login não pode estar vazio.`);
        clearError(elementLogin);
        return true;
    } catch (err) {
        showError(elementLogin, err.message);
    }
    return false;
}

function ValidarUsername(elementUsername) {
    try {
        const username = elementUsername.value;
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

function redirecionarParaCadastroPerfil() {
    window.location.assign("/cadastro");
}

const LUCRE_KEY = "LucreM";

// Função para alterar keys, isso garante que nenhuma aplicativo rodando e/ou
// salvando dados no localStorage/localStorage interfica nessa aplicação.
function lucreKey(key) {
    return `${LUCRE_KEY}.${key}`;
}

function saveCredentials(obj) {
    Object.keys(obj).forEach((k) => localStorage.setItem(lucreKey(k), obj[k]));
}

async function realizarLogin() {
    console.log("object");
    if (!ValidarLogin(htmlInputLoginUsername) || !ValidarSenha(htmlInputLoginPassword)) return;

    if (
        !(htmlInputLoginUsername instanceof HTMLInputElement) ||
        !(htmlInputLoginPassword instanceof HTMLInputElement)
    )
        return;

    const _login = htmlInputLoginUsername.value;
    const _password = htmlInputLoginPassword.value;

    let _users = await getAllUsers();
    if (!checkLoginPasswordInJson(_users, _login, _password)) {
        showError(htmlInputLoginUsername, "Cadastro não encontrado, verifique usuário e senha!");
        return;
    }

    const credenciais = _users.filter(
        (_user) => (_user.email === _login || _user.username === _password) && _user.senha
    )[0];

    if (!credenciais) {
        // TODO: Validar se credenciais possuem as informações necessarias
        showError(htmlInputLoginUsername, "Erro ao verificar cadastro, tente novamente!");
        if (htmlFormLogin instanceof HTMLFormElement) htmlFormLogin.reset();
        return;
    }

    saveCredentials(credenciais);

    if (credenciais.formularioConcluido === true) {
        redirecionarParaHomepage();
    } else {
        redirecionarParaCadastroPerfil();
    }
}

// INFO: Não otimizado, se algum usuario não tiver a tag informada na query(?),
// o json-server irá retornar todos os valores
async function getAllUsers() {
    return fetch("/usuarios").then((response) => response.json());
}

// INFO: Não otimizado, se algum usuario não tiver a tag informada na query(?),
// o json-server irá retornar todos os valores
async function getUsersByEmail(email) {
    return fetch(`/usuarios?email=${email}`).then((response) => response.json());
}

// INFO: Não otimizado, se algum usuario não tiver a tag informada na query(?),
// o json-server irá retornar todos os valores
async function getUsersByUsername(username) {
    return fetch(`/usuarios?username=${username}`).then((response) => response.json());
}

function checkLoginPasswordInJson(jsonArray, login, password) {
    if (!Array.isArray(jsonArray)) throw new Error("Input inválida");
    if (typeof login !== "string") throw new Error("Input inválida");
    if (typeof password !== "string") throw new Error("Input inválida");
    if (jsonArray.length === 0) return false;
    for (const usuario of jsonArray) {
        if (
            (typeof usuario.email !== "string" && typeof usuario.username !== "string") ||
            typeof usuario.username !== "string"
        )
            continue;
        if ((usuario.email === login || usuario.username === login) && usuario.senha === password)
            return true;
    }
    return false;
}

function checkEmailInJson(jsonArray, email) {
    if (!Array.isArray(jsonArray)) throw new Error("Input inválida");
    if (typeof email !== "string") throw new Error("Input inválida");
    if (jsonArray.length === 0) return false;
    for (const usuario of jsonArray) {
        if (typeof usuario.email !== "string") continue;
        if (usuario.email === email) return true;
    }
    return false;
}

function checkUsernameInJson(jsonArray, username) {
    if (!Array.isArray(jsonArray)) throw new Error("Input inválida");
    if (typeof username !== "string") throw new Error("Input inválida");
    if (jsonArray.length === 0) return false;
    for (const usuario of jsonArray) {
        if (typeof usuario.username !== "string") continue;
        if (usuario.username === username) return true;
    }
}

async function saveUsuario(usuario) {
    // TODO: Validar se objeto contem as informações necessárias para um usuario
    return fetch("/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
    });
}

async function realizarCadastro() {
    if (
        !ValidarUsername(htmlInputSignupUsername) ||
        !ValidarNome(htmlInputSignupNome) ||
        !ValidarEmail(htmlInputSignupEmail) ||
        !ValidarSenha(htmlInputSignupSenha) ||
        !ValidarSenha2(htmlInputSignupSenha, htmlInputSignupSenha2)
    )
        return;

    if (
        !(htmlInputSignupEmail instanceof HTMLInputElement) ||
        !(htmlInputSignupUsername instanceof HTMLInputElement)
    )
        return;

    // 1. Verificar se login já existe

    // INFO: Não otimizado, se algum usuario não tiver a tag informada em ?,
    // o json-server irá retornar todos os valores
    const _email = htmlInputSignupEmail.value;
    const existByEmail = await getUsersByEmail(_email);

    if (checkEmailInJson(existByEmail, _email)) {
        showError(htmlInputSignupEmail, "Email já cadastrado! Utilize outro e-mail");
        return;
    }

    const _username = htmlInputSignupUsername.value;
    const existByUsername = await getUsersByUsername(_username);

    if (checkUsernameInJson(existByUsername, _username)) {
        showError(htmlInputSignupUsername, "Username já cadastrado! Utilize outro e-mail");
        return;
    }

    // 2. Criar usuário
    if (
        !(htmlInputSignupNome instanceof HTMLInputElement) ||
        !(htmlInputSignupSenha instanceof HTMLInputElement)
    )
        return;

    const _nome = htmlInputSignupNome.value;
    const _senha = htmlInputSignupSenha.value;

    await saveUsuario({
        // TODO: Criar id?
        nome: _nome,
        senha: _senha,
        username: _username,
        email: _email,
        // Indica que informações como foto, profissão ou outras informações não foram cadastradas
        formularioConcluido: false,
    });

    // 3. Informar se cadastro foi realizado com sucesso
    alert("Cadastro realizado com sucesso!\nProssiga para realizar o login!");

    // 4. Reseta a form e redireciona para o login
    if (htmlFormSignup instanceof HTMLFormElement) htmlFormSignup.reset();
    esconderModalCadastro();
}

function inicializarCampos() {
    if (
        !(htmlButtonRealizarCadastro instanceof HTMLElement) ||
        !(htmlButtonCancelarCadastro instanceof HTMLElement) ||
        !(htmlFormLogin instanceof HTMLFormElement) ||
        !(htmlFormSignup instanceof HTMLFormElement)
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
    htmlFormLogin.addEventListener("keypress", (key) => {
        if (key.key === "Enter") key.preventDefault();
    });
    htmlFormSignup.addEventListener("submit", (event) => {
        event.preventDefault();
        realizarCadastro();
    });
    htmlFormSignup.addEventListener("keypress", (key) => {
        if (key.key === "Enter") key.preventDefault();
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

    if (!(htmlInputShowPassword instanceof HTMLInputElement)) return;
    htmlInputShowPassword.addEventListener("change", () => {
        if (!(htmlInputLoginPassword instanceof HTMLInputElement)) return;
        if (htmlInputShowPassword.checked) {
            htmlInputLoginPassword.type = "text";
        } else {
            htmlInputLoginPassword.type = "password";
        }
    });
}

inicializarCampos();
