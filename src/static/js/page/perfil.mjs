//@ts-check

import { Usuarios } from "../jsonf/usuarios.mjs";
// eslint-disable-next-line no-unused-vars
import { Avaliacoes, AvaliacaoObjectExpanded } from "../jsonf/avaliacoes.mjs";
// eslint-disable-next-line no-unused-vars
import { Servicos, ServicoObjectExpanded } from "../jsonf/servicos.mjs";

import { assertStringNonEmpty } from "../lib/validate.mjs";
import { retornarIdSeLogado } from "../lib/credenciais.mjs";

const crudUsuarios = new Usuarios();
const crudAvaliacoes = new Avaliacoes();
const crudServicos = new Servicos();

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

    if (allowEdit) {
        htmlProfileButtonEditPerfil?.classList.remove("d-none");
        htmlProfileButtonEditPerfil?.addEventListener("click", () => location.assign("/cadastro"));
    }

    let servicos = await crudServicos.lerServicos();
    if (!servicos.length) return;
    servicos = servicos.filter((servico) => servico.usuarioId === id);
    const servicosIdList = new Set();

    const listaServicos = document.getElementById("lista-servicos");
    const listServicosElement = document.createElement("div");
    listServicosElement.classList.add("mb-2", "w-100", "rounded");
    servicos.forEach((servico) => {
        servicosIdList.add(servico.id);
        // Adicionar no html
        listServicosElement.appendChild(
            createServicoCard(
                servico.id,
                servico.imagem,
                servico.titulo,
                servico.categoria,
                servico.descricao,
                servico.contato,
            ),
        );
    });

    const listaServicosNone = document.getElementById("lista-servicos-none");
    if (!servicosIdList || !(listaServicosNone instanceof HTMLHeadingElement)) return;
    listaServicosNone.classList.add("d-none");
    listaServicos?.appendChild(listServicosElement);

    let avaliacoes = await crudAvaliacoes.lerAvaliacoes();
    if (!avaliacoes?.length) return;
    avaliacoes = avaliacoes.filter((avaliacao) => servicosIdList.has(avaliacao.servicoId));
    if (!avaliacoes.length) return;

    const listaAvaliacoes = document.getElementById("lista-avaliacoes");
    const listAvaliacoesElement = document.createElement("div");
    listAvaliacoesElement.classList.add("mb-2", "w-100", "rounded");

    let total = 0;
    let quant = 0;
    avaliacoes.forEach((avaliacao) => {
        total += avaliacao.nota || 0;
        quant++;

        listAvaliacoesElement.appendChild(
            createAvaliacaoCard(avaliacao?.usuario?.nome, avaliacao?.nota, avaliacao?.comentario),
        );
    });

    htmlProfileParagNota.innerText = (total / quant).toFixed(2).toString();
    htmlProfileParagAval.innerText = String(quant);

    const listaAvaliacoesNone = document.getElementById("lista-avaliacoes-none");
    if (!(listaAvaliacoesNone instanceof HTMLHeadingElement)) return;
    listaAvaliacoesNone.classList.add("d-none");
    listaAvaliacoes?.appendChild(listAvaliacoesElement);
}

function createServicoCard(id, imagem, titulo, categoria, descricao, contato) {
    const a = document.createElement("a");
    a.className =
        "list-group-item d-flex justify-content-between align-items-center flex-wrap text-decoration-none";

    a.innerHTML = `<div class="d-flex me-3">
            <img width="64px" heigth="64px" class="rounded" src="${imagem || "static/icons/images.svg"}" />
        </div>
        <div class="d-flex flex-column flex-grow-1 me-3">
            <strong>${titulo}</strong>
            <small>${categoria}</small>
            <p class="mb-1">${descricao}</p>
            <small>Contato: ${contato}</small>
        </div>`;
    a.href = `/detalhes.html?id=${id}`;
    return a;
}

function createAvaliacaoCard(nome, nota, comentario) {
    const li = document.createElement("li");
    li.className =
        "list-group-item d-flex justify-content-between align-items-center flex-wrap text-decoration-none";
    li.innerHTML = `<div class="card-body p-3">
        <h6 class="card-title mb-1">${nome} <span class="text-warning">${estrelas(nota)}</span></h6>
        <p class="card-text mb-0">${comentario}</p>
    </div>`;
    return li;
}

function estrelas(nota) {
    if (!nota) return "Nota não registrada";
    return `${"⭐".repeat(nota)} (${String(nota)}/5)`;
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
