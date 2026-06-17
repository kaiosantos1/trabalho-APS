import { addStoredPatientToRegistry, getStoredPatient, parseCsvList, requestJson, setStoredPatient, setStoredRole } from "./shared.js";
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
            ativo: true
        };

        try {
            const pacienteCriado = await requestJson("cadastro", "/pacientes", {
                method: "POST",
                body: payload
            });

            setStoredPatient(pacienteCriado);
            addStoredPatientToRegistry(pacienteCriado);
            setStoredRole("usuario");
            context.notify("success", "Cadastro concluído. Você já pode usar a área do paciente.");
            container.querySelector("#cadastro-form").reset();
            context.navigateTo("usuario");
        } catch (error) {
            context.notify("error", error.message);
        }
    });
}
