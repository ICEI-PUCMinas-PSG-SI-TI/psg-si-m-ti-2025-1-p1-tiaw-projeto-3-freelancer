//@ts-check

/*
 * Esse script captura todos os links na página que redirecionam para 404.html,
 * bloqueia o redirecionamento e mostra uma mensagem em toast informando que a
 * página ainda não foi implementada
 * 
 */

// https://getbootstrap.com/docs/5.3/components/toasts

function setup404Toast(){
    let toast = document.getElementById('liveToast')
    let document_links = document.links
    // @ts-ignore: bootstrap is imported in html
    let toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast)

    for (let i = 0; i < document_links.length; i++) {
        if(document_links[i].href.endsWith("")){
            document_links[i].addEventListener('click', (event) => {
                toastBootstrap.show()
                event.preventDefault();
            })
        }
    }
}

setup404Toast();