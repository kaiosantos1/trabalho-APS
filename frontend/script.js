import { renderHomePage } from "./Pages/HomePage.js";
import { renderAdministradorPage } from "./Pages/AdministradorPage.js";
import { renderCadastroPage } from "./Pages/CadastroPage.js";
import { renderLoginPage } from "./Pages/LoginPage.js";
import { renderUsuarioPage } from "./Pages/UsuarioPage.js";
import { getStoredPatient, getStoredRole } from "./Pages/shared.js";

const app = document.getElementById("app");
const flash = document.getElementById("global-message");
const topbarNav = document.getElementById("main-nav");

const renderers = {
    home: renderHomePage,
    login: renderLoginPage,
    cadastro: renderCadastroPage,
    usuario: renderUsuarioPage,
    administrador: renderAdministradorPage
};

function normalizeRoute(route) {
    return Object.prototype.hasOwnProperty.call(renderers, route) ? route : "home";
}

function resolveRoute() {
    const hash = window.location.hash.replace("#", "").trim();

    if (hash) {
        return normalizeRoute(hash);
    }

    return "home";
}

function navigateTo(route) {
    window.location.hash = `#${normalizeRoute(route)}`;
}

function resolveUserLabel() {
    const role = getStoredRole();
    const patient = getStoredPatient();

    if (role === "administrador") {
        return "Administrador";
    }

    if (patient?.nome) {
        return patient.nome;
    }

    return "Visitante";
}

function renderTopbarNav(route) {
    if (!topbarNav) {
        return;
    }

    const userLabel = resolveUserLabel();

    topbarNav.innerHTML = route === "home"
        ? '<a href="#login">Login</a><a href="#cadastro">Cadastro</a>'
        : `<span class="topbar-status">Logado: ${userLabel}</span>`;
}

function notify(type, message) {
    if (!flash) {
        return;
    }

    flash.innerHTML = `
        <div class="flash flash-${type}">
            <strong>${type === "error" ? "Atenção" : type === "success" ? "Tudo certo" : "Informação"}</strong>
            <span>${message}</span>
        </div>
    `;

    window.clearTimeout(notify.timerId);
    notify.timerId = window.setTimeout(() => {
        flash.innerHTML = "";
    }, 3500);
}

async function render() {
    const route = resolveRoute();

    if (window.location.hash.replace("#", "") !== route) {
        window.location.hash = `#${route}`;
    }

    renderTopbarNav(route);

    app.innerHTML = '<section class="card loading-card">Carregando tela...</section>';

    const renderer = renderers[route] || renderers.login;

    try {
        await renderer(app, {
            navigateTo,
            notify
        });
    } catch (error) {
        app.innerHTML = `
            <section class="card loading-card error-card">
                <h2>Não foi possível carregar a tela</h2>
                <p>${error.message}</p>
                <button class="button primary" id="retry-render">Tentar novamente</button>
            </section>
        `;

        app.querySelector("#retry-render").addEventListener("click", render);
    }
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);
