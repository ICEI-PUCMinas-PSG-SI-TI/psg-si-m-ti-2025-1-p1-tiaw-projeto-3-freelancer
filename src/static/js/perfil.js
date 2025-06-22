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

function inicializarPerfil() {
    const _temp_informacoes = {
        foto: "https://picsum.photos/150",
        profissao: "Analista Financeiro",
        cidade: "Belo Horizonte, MG",
        nome: "Arthur Melo",
        contato: "+55 (31) 123456789",
        email: "arthur.andrade@gmail.com",
    };

    const nota = 4.4;
    const avaliacoes = 152;

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

    htmlProfileImgPicture.src = _temp_informacoes.foto;
    htmlProfileH2ProfileName.innerText = _temp_informacoes.nome;
    htmlProfileParagTitle.innerText = _temp_informacoes.profissao;
    htmlProfileParagCidade.innerText = _temp_informacoes.cidade;
    htmlProfileLinkContato.innerText = _temp_informacoes.contato;
    const _strip_contato = _temp_informacoes.contato.replace(/[^0-9+]/gm, "");
    htmlProfileLinkContato.href = `tel:${_strip_contato}`;
    htmlProfileLinkEmail.innerText = _temp_informacoes.email;
    htmlProfileLinkEmail.href = `mailto:${_temp_informacoes.email}`;

    htmlProfileParagNota.innerText = nota;
    htmlProfileParagAval.innerText = avaliacoes;
}

inicializarPerfil();
