import { formatDateTime, getStoredPatient, requestJson } from "./shared.js";
import { usuarioPageTemplate, usuarioSemCadastroTemplate } from "../Templates/UsuarioTemplate.js";

function renderSelectOptions(items, placeholder) {
    const baseOption = placeholder ? `<option value="">${placeholder}</option>` : "";

    return baseOption + items.map(item => `<option value="${item.id}">${item.nome || item.nome_completo || `Item ${item.id}`}</option>`).join("");
}

function renderConsultas(listaElement, consultas, medicoMap, especialidadeMap) {
    if (!consultas.length) {
        listaElement.innerHTML = '<li class="empty-state">Nenhuma consulta cadastrada para este paciente.</li>';
        return;
    }

    listaElement.innerHTML = consultas.map(consulta => `
        <li class="list-item consultation-item">
            <div>
                <strong>Consulta ${consulta.id}</strong>
                <span>${formatDateTime(consulta.data_hora)}</span>
            </div>
            <div class="muted">
                Médico: ${medicoMap.get(consulta.medico_id)?.nome || `ID ${consulta.medico_id}`} •
                Especialidade: ${especialidadeMap.get(consulta.especialidade_id)?.nome || `ID ${consulta.especialidade_id}`} •
                Estado: ${consulta.estado}
            </div>
        </li>
    `).join("");
}

async function carregarCatalogos(container) {
    const [medicos, especialidades] = await Promise.all([
        requestJson("cadastro", "/medicos"),
        requestJson("cadastro", "/especialidades")
    ]);

    const medicoSelect = container.querySelector("#consultaMedico");
    const especialidadeSelect = container.querySelector("#consultaEspecialidade");
    const medicoReagendarSelect = container.querySelector("#reagendarMedico");

    medicoSelect.innerHTML = renderSelectOptions(medicos, "Selecione o médico");
    medicoReagendarSelect.innerHTML = renderSelectOptions(medicos, "Manter médico atual");
    especialidadeSelect.innerHTML = renderSelectOptions(especialidades, "Selecione a especialidade");

    return {
        medicos,
        especialidades,
        medicoMap: new Map(medicos.map(item => [item.id, item])),
        especialidadeMap: new Map(especialidades.map(item => [item.id, item]))
    };
}

async function carregarConsultas(container, pacienteId, medicoMap, especialidadeMap) {
    const listaElement = container.querySelector("#listaConsultas");

    try {
        const consultas = await requestJson("agendamento", `/consultas?paciente_id=${pacienteId}`);
        renderConsultas(listaElement, consultas, medicoMap, especialidadeMap);
    } catch (error) {
        listaElement.innerHTML = `<li class="empty-state error-state">${error.message}</li>`;
    }
}

export async function renderUsuarioPage(container, context) {
    const paciente = getStoredPatient();

    if (!paciente) {
        container.innerHTML = usuarioSemCadastroTemplate();

        container.querySelector("#ir-home").addEventListener("click", () => context.navigateTo("home"));
        return;
    }

    container.innerHTML = usuarioPageTemplate({ paciente });

    let catalogos = { medicos: [], especialidades: [], medicoMap: new Map(), especialidadeMap: new Map() };

    try {
        catalogos = await carregarCatalogos(container);
        await carregarConsultas(container, paciente.id, catalogos.medicoMap, catalogos.especialidadeMap);
    } catch (error) {
        context.notify("error", error.message);
    }

    container.querySelector("#consulta-form").addEventListener("submit", async event => {
        event.preventDefault();

        const medicoId = Number(container.querySelector("#consultaMedico").value);
        const especialidadeId = Number(container.querySelector("#consultaEspecialidade").value);
        const data = container.querySelector("#consultaData").value;
        const hora = container.querySelector("#consultaHora").value;
        const dataHora = `${data}T${hora}`;

        try {
            await requestJson("agendamento", "/consultas", {
                method: "POST",
                body: {
                    paciente_id: paciente.id,
                    medico_id: medicoId,
                    especialidade_id: especialidadeId,
                    data_hora: dataHora
                }
            });

            context.notify("success", "Consulta agendada com sucesso.");
            event.target.reset();
            await carregarConsultas(container, paciente.id, catalogos.medicoMap, catalogos.especialidadeMap);
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#reagendar-form").addEventListener("submit", async event => {
        event.preventDefault();

        const consultaId = Number(container.querySelector("#reagendarConsultaId").value);
        const medicoId = Number(container.querySelector("#reagendarMedico").value);
        const data = container.querySelector("#reagendarData").value;
        const hora = container.querySelector("#reagendarHora").value;
        const dataHora = `${data}T${hora}`;
        const payload = { data_hora: dataHora };

        if (Number.isFinite(medicoId) && medicoId > 0) {
            payload.medico_id = medicoId;
        }

        try {
            await requestJson("agendamento", `/consultas/${consultaId}/reagendar`, {
                method: "PUT",
                body: payload
            });

            context.notify("success", "Consulta reagendada.");
            event.target.reset();
            await carregarConsultas(container, paciente.id, catalogos.medicoMap, catalogos.especialidadeMap);
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#cancelamento-form").addEventListener("submit", async event => {
        event.preventDefault();

        const consultaId = Number(container.querySelector("#cancelamentoConsultaId").value);

        try {
            await requestJson("agendamento", `/consultas/${consultaId}/solicitar-cancelamento`, {
                method: "POST"
            });

            context.notify("success", "Solicitação de cancelamento enviada.");
            event.target.reset();
            await carregarConsultas(container, paciente.id, catalogos.medicoMap, catalogos.especialidadeMap);
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    const botaoVoltarHome = container.querySelector("#voltar-home-usuario");

    if (botaoVoltarHome) {
        botaoVoltarHome.addEventListener("click", () => context.navigateTo("home"));
    }
}
