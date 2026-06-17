import { getStoredPatient, setStoredRole } from "./shared.js";
import { loginPageTemplate } from "../Templates/LoginTemplate.js";

export async function renderLoginPage(container, context) {
    const pacienteCadastrado = getStoredPatient();

    container.innerHTML = loginPageTemplate({ pacienteCadastrado });

    container.querySelector("#diretor-access").addEventListener("click", () => {
        setStoredRole("diretor");
        context.notify("success", "Acesso de diretor liberado.");
        context.navigateTo("diretor");
    });

    container.querySelector("#gerente-access").addEventListener("click", () => {
        setStoredRole("gerente");
        context.notify("success", "Acesso de gerente liberado.");
        context.navigateTo("gerente");
    });

    container.querySelector("#atendente-access").addEventListener("click", () => {
        setStoredRole("atendente");
        context.notify("success", "Acesso de atendente liberado.");
        context.navigateTo("atendente");
    });

    container.querySelector("#medico-access").addEventListener("click", () => {
        setStoredRole("medico");
        context.notify("success", "Acesso de médico liberado.");
        context.navigateTo("medico");
    });

    const botaoUsuario = container.querySelector("#go-usuario");

    if (botaoUsuario) {
        botaoUsuario.addEventListener("click", () => {
            setStoredRole("usuario");
            context.navigateTo("usuario");
        });
    }

    const botaoCadastro = container.querySelector("#go-cadastro");

    if (botaoCadastro) {
        botaoCadastro.addEventListener("click", () => {
            context.navigateTo("cadastro");
        });
    }

    const botaoHome = container.querySelector("#go-home");

    if (botaoHome) {
        botaoHome.addEventListener("click", () => {
            context.navigateTo("home");
        });
    }
}
