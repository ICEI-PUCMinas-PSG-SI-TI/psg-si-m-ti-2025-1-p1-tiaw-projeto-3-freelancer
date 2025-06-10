// @ts-check

function createServiceCard(
    titulo,
    nome_usuario,
    descricao,
    quantidade_avaliacoes,
    nota_avaliacoes
) {
    const card = document.createElement("div");
    card.classList.add("col-12", "col-md-6", "col-xl-4");
    card.innerHTML = `<div class="card my-3 w-100">
        <div class="card-body">
        <div class="d-flex flex-row mb-1">
            <img class="card-image me-2" src="static/img/placeholder_profile.png" />
            <div class="flex-column">
            <p class="space-0">${titulo}</p>
            <p class="space-0">${nome_usuario}</p>
            </div>
        </div>
        <p>${descricao}</p>
        <div class="d-flex flex-row justify-content-between">
            <p class="space-0">📝 ${quantidade_avaliacoes}</p>
            <!-- TODO: Adicionar como estrelas -->
            <p class="space-0">⭐ ${nota_avaliacoes}/10</p>
        </div>
        </div>
    </div>`;

    return card;
}

function createUserCard(nome_usuario, cidade, quantidade_avaliacoes, nota_avaliacoes, biografia) {
    const card = document.createElement("div");
    card.classList.add("col-12", "col-md-6", "col-xl-4");
    card.innerHTML = `<div class="card my-3 w-100">
        <div class="card-body">
        <div class="d-flex flex-row mb-1">
            <img class="card-image me-2" src="static/img/placeholder_profile.png" />
            <div class="flex-column">
            <p class="space-0">${nome_usuario}</p>
            <p class="space-0">${cidade}</p>
            </div>
        </div>
        <p>${biografia}</p>
        <div class="d-flex flex-row justify-content-between">
            <p class="space-0">📝 ${quantidade_avaliacoes}</p>
            <!-- TODO: Adicionar como estrelas -->
            <p class="space-0">⭐ ${nota_avaliacoes}/10</p>
        </div>
        </div>
    </div>`;

    return card;
}

function setupResultados() {
    const html_row_service = document.getElementById("row-service");
    const html_row_users = document.getElementById("row-users");
    if (
        !(html_row_service instanceof HTMLDivElement) ||
        !(html_row_users instanceof HTMLDivElement)
    )
        return;

    for (let i = 0; i < 10; i++) {
        html_row_service.appendChild(
            createServiceCard("Serviço X", "Fulano", "Serviço de Tal Coisa", 12, 6)
        );
        html_row_users.appendChild(
            createUserCard(
                "Fulano",
                "Belo Horizonte, MG",
                1923,
                8,
                "Fulano de tal é um cara muito bacana que gosta de fazer coisas por ai."
            )
        );
    }
}

setupResultados();
