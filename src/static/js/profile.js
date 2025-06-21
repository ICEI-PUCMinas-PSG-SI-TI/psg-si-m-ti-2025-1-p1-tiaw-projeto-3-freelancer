//@ts-check
const htmlDivModalProfile = document.getElementById("profile-modal");

const mock2_isUserLoggedIn = () => !!localStorage.getItem("LucreM.id");

function mostrarModalProfile() {
    htmlDivModalProfile?.classList.remove("d-none");
}

function esconderModalProfile() {
    htmlDivModalProfile?.classList.add("d-none");
}

function inicializarProfile() {
    if (!mock2_isUserLoggedIn()) return;

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
    const _img = localStorage.getItem("LucreM.imagem");
    if (_img) {
        htmlImageProfileBig.src = _img;
        htmlImageProfile.src = _img;
    }
    htmlImageProfile.addEventListener("click", mostrarModalProfile);
    htmlLogout.addEventListener("click", () => {
        localStorage.clear();
        location.reload();
    });
    htmlDivModalProfile.addEventListener("click", esconderModalProfile);
    htmlImageProfile.classList.remove("d-none");
}

inicializarProfile();
