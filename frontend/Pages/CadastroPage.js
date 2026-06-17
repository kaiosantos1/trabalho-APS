import {
    addStoredPatientToRegistry,
    getStoredPatient,
    parseCsvList,
    registrarPaciente,
    setStoredAuth,
    setStoredPatient,
    setStoredRole,
    setStoredToken
} from "./shared.js";
import { cadastroPageTemplate } from "../Templates/CadastroTemplate.js";

export async function renderCadastroPage(container, context) {
    const pacienteAtual = getStoredPatient();

    container.innerHTML = cadastroPageTemplate({ pacienteAtual });

    container.querySelector("#voltar-login").addEventListener("click", () => {
        context.navigateTo("login");
    });

    container.querySelector("#cadastro-form").addEventListener("submit", async event => {
        event.preventDefault();

        const payload = {
            nome: container.querySelector("#pacienteNome").value.trim(),
            cpf: container.querySelector("#pacienteCpf").value.trim(),
            data_nascimento: container.querySelector("#pacienteNascimento").value || null,
            endereco: container.querySelector("#pacienteEndereco").value.trim() || null,
            telefones: parseCsvList(container.querySelector("#pacienteTelefone").value),
            emails: parseCsvList(container.querySelector("#pacienteEmail").value),
            username: container.querySelector("#pacienteUsuario").value.trim(),
            senha: container.querySelector("#pacienteSenha").value
        };

        try {
            const sessao = await registrarPaciente(payload);

            // O registro ja devolve token + dados do paciente: deixa logado.
            setStoredToken(sessao.token);
            setStoredRole(sessao.perfil);
            setStoredAuth(sessao);
            setStoredPatient(sessao.paciente);
            addStoredPatientToRegistry(sessao.paciente);

            context.notify("success", "Cadastro concluído. Você já está logado na área do paciente.");
            container.querySelector("#cadastro-form").reset();
            context.navigateTo("usuario");
        } catch (error) {
            context.notify("error", error.message);
        }
    });
}
