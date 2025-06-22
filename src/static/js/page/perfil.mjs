//@ts-check

import { Usuarios } from "../jsonf/usuarios.mjs";

const crud_usuarios = new Usuarios();

const htmlBackgroundImage = document.querySelector("div.body-section.body-content");
// TODO: Use username for background photos
const id = false || "lucremais";
if (htmlBackgroundImage instanceof HTMLDivElement) {
    htmlBackgroundImage.style.backgroundImage = `url(https://picsum.photos/seed/${id}/1080)`;
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

async function inicializarPerfil() {
    const _usuarios = await crud_usuarios.lerUsuario(localStorage.getItem("LucreM.id") || "");

    const nota = "4.4";
    const avaliacoes = "152";

    if (
        !htmlProfileImgPicture ||
        !htmlProfileH2ProfileName ||
        !htmlProfileParagTitle ||
        !htmlProfileParagCidade ||
        !htmlProfileLinkContato ||
        !htmlProfileLinkEmail ||
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
    if (_usuarios.contato) {
        htmlProfileLinkContato.classList.remove("d-none");
        htmlProfileLinkContato.innerText = _usuarios.contato;
        const _strip_contato = _usuarios.contato.replace(/[^0-9+]/gm, "");
        htmlProfileLinkContato.href = `tel:${_strip_contato}`;
    }
    htmlProfileLinkEmail.innerText = _usuarios.email;
    htmlProfileLinkEmail.href = `mailto:${_usuarios.email}`;

    htmlProfileParagNota.innerText = nota;
    htmlProfileParagAval.innerText = avaliacoes;

    // if(localStorage.id === id)
    htmlProfileButtonEditPerfil?.classList.remove("d-none")
    htmlProfileButtonEditPerfil?.addEventListener("click", () => location.assign("/cadastro"));
}

inicializarPerfil();
