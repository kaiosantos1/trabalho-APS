import { formatDateTime, getStoredMedico, requestJson, setStoredMedico } from "./shared.js";
import { medicoPageTemplate } from "../Templates/MedicoTemplate.js";

function renderSelectOptions(items, placeholder, labelFn) {
    const base = placeholder ? `<option value="">${placeholder}</option>` : "";
    return base + items.map(item => `<option value="${item.id}">${labelFn(item)}</option>`).join("");
}

function renderEscalas(listaElement, escalas) {
    if (!escalas.length) {
        listaElement.innerHTML = '<li class="empty-state">Nenhuma escala cadastrada para este médico.</li>';
        return;
    }

    listaElement.innerHTML = escalas.map(escala => `
        <li class="list-item">
            <div>
                <strong>${escala.dia_semana} ${escala.hora_inicial}–${escala.hora_final}</strong>
                <span>Escala ${escala.id}</span>
            </div>
            <div class="muted">
                Consultório ${escala.consultorio_id} • Vigência: ${escala.data_inicio_vigencia}${escala.data_fim_vigencia ? ` a ${escala.data_fim_vigencia}` : " (sem término)"}
            </div>
        </li>
    `).join("");
}

function renderConsultas(listaElement, consultas) {
    if (!consultas.length) {
        listaElement.innerHTML = '<li class="empty-state">Nenhuma consulta atribuída a este médico.</li>';
        return;
    }

    listaElement.innerHTML = consultas.map(consulta => {
        const exames = consulta.exames_solicitados || [];
        const examesHtml = exames.length
            ? `<ul class="list sub-list">` + exames.map(ex => `
                <li class="list-item">
                    <div class="muted"><strong>Exame solicitado #${ex.id}</strong> — exame ${ex.exame_id} — ${ex.resultado ? "resultado registrado" : "aguardando resultado"}</div>
                    ${ex.resultado ? "" : `<div class="card-actions inline-actions"><button class="button ghost" data-exame-consulta="${consulta.id}" data-exame-id="${ex.id}">Registrar resultado deste exame</button></div>`}
                </li>`).join("") + `</ul>`
            : '<div class="muted">Nenhum exame solicitado.</div>';

        const acoes = [];
        if (consulta.estado === "AGENDADA") {
            acoes.push(`<button class="button success" data-iniciar="${consulta.id}">Iniciar consulta</button>`);
        }
        acoes.push(`<button class="button ghost" data-selecionar="${consulta.id}">Usar nos formulários</button>`);

        return `
            <li class="list-item consultation-item">
                <div>
                    <strong>Consulta #${consulta.id}</strong>
                    <span>${formatDateTime(consulta.data_hora)}</span>
                </div>
                <div class="muted">
                    Paciente ${consulta.paciente_id} • Estado: <strong>${consulta.estado}</strong> •
                    Prescrições: ${(consulta.prescricoes || []).length}
                </div>
                ${examesHtml}
                <div class="card-actions inline-actions">${acoes.join("")}</div>
            </li>
        `;
    }).join("");
}

