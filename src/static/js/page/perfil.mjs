//@ts-check

import { Usuarios } from "../jsonf/usuarios.mjs";
import { assertStringNonEmpty } from "../validate.mjs";

const crud_usuarios = new Usuarios();

const htmlBackgroundImage = document.querySelector("div.body-section.body-content");

function getPerfilId() {
    return localStorage.getItem("LucreM.id") || "lucremais";
}

// TODO: Use username for background photos
if (htmlBackgroundImage instanceof HTMLDivElement) {
    htmlBackgroundImage.style.backgroundImage = `url(https://picsum.photos/seed/${getPerfilId() || "lucremais"}/1080)`;
}

const htmlProfileImgPicture = document.getElementById("profile-picture-perfil");
const htmlProfileH2ProfileName = document.getElementById("profile-name-perfil");
const htmlProfileParagTitle = document.getElementById("profile-title");
const htmlProfileParagCidade = document.getElementById("profile-location");
const htmlProfileLinkContato = document.getElementById("profile-contato");
const htmlProfileLinkEmail = document.getElementById("profile-email");
const htmlProfileParagNota = document.getElementById("profile-nota");
const htmlProfileParagAval = document.getElementById("profile-aval");
const htmlProfileButtonEditPerfil = document.getElementById("button-edit-perfil");

async function inicializarPerfil(id) {
    assertStringNonEmpty(id);

    const _usuarios = await crud_usuarios.lerUsuario(id);
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
        !htmlProfileParagAval
    ) {
        console.log("Null check2");
        return;
    }

    htmlProfileImgPicture.src = _usuarios.foto || "static/img/placeholder_profile.png";
    htmlProfileH2ProfileName.innerText = _usuarios.nome;
    htmlProfileParagTitle.innerText = _usuarios.profissao || "Profissão não informada";
    htmlProfileParagCidade.innerText = _usuarios.cidade || "Região não informada";
    if (_usuarios.contatos?.length) {
        const _contato = _usuarios.contatos[0].contato;
        htmlProfileLinkContato.classList.remove("d-none");
        htmlProfileLinkContato.innerText = _contato;
        const _strip_contato = _contato.replace(/[^0-9+]/gm, "");
        htmlProfileLinkContato.href = `tel:${_strip_contato}`;
    }
    htmlProfileLinkEmail.innerText = _usuarios.email;
    htmlProfileLinkEmail.href = `mailto:${_usuarios.email}`;

    htmlProfileParagNota.innerText = nota;
    htmlProfileParagAval.innerText = avaliacoes;

    // if(localStorage.id === id)
    htmlProfileButtonEditPerfil?.classList.remove("d-none");
    htmlProfileButtonEditPerfil?.addEventListener("click", () => location.assign("/cadastro"));
}

function carregarDadosDaUrl() {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    // Mostrar perfil do usuário
    if (id) {
        inicializarPerfil(id);
        return;
    }

    inicializarPerfil(getPerfilId());
}

carregarDadosDaUrl();
