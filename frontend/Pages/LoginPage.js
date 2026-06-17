import { getStoredPatient, setStoredRole } from "./shared.js";
import { loginPageTemplate } from "../Templates/LoginTemplate.js";

export async function renderLoginPage(container, context) {
    const pacienteCadastrado = getStoredPatient();

    container.innerHTML = loginPageTemplate({ pacienteCadastrado });

    container.querySelector("#admin-access").addEventListener("click", () => {
        setStoredRole("administrador");
        context.notify("success", "Acesso de administração liberado.");
        context.navigateTo("administrador");
    });

    const botaoMedico = container.querySelector("#medico-access");

    if (botaoMedico) {
        botaoMedico.addEventListener("click", () => {
            setStoredRole("medico");
            context.notify("success", "Acesso de médico liberado.");
            context.navigateTo("medico");
        });
    }

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
