//@ts-check

/*
 * Esse script adiciona um configuração de tema claro/escuro
 */

function setupDarkMode() {
    const toggleDarkDiv = document.getElementById("toggleDarkDiv");
    if (!toggleDarkDiv) return;

    toggleDarkDiv.classList.add(
        "d-flex",
        "p-2",
        "flex-row",
        "justify-content-center",
        "align-items-center",
    );
    toggleDarkDiv.innerHTML += `<img class="dark-toggle" src="static/dark.svg">
        <div class="form-check form-switch form-check-reverse">
            <input id="toggleDark" class="form-check-input" type="checkbox">
        </div>`;

    const input = document.getElementById("toggleDark");
    if (!(input instanceof HTMLInputElement)) return;

    const THEME_KEY = "data-bs-theme";

    function isDarkTheme() {
        return localStorage.getItem(THEME_KEY) === "dark";
    }

    /**
     * @param {boolean} darkEnabled
     * @param {boolean} [storeConfig]
     */
    function setDarkTheme(darkEnabled, storeConfig) {
        let themeCfg = darkEnabled ? "dark" : "light";

        if (storeConfig) localStorage.setItem(THEME_KEY, themeCfg);

        if (input instanceof HTMLInputElement) {
            input.checked = darkEnabled;
            document.body.setAttribute(THEME_KEY, themeCfg);
        }
    }

    // read theme
    setDarkTheme(isDarkTheme());

    // onDarkToggleSwitch
    input.addEventListener("click", () => setDarkTheme(!isDarkTheme(), true));

    // if everything is ok, display toggle
    toggleDarkDiv.classList.remove("d-none");
}

setupDarkMode();
