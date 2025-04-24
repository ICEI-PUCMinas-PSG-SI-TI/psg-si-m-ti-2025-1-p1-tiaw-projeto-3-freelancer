document.addEventListener("DOMContentLoaded", () => {
    let toggleDarkDiv = document.getElementById("toggleDarkDiv");
    toggleDarkDiv.style.display = "block";

    var body = document.getElementsByTagName('body')[0];
    var input = document.getElementById("toggleDark");
    var theme_key = "data-bs-theme";
    input.addEventListener("click", onDarkToggleSwitch);

    // read theme
    setDarkTheme(localStorage.getItem(theme_key) === "dark");

    function setDarkTheme(darkEnabled, storeConfig) {
        let themeCfg = "light";
        if (darkEnabled) {
            themeCfg = "dark"
        }

        if (storeConfig) {
            localStorage.setItem(theme_key, themeCfg);
        }

        input.checked = darkEnabled;
        body.setAttribute(theme_key, themeCfg);
    }

    function onDarkToggleSwitch() {
        if (localStorage.getItem(theme_key) === "dark") {
            setDarkTheme(false, true);
        } else {
            setDarkTheme(true, true);
        }
    }
});