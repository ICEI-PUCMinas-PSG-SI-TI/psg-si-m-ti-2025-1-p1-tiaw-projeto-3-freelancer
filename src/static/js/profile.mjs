//@ts-check

import { Usuarios } from "./jsonf/usuarios.mjs"; // Usuários

const crud_usuarios = new Usuarios();

const htmlDivModalProfile = document.getElementById("profile-modal");
const htmlButtonShowPerfil = document.getElementById("profile-show-perfil");

const mock2_isUserLoggedIn = () => !!localStorage.getItem("LucreM.id");

function mostrarModalProfile() {
    htmlDivModalProfile?.classList.remove("d-none");
}

function esconderModalProfile() {
    htmlDivModalProfile?.classList.add("d-none");
}

function inicializarProfile() {
    const userId = localStorage.getItem("LucreM.id");
    if (!userId) return;

    const userInfo = crud_usuarios.lerUsuario(userId);

    const htmlImageProfileBig = document.getElementById("profile-picture-big");
    const htmlImageProfile = document.getElementById("profile-picture-tiny");
    const htmlParProfile = document.getElementById("profile-name");
    const htmlLogout = document.getElementById("profile-logout");

    if (
        !(htmlDivModalProfile instanceof HTMLDivElement) ||
        !(htmlImageProfileBig instanceof HTMLImageElement) ||
        !(htmlImageProfile instanceof HTMLImageElement) ||
        !(htmlParProfile instanceof HTMLParagraphElement) ||
        !(htmlLogout instanceof HTMLButtonElement)
    )
        return;

    // TODO: Limpar apenas keys necessárias
    htmlParProfile.innerText = localStorage.getItem("LucreM.nome") || "Usuário";
    htmlImageProfile.addEventListener("click", mostrarModalProfile);
    htmlLogout.addEventListener("click", () => {
        localStorage.clear();
        location.reload();
    });
    htmlDivModalProfile.addEventListener("click", esconderModalProfile);
    htmlImageProfile.classList.remove("d-none");
    htmlButtonShowPerfil?.addEventListener("click", () => {
        location.assign("/perfil");
    });

    userInfo.then((response) => {
        htmlImageProfileBig.src = response.foto;
        htmlImageProfile.src = response.foto;
    })
}

inicializarProfile();
