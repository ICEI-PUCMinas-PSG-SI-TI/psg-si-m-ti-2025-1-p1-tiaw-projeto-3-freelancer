//@ts-check

/*
 * Esse script captura todos os links na página que redirecionam para 404.html,
 * bloqueia o redirecionamento e adiciona um onClick que mostra uma mensagem em
 * toast informando que a página ainda não foi implementada.
 */

// https://getbootstrap.com/docs/5.3/components/toasts

function setup404Toast() {
    const toast_container = document.createElement("div");
    toast_container.classList.add("toast-container", "position-fixed", "bottom-0", "end-0", "p-3");
    toast_container.innerHTML = `<div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body">
                Essa página ainda não foi implementada!
            </div>
        </div>`;

    document.body.appendChild(toast_container);

    let toast = document.getElementById("liveToast");
    // retorna todos os elementos <a> | href != null
    let document_links = document.links;
    // @ts-ignore: bootstrap is imported in html
    let toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);

    for (let i = 0; i < document_links.length; i++) {
        if (!document_links[i].href.endsWith("404.html")) continue;

        document_links[i].addEventListener("click", (event) => {
            toastBootstrap.show();
            event.preventDefault();
        });
    }
}

setup404Toast();
