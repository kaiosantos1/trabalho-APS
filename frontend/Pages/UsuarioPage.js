import { formatCurrency, formatDate, formatDateTime, getStoredPatient, requestJson } from "./shared.js";
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
    const disponibilidadeSelect = container.querySelector("#dispMedico");

    const medicosMap = new Map(medicos.map(m => [m.id, m]));
    const especialidadesMap = new Map(especialidades.map(e => [e.id, e]));

    medicoSelect.innerHTML = renderSelectOptions(medicos, "Selecione o médico");
    medicoReagendarSelect.innerHTML = renderSelectOptions(medicos, "Manter médico atual");
    especialidadeSelect.innerHTML = renderSelectOptions(especialidades, "Selecione a especialidade");
    disponibilidadeSelect.innerHTML = renderSelectOptions(medicos, "Selecione o médico");

    // Auto-preencher especialidade quando médico é selecionado
    medicoSelect.addEventListener("change", () => {
        const medicoId = Number(medicoSelect.value);
        if (medicoId && medicosMap.has(medicoId)) {
            const medico = medicosMap.get(medicoId);
            if (medico.especialidades_ids && medico.especialidades_ids.length > 0) {
                especialidadeSelect.value = String(medico.especialidades_ids[0]);
            }
        }
    });

    // Filtrar médicos pela especialidade selecionada
    especialidadeSelect.addEventListener("change", () => {
        const especialidadeId = Number(especialidadeSelect.value);
        if (especialidadeId) {
            const medicosComEsp = medicos.filter(m => m.especialidades_ids && m.especialidades_ids.includes(especialidadeId));
            medicoSelect.innerHTML = renderSelectOptions(medicosComEsp, "Selecione o médico com essa especialidade");
        } else {
            medicoSelect.innerHTML = renderSelectOptions(medicos, "Selecione o médico");
        }
    });

    return {
        medicos,
        especialidades,
        medicoMap: new Map(medicos.map(item => [item.id, item])),
        especialidadeMap: new Map(especialidades.map(item => [item.id, item]))
    };
}

async function carregarConsultas(container, pacienteId, medicoMap, especialidadeMap) {
    const listaElement = container.querySelector("#listaConsultas");
    const prescricoesElement = container.querySelector("#minhasPrescricoes");
    const examesElement = container.querySelector("#meusExames");

    try {
        const consultas = await requestJson("agendamento", `/consultas?paciente_id=${pacienteId}`);
        renderConsultas(listaElement, consultas, medicoMap, especialidadeMap);
        renderPrescricoes(prescricoesElement, consultas);
        renderExameSolicitados(examesElement, consultas);
    } catch (error) {
        listaElement.innerHTML = `<li class="empty-state error-state">${error.message}</li>`;
    }
}

async function carregarFinanceiro(container, pacienteId) {
    const cobrancasElement = container.querySelector("#listaCobrancasPaciente");
    const pagamentosElement = container.querySelector("#listaPagamentosPaciente");

    const [cobrancas, pagamentos] = await Promise.all([
        requestJson("faturamento", `/cobrancas?paciente_id=${pacienteId}`).catch(() => []),
        requestJson("faturamento", `/pagamentos?paciente_id=${pacienteId}`).catch(() => [])
    ]);

    cobrancasElement.innerHTML = cobrancas.length
        ? cobrancas.map(cobranca => `
            <li class="list-item">
                <div><strong>${formatCurrency(cobranca.valor)}</strong><span>${cobranca.status || "-"}</span></div>
                <div class="muted">Consulta ${cobranca.consulta_id ?? "-"} • Emissão: ${formatDate(cobranca.data_emissao)}</div>
            </li>
        `).join("")
        : '<li class="empty-state">Nenhuma cobrança encontrada.</li>';

    pagamentosElement.innerHTML = pagamentos.length
        ? pagamentos.map(pagamento => `
            <li class="list-item">
                <div><strong>${formatCurrency(pagamento.valor)}</strong><span>${pagamento.status || "-"}</span></div>
                <div class="muted">Consulta ${pagamento.consulta_id ?? "-"} • Pagamento: ${formatDate(pagamento.data_pagamento)}</div>
            </li>
        `).join("")
        : '<li class="empty-state">Nenhum pagamento encontrado.</li>';
}

function renderDisponibilidade(listaElement, dados) {
    const escalas = dados.escalas || [];
    const ocupados = dados.horarios_ocupados || [];

    if (!escalas.length) {
        listaElement.innerHTML = `<li class="empty-state">O médico não possui escala em ${dados.dia_semana} (${dados.data}).</li>`;
        return;
    }

    listaElement.innerHTML = escalas.map(escala => `
        <li class="list-item">
            <div><strong>${escala.hora_inicial}–${escala.hora_final}</strong><span>${dados.dia_semana}</span></div>
            <div class="muted">Consultório ${escala.consultorio_id}</div>
        </li>
    `).join("") + (ocupados.length
        ? `<li class="list-item"><div class="muted">Horários já ocupados: ${ocupados.map(formatDateTime).join(", ")}</div></li>`
        : "");
}

function renderPrescricoes(listaElement, consultas) {
    const prescricoes = [];
    consultas.forEach(consulta => {
        if (consulta.prescricoes && consulta.prescricoes.length) {
            consulta.prescricoes.forEach(presc => {
                prescricoes.push({
                    ...presc,
                    consulta_id: consulta.id,
                    data_hora: consulta.data_hora
                });
            });
        }
    });

    if (!prescricoes.length) {
        listaElement.innerHTML = '<li class="empty-state">Nenhuma prescrição registrada.</li>';
        return;
    }

    listaElement.innerHTML = prescricoes.map(presc => `
        <li class="list-item">
            <div><strong>Medicamento ${presc.medicamento_id}</strong><span>Consulta ${presc.consulta_id}</span></div>
            <div class="muted">Dose: ${presc.dose || "-"} • Posologia: ${presc.posologia || "-"}</div>
        </li>
    `).join("");
}

function renderExameSolicitados(listaElement, consultas) {
    const exames = [];
    consultas.forEach(consulta => {
        if (consulta.exames_solicitados && consulta.exames_solicitados.length) {
            consulta.exames_solicitados.forEach(exame => {
                exames.push({
                    ...exame,
                    consulta_id: consulta.id,
                    data_hora: consulta.data_hora
                });
            });
        }
    });

    if (!exames.length) {
        listaElement.innerHTML = '<li class="empty-state">Nenhum exame solicitado.</li>';
        return;
    }

    listaElement.innerHTML = exames.map(exame => `
        <li class="list-item">
            <div><strong>Exame ${exame.exame_id}</strong><span>Consulta ${exame.consulta_id}</span></div>
            <div class="muted">Resultado: ${exame.resultado || "Aguardando"} • Data: ${exame.data_realizacao || "-"}</div>
        </li>
    `).join("");
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
        await carregarFinanceiro(container, paciente.id);
    } catch (error) {
        context.notify("error", error.message);
    }

    container.querySelector("#disponibilidade-form").addEventListener("submit", async event => {
        event.preventDefault();

        const medicoId = Number(container.querySelector("#dispMedico").value);
        const data = container.querySelector("#dispData").value;
        const listaElement = container.querySelector("#listaDisponibilidade");

        try {
            const dados = await requestJson("agendamento", `/consultas/disponibilidade?medico_id=${medicoId}&data=${data}`);
            renderDisponibilidade(listaElement, dados);
        } catch (error) {
            listaElement.innerHTML = `<li class="empty-state error-state">${error.message}</li>`;
        }
    });

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
