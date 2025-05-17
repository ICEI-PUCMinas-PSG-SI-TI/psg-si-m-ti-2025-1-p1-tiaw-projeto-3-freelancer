import * as JSONQL_S from "./jsonql.service.mjs"; // Serviços
import * as JSONQL_U from "./jsonql.user.mjs"; // Usuários
import * as JSONQL_C from "./jsonql.contract.mjs"; // Contratos
import * as JSONQL_A from "./jsonql.review.mjs"; // Avaliações
import * as JSONQL_P from "./jsonql.portfolio.mjs"; // Portfólios

function setupPortfolioPage() {
    let portfolios = JSONQL_P.readPortfolios();
    if (!portfolios.length) {
        console.log("setupPortfolioPage: nenhum portfólio cadastrado!");
        return null
    }

    portfolios.forEach(element => {
        let user = element.usuarioId
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

        // TODO: verificar media das notas de avaliação
        // portfolio_nota.innerText = nome

        let secoes = element.secoes
        if (!secoes.length) {
            console.log("setupPortfolioPage: sem secoes");
            // TODO: O usuário pode não ter cadastrado nenhuma seção ainda
            return null
        }
    });
}

console.log("object");

setupPortfolioPage();