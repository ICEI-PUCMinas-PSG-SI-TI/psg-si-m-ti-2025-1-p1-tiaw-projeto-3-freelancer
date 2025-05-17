import * as JSONQL_S from "./jsonql.service.mjs"; // Serviços
import * as JSONQL_U from "./jsonql.user.mjs"; // Usuários
import * as JSONQL_C from "./jsonql.contract.mjs"; // Contratos
import * as JSONQL_A from "./jsonql.review.mjs"; // Avaliações
import * as JSONQL_P from "./jsonql.portfolio.mjs"; // Portfólios

/**
 * Retorna um número aleatório entre 0 e max, o min é opcional
 * Valor máximo
 * @param {number} max Valor máximo
 * @param {number} [min] Valor mínimo (opcional = 0)
 * 
 * @returns {number} Retorna um número aleatório
 */
// TODO: Move to a module
function genRandomNumber(max, min) {
    if (min) {
        let val = (Math.random() * (max - min) + min)
        // TODO: why convert to string? avoid IDE warning
        // Avoid double values
        return parseInt(val.toString(), 10);
    }

    if (!max)
        return 0;

    return Math.floor(Math.random() * max);
}

function getNota(userId) {
    // TODO: select * where userId = userId
    let media = 0;
    let avaliacoes = JSONQL_A.readAvaliacoes()
    if (avaliacoes.length) {
        let q = 0;
        avaliacoes.forEach((element) => {
            let contratoId = element.contratoId
            // TODO: Otimizar
            let contrato = JSONQL_C.readContratos(contratoId);
            if (!contrato) {
                console.log("setupPortfolioPage: Não foi possível identificar o contrato");
                return null
            }

            let contratado = contrato[0].contratadoId

            if (!contratado) {
                console.log("setupPortfolioPage: Não foi possível identificar o contratado");
                return null
            }

            if (contratado == userId) {
                media += element.nota;
                q++;
            }
        });
        if (q > 0) {
            media /= q;
        }
        console.log(media);
    }

    // Arredonda para 2 casas
    return Math.round(media * 100) / 100;
}

function setupPortfolioPage() {
    let portfolio = JSONQL_P.readPortfolios();
    if (!portfolio.length) {
        console.log("setupPortfolioPage: nenhum portfólio cadastrado!");
        return null
    }

    portfolio = portfolio[genRandomNumber(portfolio.length)]

    let user = portfolio.usuarioId
    if (!user) {
        console.log("setupPortfolioPage: no user");
        return null
    }

    user = JSONQL_U.readUsuarios(user)

    if (!user.length) {
        console.log("setupPortfolioPage: usuario não encontrado");
        return null
    }

    let nome = user[0].nome
    let id = user[0].id
    let biografia = user[0].biografia
    // TODO: adicionar contato e e-mail?

    // TODO: Se não preenchido na hora do cadastro?
    if (!nome || !id || !biografia) {
        console.log("setupPortfolioPage: não foi possível verificar alguma informação do usuário");
        return null
    }

    let portfolio_name = document.getElementById("portfolio-name")
    let portfolio_username = document.getElementById("portfolio-username")
    let portfolio_nota = document.getElementById("portfolio-nota")
    let portfolio_descricao = document.getElementById("portfolio-descricao")

    if (!portfolio_name || !portfolio_username || !portfolio_nota || !portfolio_descricao) {
        console.log("setupPortfolioPage: não foi possível atribuir o id");
        return null
    }

    portfolio_name.innerText = nome
    portfolio_username.innerText = `@${id}`
    portfolio_descricao.innerText = biografia

    let media = getNota(id);
    if (media) {
        portfolio_nota.innerText = media
    }

    let secoes = portfolio.secoes
    // TODO: O usuário pode não ter cadastrado nenhuma seção ainda
    if (!secoes.length) {
        console.log("setupPortfolioPage: sem secoes");
        return null
    }
}

setupPortfolioPage();