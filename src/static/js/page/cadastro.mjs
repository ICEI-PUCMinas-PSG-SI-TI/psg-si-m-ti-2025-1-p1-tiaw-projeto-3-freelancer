//@ts-check

import { Usuarios } from "../jsonf/usuarios.mjs";

const maxAllowedSizeCad = 5 * 1024 * 1024; // 5 MB in bytes

const crud_usuarios = new Usuarios();

// TODO: Move to module
/**
 * @param {Blob} file
 */
async function fileToBase64(file) {
    const reader = new FileReader();

    if (file.size > maxAllowedSizeCad)
        throw new Error("O tamanho do arquivo deve ser menor que 5MB!");

    if (!/image.*/.exec(file.type)) throw new Error("O arquivo não é uma imagem!");

    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const htmlCadastroInputNome = document.getElementById("nome");
const htmlCadastroInputEmail = document.getElementById("email");
const htmlCadastroInputSenha = document.getElementById("senha");
const htmlCadastroSelectTipo = document.getElementById("tipo");
const htmlCadastroInputCpfCnpj = document.getElementById("cpf");
const htmlCadastroInputContato = document.getElementById("contato");
const htmlCadastroInputDataNascimento = document.getElementById("data-nascimento");
const htmlCadastroInputCidade = document.getElementById("cidade");
const htmlCadastroTextAreaBiografia = document.getElementById("biografia");
const htmlCadastroInputFoto = document.getElementById("foto");
const htmlCadastroImgPreview = document.getElementById("preview");
const htmlCadastroSelectProfissao = document.getElementById("profissao");
const htmlCadastroSelectSexo = document.getElementById("sexo");
const htmlCadastroInputEscolaridade = document.getElementById("escolaridade");

let username = "";

const htmlCadastroForm = document.getElementById("formCadastro");

// TODO: Verificar ou resetar credenciais
function idUsuarioCorrente() {
    const id = localStorage.getItem("LucreM.id");
    if (!id) throw new Error("ID não identificada");
    return id;
}

async function atualizarCadastro() {
    if (
        !(htmlCadastroInputNome instanceof HTMLInputElement) ||
        !(htmlCadastroInputEmail instanceof HTMLInputElement) ||
        !(htmlCadastroInputSenha instanceof HTMLInputElement) ||
        !(htmlCadastroSelectTipo instanceof HTMLSelectElement) ||
        !(htmlCadastroInputCpfCnpj instanceof HTMLInputElement) ||
        !(htmlCadastroInputContato instanceof HTMLInputElement) ||
        !(htmlCadastroInputDataNascimento instanceof HTMLInputElement) ||
        !(htmlCadastroInputCidade instanceof HTMLInputElement) ||
        !(htmlCadastroTextAreaBiografia instanceof HTMLTextAreaElement) ||
        !(htmlCadastroInputFoto instanceof HTMLInputElement) ||
        !(htmlCadastroImgPreview instanceof HTMLImageElement) ||
        !(htmlCadastroSelectProfissao instanceof HTMLSelectElement) ||
        !(htmlCadastroSelectSexo instanceof HTMLSelectElement) ||
        !(htmlCadastroInputEscolaridade instanceof HTMLInputElement)
    )
        throw new Error("Null checking");

    // TODO: Validar campos
    const nome = htmlCadastroInputNome.value;
    const email = htmlCadastroInputEmail.value;
    const senha = htmlCadastroInputSenha.value;
    const tipo = htmlCadastroSelectTipo.value;
    const cpfCnpj = htmlCadastroInputCpfCnpj.value.replace(/\D/g, "");
    const contato = htmlCadastroInputContato.value.replace(/\D/g, "");
    const dataNascimento = htmlCadastroInputDataNascimento.value;
    const cidade = htmlCadastroInputCidade.value;
    const biografia = htmlCadastroTextAreaBiografia.value;
    const fotoInput_files = htmlCadastroInputFoto.files;
    const profissao = htmlCadastroSelectProfissao.value;
    const sexo = htmlCadastroSelectSexo.value;
    const escolaridade = htmlCadastroInputEscolaridade.value;

    // Tornar foto opcional
    if (!fotoInput_files?.length) {
        alert("Por favor, selecione uma foto.");
        return;
    }

    // TODO: Clear input if image is invalid
    fileToBase64(fotoInput_files[0])
        .then((result) => {
            crud_usuarios
                .atualizarUsuario({
                    id: idUsuarioCorrente(),
                    ativo: true,
                    foto: result,
                    nome,
                    username,
                    dataNascimento: new Date(dataNascimento).toISOString(),
                    email,
                    senha,
                    contatos: [contato],
                    tipo,
                    cpfCnpj,
                    cidade,
                    biografia,
                    profissao,
                    sexo,
                    escolaridade,
                })
                .then(() => alert("Informações atualizadas com sucesso!"));
        })
        .catch((error) => alert(error));
}

async function preencherValores() {
    if (
        !(htmlCadastroInputNome instanceof HTMLInputElement) ||
        !(htmlCadastroInputEmail instanceof HTMLInputElement) ||
        !(htmlCadastroInputSenha instanceof HTMLInputElement) ||
        !(htmlCadastroSelectTipo instanceof HTMLSelectElement) ||
        !(htmlCadastroInputCpfCnpj instanceof HTMLInputElement) ||
        !(htmlCadastroInputContato instanceof HTMLInputElement) ||
        !(htmlCadastroInputDataNascimento instanceof HTMLInputElement) ||
        !(htmlCadastroInputCidade instanceof HTMLInputElement) ||
        !(htmlCadastroTextAreaBiografia instanceof HTMLTextAreaElement) ||
        !(htmlCadastroInputFoto instanceof HTMLInputElement) ||
        !(htmlCadastroImgPreview instanceof HTMLImageElement) ||
        !(htmlCadastroSelectProfissao instanceof HTMLSelectElement) ||
        !(htmlCadastroSelectSexo instanceof HTMLSelectElement) ||
        !(htmlCadastroInputEscolaridade instanceof HTMLInputElement)
    )
        throw new Error("Null checking");

    const usuario = await crud_usuarios.lerUsuario(idUsuarioCorrente());
    if (usuario.nome) htmlCadastroInputNome.value = usuario.nome;
    if (usuario.email) htmlCadastroInputEmail.value = usuario.email;
    if (usuario.senha) htmlCadastroInputSenha.value = usuario.senha;
    if (usuario.cpfCnpj) htmlCadastroInputCpfCnpj.value = usuario.cpfCnpj;
    if (usuario.cidade) htmlCadastroInputCidade.value = usuario.cidade;
    if (usuario.biografia) htmlCadastroTextAreaBiografia.value = usuario.biografia;
    if (usuario.escolaridade) htmlCadastroInputEscolaridade.value = usuario.escolaridade;

    if (usuario.contatos?.length) htmlCadastroInputContato.value = usuario.contatos[0];

    if (usuario.profissao) htmlCadastroSelectProfissao.value = usuario.profissao;
    if (usuario.tipo) htmlCadastroSelectTipo.value = usuario.tipo;
    if (usuario.sexo) htmlCadastroSelectSexo.value = usuario.sexo;

    if (usuario.dataNascimento)
        htmlCadastroInputDataNascimento.value = new Date(usuario.dataNascimento)
            .toISOString()
            .slice(0, 10);
    if (usuario.foto) htmlCadastroImgPreview.src = usuario.foto;
    if (usuario.username) username = usuario.username;
}

function inicializarCadastro() {
    if (!(htmlCadastroForm instanceof HTMLFormElement)) return;
    htmlCadastroForm.addEventListener("submit", (event) => {
        event.preventDefault();
        atualizarCadastro();
    });

    preencherValores();

    htmlCadastroInputFoto?.addEventListener("change", async () => {
        if (
            !(htmlCadastroInputFoto instanceof HTMLInputElement) ||
            !(htmlCadastroImgPreview instanceof HTMLImageElement)
        )
            return;

        if (!htmlCadastroInputFoto.files?.length) return;
        fileToBase64(htmlCadastroInputFoto.files[0]).then((result) => {
            htmlCadastroImgPreview.src = result;
        });
    });
}

inicializarCadastro();
