// @ts-check

function inflateBarraPesquisa() {
    const html_search_bar = document.getElementById("inflate_pesquisa");
    if (!(html_search_bar instanceof HTMLDivElement)) return;
    html_search_bar.classList.remove("d-none");
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

    const html_search_bar = document.getElementById("search-bar");
    const html_search_btn = document.getElementById("search-btn");
    if (
        !(html_search_bar instanceof HTMLInputElement) ||
        !(html_search_btn instanceof HTMLButtonElement)
    )
        return;

    html_search_btn.addEventListener("click", (e) => {
        e.preventDefault();
        const query = html_search_bar.value;
        try {
            navigateToResultados(query);
        } catch (err) {
            alert(err);
        }
    });
})();
