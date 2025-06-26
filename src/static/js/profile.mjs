//@ts-check

// Usuários
import { Usuarios } from "./jsonf/usuarios.mjs";
import { retornaNomeSeLogado, retornarIdSeLogado, realizarLogout } from "./lib/credenciais.mjs";

const crudUsuarios = new Usuarios();

const htmlDivModalProfile = document.getElementById("profile-modal");
const htmlButtonShowPerfil = document.getElementById("profile-show-perfil");

function inicializarProfile() {
    const userId = retornarIdSeLogado();
    if (!userId) return;

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

    htmlParProfile.innerText = retornaNomeSeLogado();
    htmlImageProfile.addEventListener("click", () =>
        // mostrarModalProfile()
        htmlDivModalProfile?.classList.remove("d-none"),
    );
    htmlLogout.addEventListener("click", realizarLogout);
    htmlDivModalProfile.addEventListener("click", () =>
        // esconderModalProfile()
        htmlDivModalProfile?.classList.add("d-none"),
    );
    htmlImageProfile.classList.remove("d-none");
    htmlButtonShowPerfil?.addEventListener("click", () => location.assign("/perfil"));

    crudUsuarios.lerUsuario(userId).then((response) => {
        if (response.foto) {
            htmlImageProfileBig.src = response.foto;
            htmlImageProfile.src = response.foto;
        }
    });
}

inicializarProfile();
