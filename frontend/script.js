import { renderHomePage } from "./Pages/HomePage.js";
import { renderAdministradorPage } from "./Pages/AdministradorPage.js";
import { renderCadastroPage } from "./Pages/CadastroPage.js";
import { renderLoginPage } from "./Pages/LoginPage.js";
import { renderUsuarioPage } from "./Pages/UsuarioPage.js";
import { renderMedicoPage } from "./Pages/MedicoPage.js";
import { renderDiretorPage } from "./Pages/DiretorPage.js";
import { renderGerentePage } from "./Pages/GerentePage.js";
import { renderAtendentePage } from "./Pages/AtendentePage.js";
import { clearAuth, getStoredAuth, getStoredMedico, getStoredPatient, getStoredRole, getStoredToken } from "./Pages/shared.js";

// Rota -> perfil exigido para acessá-la (controle de acesso no frontend).
const ROTAS_PROTEGIDAS = {
    diretor: "diretor",
    gerente: "gerente",
    atendente: "atendente",
    medico: "medico",
    usuario: "paciente"
};

const app = document.getElementById("app");
const flash = document.getElementById("global-message");
const topbarNav = document.getElementById("main-nav");

const renderers = {
    home: renderHomePage,
    login: renderLoginPage,
    cadastro: renderCadastroPage,
    usuario: renderUsuarioPage,
    medico: renderMedicoPage,
    diretor: renderDiretorPage,
    gerente: renderGerentePage,
    atendente: renderAtendentePage,
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
    const auth = getStoredAuth();
    const patient = getStoredPatient();
    const medico = getStoredMedico();

    const titulos = { diretor: "Diretor", gerente: "Gerente", atendente: "Atendente" };

    if (titulos[role]) {
        return auth?.nome ? `${titulos[role]} (${auth.nome})` : titulos[role];
    }

    if (role === "medico") {
        return medico?.nome ? `Dr(a). ${medico.nome}` : (auth?.nome || "Médico");
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

    const logado = Boolean(getStoredToken());

    if (route === "home" && !logado) {
        topbarNav.innerHTML = '<a href="#login">Login</a><a href="#cadastro">Cadastro</a>';
        return;
    }

    if (logado) {
        topbarNav.innerHTML = `<span class="topbar-status">Logado: ${resolveUserLabel()}</span><button class="button ghost" id="logout-btn" type="button">Sair</button>`;
        const botaoSair = topbarNav.querySelector("#logout-btn");
        if (botaoSair) {
            botaoSair.addEventListener("click", () => {
                clearAuth();
                window.location.hash = "#home";
                render();
            });
        }
        return;
    }

    topbarNav.innerHTML = '<a href="#login">Login</a><a href="#cadastro">Cadastro</a>';
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
    let route = resolveRoute();

    // Controle de acesso: rotas de perfil exigem login com o perfil correto.
    const perfilExigido = ROTAS_PROTEGIDAS[route];
    if (perfilExigido) {
        const logado = Boolean(getStoredToken());
        const role = getStoredRole();

        if (!logado) {
            notify("error", "Faça login para acessar essa área.");
            route = "login";
        } else if (role !== perfilExigido) {
            notify("error", "Acesso negado: seu perfil não tem permissão para essa área.");
            route = "home";
        }
    }

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
