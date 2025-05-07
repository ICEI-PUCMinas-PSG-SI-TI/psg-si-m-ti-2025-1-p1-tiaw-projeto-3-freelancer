//@ts-check

/*
 * Esse script adiciona um configuração de tema claro/escuro
 *
 */

function setupDarkMode(){
    let toggleDarkDiv = document.getElementById("toggleDarkDiv");
    if(!toggleDarkDiv){
        return;
    }

    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let input = document.getElementById("toggleDark");
    if (!input) {
        return;
    }

    toggleDarkDiv.style.display = "block";
    const theme_key = "data-bs-theme";

    function isDarkTheme(){
        return localStorage.getItem(theme_key) === "dark"
    }

    function setDarkTheme(darkEnabled, storeConfig) {
        let themeCfg = "light";
        if (darkEnabled) {
            themeCfg = "dark"
        }

        if (storeConfig) {
            localStorage.setItem(theme_key, themeCfg);
        }

        if(input){
            input.checked = darkEnabled;
            document.body.setAttribute(theme_key, themeCfg);
        }
    }

    // read theme
    setDarkTheme(isDarkTheme());

    // onDarkToggleSwitch
    input.addEventListener("click", function () {
        if (isDarkTheme()) {
            setDarkTheme(false, true);
        } else {
            setDarkTheme(true, true);
        }
    });
}

setupDarkMode();