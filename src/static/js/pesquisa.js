// @ts-check

function inflateBarraPesquisa() {
    const htmlInputSearchContainer = document.getElementById("inflate_pesquisa");
    if (!(htmlInputSearchContainer instanceof HTMLDivElement)) return false;
    htmlInputSearchContainer.classList.remove("d-none");
    return true;
}

/**
 * @param {string} query
 */
function navigateToResultados(query) {
    if (typeof query !== "string") return;
    if (query.length === 0) throw new Error("Pesquisa sem parâmetros!");

    const url = new URL(window.location.href);
    let pathname = "/resultados";
    const params = new URLSearchParams();
    params.set("q", query);
    const newUrl = `${url.origin}${pathname}?${params.toString()}`;

    window.location.href = newUrl;
}

(() => {
    if (!inflateBarraPesquisa()) return;

    const htmlInputSearchQuery = document.getElementById("search-bar");
    const htmlButtonSearch = document.getElementById("search-btn");
    if (
        !(htmlInputSearchQuery instanceof HTMLInputElement) ||
        !(htmlButtonSearch instanceof HTMLButtonElement)
    )
        return;

    htmlButtonSearch.addEventListener("click", (e) => {
        e.preventDefault();
        const query = htmlInputSearchQuery.value;
        try {
            navigateToResultados(query);
        } catch (err) {
            alert(err);
        }
    });
})();
