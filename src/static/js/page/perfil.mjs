//@ts-check

import { Usuarios } from "../jsonf/usuarios.mjs";
import { assertStringNonEmpty } from "../lib/validate.mjs";
import { retornarIdSeLogado } from "../lib/credenciais.mjs";

const crudUsuarios = new Usuarios();

const htmlBackgroundImage = document.querySelector("div.body-section.body-content");
const htmlProfileImgPicture = document.getElementById("profile-picture-perfil");
const htmlProfileH2ProfileName = document.getElementById("profile-name-perfil");
const htmlProfileParagTitle = document.getElementById("profile-title");
const htmlProfileParagCidade = document.getElementById("profile-location");
const htmlProfileLinkContato = document.getElementById("profile-contato");
const htmlProfileLinkEmail = document.getElementById("profile-email");
const htmlProfileParagNota = document.getElementById("profile-nota");
const htmlProfileParagAval = document.getElementById("profile-aval");
const htmlProfileParagBiografia = document.getElementById("profile-biografia");
const htmlProfileButtonEditPerfil = document.getElementById("button-edit-perfil");

async function inicializarPerfil(id, allowEdit) {
    assertStringNonEmpty(id);

    const _usuarios = await crudUsuarios.lerUsuario(id);
    if (!_usuarios) {
        alert("Não foi possível ler as informações desse usuário!");
        return;
    }

    const nota = "4.4";
    const avaliacoes = "152";

    if (
        !(htmlProfileImgPicture instanceof HTMLImageElement) ||
        !htmlProfileH2ProfileName ||
        !htmlProfileParagTitle ||
        !htmlProfileParagCidade ||
        !(htmlProfileLinkContato instanceof HTMLAnchorElement) ||
        !(htmlProfileLinkEmail instanceof HTMLAnchorElement) ||
        !htmlProfileParagNota ||
        !htmlProfileParagBiografia ||
        !htmlProfileParagAval
    ) {
        console.error("Some html elements are null!");
        return;
    }

    // TODO: Use username for background photos
    if (htmlBackgroundImage instanceof HTMLDivElement) {
        htmlBackgroundImage.style.backgroundImage = `url(https://picsum.photos/seed/${id}/1080)`;
    }

    htmlProfileImgPicture.src = _usuarios.foto || "static/img/placeholder_profile.png";
    htmlProfileH2ProfileName.innerText = _usuarios.nome || "Nome não registrado";
    htmlProfileParagTitle.innerText = _usuarios.profissao || "Profissão não informada";
    htmlProfileParagCidade.innerText = _usuarios.cidade || "Região não informada";
    if (_usuarios.biografia) {
        htmlProfileParagBiografia.parentElement?.classList.remove("d-none");
        htmlProfileParagBiografia.innerText = _usuarios.biografia;
    }
    if (_usuarios.contatos?.length && _usuarios.contatos[0]) {
        const _contato = _usuarios.contatos[0];
        htmlProfileLinkContato.classList.remove("d-none");
        htmlProfileLinkContato.innerText = _contato;
        const contatoParsed = _contato.replace(/[^0-9+]/gm, "");
        htmlProfileLinkContato.href = `tel:${contatoParsed}`;
    }
    if (_usuarios.email) {
        htmlProfileLinkEmail.innerText = _usuarios.email;
        htmlProfileLinkEmail.href = `mailto:${_usuarios.email}`;
    }

    htmlProfileParagNota.innerText = nota;
    htmlProfileParagAval.innerText = avaliacoes;

    if (allowEdit) {
        htmlProfileButtonEditPerfil?.classList.remove("d-none");
        htmlProfileButtonEditPerfil?.addEventListener("click", () => location.assign("/cadastro"));
    }
}

function carregarDadosDaUrl() {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    // Mostrar perfil do usuário
    if (id) {
        inicializarPerfil(id, false);
        return;
    }

    inicializarPerfil(retornarIdSeLogado(), true);
}

carregarDadosDaUrl();