export async function renderMedicoPage(container, context) {
    container.innerHTML = medicoPageTemplate({ medico: getStoredMedico() });

    container.querySelector("#voltar-home-medico").addEventListener("click", () => context.navigateTo("home"));

    const medicoSelect = container.querySelector("#medicoSelect");
    const escalasLista = container.querySelector("#listaEscalasMedico");
    const consultasLista = container.querySelector("#listaConsultasMedico");

    let medicos = [];
    let medicamentos = [];
    let exames = [];

    try {
        [medicos, medicamentos, exames] = await Promise.all([
            requestJson("cadastro", "/medicos"),
            requestJson("cadastro", "/medicamentos").catch(() => []),
            requestJson("cadastro", "/exames").catch(() => [])
        ]);
    } catch (error) {
        context.notify("error", error.message);
    }

    medicoSelect.innerHTML = renderSelectOptions(medicos, "Selecione o médico", m => `${m.nome} (CRM ${m.crm || "-"})`);
    container.querySelector("#prescricaoMedicamento").innerHTML = renderSelectOptions(medicamentos, "Selecione o medicamento", m => m.nome || `Medicamento ${m.id}`);
    container.querySelector("#exameSelect").innerHTML = renderSelectOptions(exames, "Selecione o exame", e => e.nome || `Exame ${e.id}`);

    const armazenado = getStoredMedico();
    if (armazenado && medicos.some(m => m.id === armazenado.id)) {
        medicoSelect.value = String(armazenado.id);
    }

    async function carregarDadosMedico() {
        const medicoId = Number(medicoSelect.value);

        if (!Number.isFinite(medicoId) || medicoId <= 0) {
            escalasLista.innerHTML = '<li class="empty-state">Selecione um médico para ver as escalas.</li>';
            consultasLista.innerHTML = '<li class="empty-state">Selecione um médico para ver as consultas.</li>';
            return;
        }

        const medico = medicos.find(m => m.id === medicoId);
        if (medico) {
            setStoredMedico(medico);
        }

        try {
            const [escalas, consultas] = await Promise.all([
                requestJson("agendamento", `/escalas?medico_id=${medicoId}`),
                requestJson("agendamento", `/consultas?medico_id=${medicoId}`)
            ]);
            renderEscalas(escalasLista, escalas);
            renderConsultas(consultasLista, consultas);
        } catch (error) {
            context.notify("error", error.message);
        }
    }

    medicoSelect.addEventListener("change", carregarDadosMedico);

    consultasLista.addEventListener("click", async event => {
        const iniciarBtn = event.target.closest("[data-iniciar]");
        const selecionarBtn = event.target.closest("[data-selecionar]");
        const exameBtn = event.target.closest("[data-exame-id]");

        // Preenche os 4 formulários com o ID da consulta escolhida.
        if (selecionarBtn) {
            const id = selecionarBtn.dataset.selecionar;
            ["#finalizarConsultaId", "#prescricaoConsultaId", "#exameConsultaId", "#resultadoConsultaId"]
                .forEach(sel => { const campo = container.querySelector(sel); if (campo) campo.value = id; });
            context.notify("info", `Consulta #${id} selecionada nos formulários.`);
            return;
        }

        // Preenche o formulário de resultado com a consulta + exame escolhidos.
        if (exameBtn) {
            container.querySelector("#resultadoConsultaId").value = exameBtn.dataset.exameConsulta;
            container.querySelector("#resultadoExameId").value = exameBtn.dataset.exameId;
            container.querySelector("#resultadoTexto").focus();
            context.notify("info", "Campos do resultado preenchidos. Informe o resultado.");
            return;
        }

        if (iniciarBtn) {
            try {
                await requestJson("agendamento", `/consultas/${iniciarBtn.dataset.iniciar}/iniciar`, { method: "PUT" });
                context.notify("success", "Consulta iniciada (EM_ANDAMENTO).");
                await carregarDadosMedico();
            } catch (error) {
                context.notify("error", error.message);
            }
        }
    });

    container.querySelector("#finalizar-form").addEventListener("submit", async event => {
        event.preventDefault();
        const consultaId = Number(container.querySelector("#finalizarConsultaId").value);

        try {
            await requestJson("agendamento", `/consultas/${consultaId}/finalizar`, {
                method: "PUT",
                body: { descricao_estado_geral: container.querySelector("#finalizarDescricao").value.trim() }
            });
            context.notify("success", "Consulta encerrada e cobrança emitida.");
            event.target.reset();
            await carregarDadosMedico();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#prescricao-form").addEventListener("submit", async event => {
        event.preventDefault();
        const consultaId = Number(container.querySelector("#prescricaoConsultaId").value);

        try {
            await requestJson("agendamento", `/consultas/${consultaId}/prescricoes`, {
                method: "POST",
                body: {
                    medicamento_id: Number(container.querySelector("#prescricaoMedicamento").value),
                    dose: container.querySelector("#prescricaoDose").value.trim(),
                    posologia: container.querySelector("#prescricaoPosologia").value.trim()
                }
            });
            context.notify("success", "Prescrição registrada.");
            event.target.reset();
            await carregarDadosMedico();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#exame-form").addEventListener("submit", async event => {
        event.preventDefault();
        const consultaId = Number(container.querySelector("#exameConsultaId").value);

        try {
            await requestJson("agendamento", `/consultas/${consultaId}/exames-solicitados`, {
                method: "POST",
                body: { exame_id: Number(container.querySelector("#exameSelect").value) }
            });
            context.notify("success", "Exame solicitado.");
            event.target.reset();
            await carregarDadosMedico();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#resultado-form").addEventListener("submit", async event => {
        event.preventDefault();
        const consultaId = Number(container.querySelector("#resultadoConsultaId").value);

        try {
            await requestJson("agendamento", `/consultas/${consultaId}/resultados-exames`, {
                method: "POST",
                body: {
                    exame_solicitado_id: Number(container.querySelector("#resultadoExameId").value),
                    resultado: container.querySelector("#resultadoTexto").value.trim()
                }
            });
            context.notify("success", "Resultado registrado.");
            event.target.reset();
            await carregarDadosMedico();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    await carregarDadosMedico();
}
