import { getTodayDate, parseCsvList, requestJson } from "./shared.js";
import { gerentePageTemplate } from "../Templates/GerenteTemplate.js";

function listToHtml(items, emptyMessage, renderer) {
    if (!items.length) {
        return `<li class="empty-state">${emptyMessage}</li>`;
    }
    return items.map(renderer).join("");
}

async function carregarDados(container) {
    const [medicos, especialidades, escalas, consultorio, pendentes] = await Promise.all([
        requestJson("cadastro", "/medicos").catch(() => []),
        requestJson("cadastro", "/especialidades").catch(() => []),
        requestJson("agendamento", "/escalas").catch(() => []),
        requestJson("cadastro", "/consultorios").catch(() => []),
        requestJson("agendamento", "/solicitacoes-cancelamento/pendentes").catch(() => [])
    ]);

    const especialidadeMap = new Map(especialidades.map(e => [e.id, e]));
    const consultorioMap = new Map(consultorio.map(c => [c.id, c]));

    container.querySelector("#gerenteMedicos").innerHTML = listToHtml(medicos, "Nenhum médico cadastrado.", medico => `
        <li class="list-item">
            <div><strong>${medico.nome}</strong><span>CRM ${medico.crm || "-"}</span></div>
            <div class="muted">Especialidades: ${(medico.especialidades_ids || []).map(id => especialidadeMap.get(id)?.nome || `ID ${id}`).join(", ") || "-"}</div>
            <div class="card-actions inline-actions">
                <button class="button danger" data-action="deletar-med" data-id="${medico.id}">Remover</button>
            </div>
        </li>
    `);

    container.querySelector("#gerenteEscalas").innerHTML = listToHtml(escalas, "Nenhuma escala cadastrada.", escala => `
        <li class="list-item">
            <div><strong>${escala.dia_semana} ${escala.hora_inicial}–${escala.hora_final}</strong><span>ID ${escala.id}</span></div>
            <div class="muted">Médico ${escala.medico_id} • Consultório ${consultorioMap.get(escala.consultorio_id)?.numero || escala.consultorio_id}</div>
            <div class="card-actions inline-actions">
                <button class="button danger" data-action="deletar-esc" data-id="${escala.id}">Remover</button>
            </div>
        </li>
    `);

    container.querySelector("#gerentePendencias").innerHTML = listToHtml(pendentes, "Não há solicitações de cancelamento pendentes.", solicitacao => `
        <li class="list-item pending-item">
            <div><strong>Solicitação ${solicitacao.id}</strong><span>Consulta ${solicitacao.consulta_id}</span></div>
            <div class="card-actions inline-actions">
                <button class="button success" data-action="aprovar" data-id="${solicitacao.id}">Aprovar</button>
                <button class="button danger" data-action="rejeitar" data-id="${solicitacao.id}">Rejeitar</button>
            </div>
        </li>
    `);

    container.querySelector("#gerenteMedicoSelect").innerHTML = medicos.map(m => `<option value="${m.id}">${m.nome} (ID ${m.id})</option>`).join("");
    container.querySelector("#gerenteConsultorioSelect").innerHTML = consultorio.map(c => `<option value="${c.id}">Sala ${c.numero} / Bloco ${c.bloco} (ID ${c.id})</option>`).join("");

    return { medicos, especialidades, escalas, consultorio, pendentes };
}

export async function renderGerentePage(container, context) {
    const hoje = getTodayDate();
    container.innerHTML = gerentePageTemplate({ hoje });

    container.querySelector("#voltar-home-gerente").addEventListener("click", () => context.navigateTo("home"));

    let cache = {};

    async function atualizarTudo() {
        cache = await carregarDados(container);

        container.querySelectorAll("[data-action^='deletar-']").forEach(btn => {
            btn.addEventListener("click", async () => {
                const tipo = btn.dataset.action.split("-")[1];
                const id = btn.dataset.id;
                const path = tipo === "med" ? "/medicos" : "/escalas";

                try {
                    await requestJson(tipo === "med" ? "cadastro" : "agendamento", `${path}/${id}`, { method: "DELETE" });
                    context.notify("success", "Removido com sucesso.");
                    await atualizarTudo();
                } catch (error) {
                    context.notify("error", error.message);
                }
            });
        });

        container.querySelectorAll("[data-action='aprovar'], [data-action='rejeitar']").forEach(btn => {
            btn.addEventListener("click", async () => {
                const acao = btn.dataset.action;
                const id = Number(btn.dataset.id);

                try {
                    await requestJson("agendamento", `/solicitacoes-cancelamento/${id}/${acao}`, { method: "PUT" });
                    context.notify("success", `Solicitação ${acao}da.`);
                    await atualizarTudo();
                } catch (error) {
                    context.notify("error", error.message);
                }
            });
        });
    }

    container.querySelector("#gerente-medico-form").addEventListener("submit", async event => {
        event.preventDefault();

        const especialidadesSelecionadas = Array.from(container.querySelector("#gerenteMedicoEspecialidades").selectedOptions).map(o => Number(o.value));

        try {
            await requestJson("cadastro", "/medicos", {
                method: "POST",
                body: {
                    nome: container.querySelector("#gerenteMedicoNome").value.trim(),
                    cpf: container.querySelector("#gerenteMedicoCpf").value.trim() || null,
                    crm: container.querySelector("#gerenteMedicoCrm").value.trim(),
                    data_nascimento: container.querySelector("#gerenteMedicoNascimento").value || null,
                    endereco: container.querySelector("#gerenteMedicoEndereco").value.trim() || null,
                    telefones: parseCsvList(container.querySelector("#gerenteMedicoTelefones").value),
                    emails: parseCsvList(container.querySelector("#gerenteMedicoEmails").value),
                    especialidades_ids: especialidadesSelecionadas
                }
            });

            context.notify("success", "Médico cadastrado.");
            event.target.reset();
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#gerente-escala-form").addEventListener("submit", async event => {
        event.preventDefault();

        try {
            await requestJson("agendamento", "/escalas", {
                method: "POST",
                body: {
                    medico_id: Number(container.querySelector("#gerenteMedicoSelect").value),
                    consultorio_id: Number(container.querySelector("#gerenteConsultorioSelect").value),
                    dia_semana: container.querySelector("#gerenteDiaSemana").value,
                    data_inicio_vigencia: container.querySelector("#gerenteInicioVigencia").value,
                    data_fim_vigencia: container.querySelector("#gerenteFimVigencia").value || null,
                    hora_inicial: container.querySelector("#gerenteHoraInicial").value,
                    hora_final: container.querySelector("#gerenteHoraFinal").value
                }
            });

            context.notify("success", "Escala criada.");
            event.target.reset();
            container.querySelector("#gerenteInicioVigencia").value = getTodayDate();
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    await atualizarTudo();
}
