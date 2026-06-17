import {
    PERFIL_ROTA,
    getStoredPatient,
    login,
    requestJson,
    setStoredAuth,
    setStoredMedico,
    setStoredPatient,
    setStoredRole,
    setStoredToken
} from "./shared.js";
import { loginPageTemplate } from "../Templates/LoginTemplate.js";

export async function renderLoginPage(container, context) {
    const pacienteCadastrado = getStoredPatient();

    container.innerHTML = loginPageTemplate({ pacienteCadastrado });

    container.querySelector("#login-form").addEventListener("submit", async event => {
        event.preventDefault();

        const perfil = container.querySelector("#loginPerfil").value;
        const username = container.querySelector("#loginUsuario").value.trim();
        const senha = container.querySelector("#loginSenha").value;

        if (!username || !senha) {
            context.notify("error", "Login inválido: informe usuário e senha.");
            return;
        }

        try {
            const sessao = await login(perfil, username, senha);

            setStoredToken(sessao.token);
            setStoredRole(sessao.perfil);
            setStoredAuth(sessao);

            // Para o paciente, busca o cadastro completo para a área do usuário.
            if (sessao.perfil === "paciente" && sessao.paciente_id) {
                try {
                    const paciente = await requestJson("cadastro", `/pacientes/${sessao.paciente_id}`);
                    setStoredPatient(paciente);
                } catch {
                    setStoredPatient({ id: sessao.paciente_id, nome: sessao.nome });
                }
            }

            // Para o médico, se o usuário estiver vinculado a um registro de médico.
            if (sessao.perfil === "medico" && sessao.medico_id) {
                try {
                    const medico = await requestJson("cadastro", `/medicos/${sessao.medico_id}`);
                    setStoredMedico(medico);
                } catch {
                    /* a área do médico permite selecionar o registro manualmente */
                }
            }

            context.notify("success", `Bem-vindo(a), ${sessao.nome || username}.`);
            context.navigateTo(PERFIL_ROTA[sessao.perfil] || "home");
        } catch (error) {
            // Mensagens vindas do backend: "Usuario ou senha invalidos", etc.
            context.notify("error", `Login inválido: ${error.message}`);
        }
    });

    container.querySelector("#go-cadastro").addEventListener("click", () => {
        context.navigateTo("cadastro");
    });

    container.querySelector("#go-home").addEventListener("click", () => {
        context.navigateTo("home");
    });
}
