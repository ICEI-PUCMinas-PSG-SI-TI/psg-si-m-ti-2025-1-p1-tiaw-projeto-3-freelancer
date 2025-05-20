//@ts-check

/*
 * Esse script adiciona um configuração de tema claro/escuro
 *
 */

function setupDarkMode() {
    let toggleDarkDiv = document.getElementById("toggleDarkDiv");
    if (!toggleDarkDiv) {
        return;
    }

    toggleDarkDiv.classList.add("d-flex", "p-2", "flex-row", "justify-content-center", "align-items-center");
    toggleDarkDiv.innerHTML += `<img class="dark-toggle" src="static/dark.svg">
        <div class="form-check form-switch form-check-reverse">
            <input id="toggleDark" class="form-check-input" type="checkbox">
        </div>`;

    /** @type { HTMLInputElement | null } */
    // @ts-ignore: HTMLInputElement é derivado de HTMLElement
    let input = document.getElementById("toggleDark");
    if (!input) {
        return;
    }

    const theme_key = "data-bs-theme";

    function isDarkTheme() {
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

        if (input) {
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

    // if everything is ok, display toggle
    toggleDarkDiv.classList.remove("d-none");
}

setupDarkMode();