import { formatCurrency, formatDate, getStoredPatientsRegistry, getTodayDate, parseCsvList, requestJson } from "./shared.js";
import { atendentePageTemplate } from "../Templates/AtendenteTemplate.js";

function listToHtml(items, emptyMessage, renderer) {
    if (!items.length) {
        return `<li class="empty-state">${emptyMessage}</li>`;
    }
    return items.map(renderer).join("");
}

function renderPacientes(container, pacientes) {
    const lista = container.querySelector("#atendentePacientes");
    if (!lista) return;

    if (!pacientes.length) {
        lista.innerHTML = '<li class="empty-state">Nenhum paciente cadastrado.</li>';
        return;
    }

    lista.innerHTML = pacientes.map(paciente => `
        <li class="list-item">
            <div><strong>${paciente.nome || "Sem nome"}</strong><span>ID ${paciente.id}</span></div>
            <div class="muted">CPF ${paciente.cpf || "-"} • Telefone ${(paciente.telefones || []).join(", ") || "-"}</div>
            <div class="card-actions inline-actions">
                <button class="button danger" data-action="deletar-pac" data-id="${paciente.id}">Remover</button>
            </div>
        </li>
    `).join("");
}

async function carregarDados(container) {
    const [medicamentos, exames, cobrancas, pagamentos, pacientesBackend] = await Promise.all([
        requestJson("cadastro", "/medicamentos").catch(() => []),
        requestJson("cadastro", "/exames").catch(() => []),
        requestJson("faturamento", "/cobrancas").catch(() => []),
        requestJson("faturamento", "/pagamentos").catch(() => []),
        requestJson("cadastro", "/pacientes").catch(() => [])
    ]);

    const pacientesLocais = getStoredPatientsRegistry();
    const pacientesMap = new Map();

    [...pacientesBackend, ...pacientesLocais].forEach(paciente => {
        if (!paciente || typeof paciente !== "object") return;
        const chave = paciente.id ?? paciente.cpf ?? paciente.nome;
        if (!pacientesMap.has(chave)) {
            pacientesMap.set(chave, paciente);
        }
    });

    renderPacientes(container, Array.from(pacientesMap.values()).reverse().slice(0, 10));

    container.querySelector("#atendenteExames").innerHTML = listToHtml(exames, "Nenhum exame cadastrado.", exame => `
        <li class="list-item">
            <div><strong>${exame.nome || "Sem nome"}</strong><span>ID ${exame.id}</span></div>
            <div class="muted">${exame.indicacao || "Sem indicação"}</div>
            <div class="card-actions inline-actions">
                <button class="button danger" data-action="deletar-exam" data-id="${exame.id}">Remover</button>
            </div>
        </li>
    `);

    container.querySelector("#atendenteMedicamentos").innerHTML = listToHtml(medicamentos, "Nenhum medicamento cadastrado.", medicamento => `
        <li class="list-item">
            <div><strong>${medicamento.nome || "Sem nome"}</strong><span>ID ${medicamento.id}</span></div>
            <div class="muted">${medicamento.indicacao || "Sem indicação"}</div>
            <div class="card-actions inline-actions">
                <button class="button danger" data-action="deletar-med" data-id="${medicamento.id}">Remover</button>
            </div>
        </li>
    `);

    container.querySelector("#atendenteCobrancas").innerHTML = listToHtml(cobrancas, "Nenhuma cobrança emitida.", cobranca => `
        <li class="list-item">
            <div><strong>${formatCurrency(cobranca.valor)}</strong><span>${cobranca.status || "-"}</span></div>
            <div class="muted">Consulta ${cobranca.consulta_id ?? "-"} • Paciente ${cobranca.paciente_id ?? "-"} • ${formatDate(cobranca.data_emissao)}</div>
        </li>
    `);

    container.querySelector("#atendentePagamentos").innerHTML = listToHtml(pagamentos, "Nenhum pagamento registrado.", pagamento => `
        <li class="list-item">
            <div><strong>${formatCurrency(pagamento.valor || 0)}</strong><span>${pagamento.status || "-"}</span></div>
            <div class="muted">Consulta ${pagamento.consulta_id ?? "-"} • Paciente ${pagamento.paciente_id ?? "-"} • ${formatDate(pagamento.data_pagamento)}</div>
        </li>
    `);

    return { medicamentos, exames, cobrancas, pagamentos, pacientes: Array.from(pacientesMap.values()) };
}

export async function renderAtendentePage(container, context) {
    const hoje = getTodayDate();
    container.innerHTML = atendentePageTemplate({ hoje });

    container.querySelector("#voltar-home-atendente").addEventListener("click", () => context.navigateTo("home"));

    let cache = {};

    async function atualizarTudo() {
        cache = await carregarDados(container);

        container.querySelectorAll("[data-action^='deletar-']").forEach(btn => {
            btn.addEventListener("click", async () => {
                const tipo = btn.dataset.action.split("-")[1];
                const id = btn.dataset.id;
                let path, service;

                if (tipo === "pac") {
                    path = "/pacientes";
                    service = "cadastro";
                } else if (tipo === "exam") {
                    path = "/exames";
                    service = "cadastro";
                } else {
                    path = "/medicamentos";
                    service = "cadastro";
                }

                try {
                    await requestJson(service, `${path}/${id}`, { method: "DELETE" });
                    context.notify("success", "Removido com sucesso.");
                    await atualizarTudo();
                } catch (error) {
                    context.notify("error", error.message);
                }
            });
        });
    }

    container.querySelector("#atendente-paciente-form").addEventListener("submit", async event => {
        event.preventDefault();

        const payload = {
            nome: container.querySelector("#atendentePacienteNome").value.trim(),
            cpf: container.querySelector("#atendentePacienteCpf").value.trim(),
            data_nascimento: container.querySelector("#atendentePacienteNascimento").value || null,
            endereco: container.querySelector("#atendentePacienteEndereco").value.trim() || null,
            telefones: parseCsvList(container.querySelector("#atendentePacienteTelefone").value),
            emails: parseCsvList(container.querySelector("#atendentePacienteEmail").value),
            ativo: true
        };

        try {
            await requestJson("cadastro", "/pacientes", {
                method: "POST",
                body: payload
            });

            context.notify("success", "Paciente cadastrado.");
            event.target.reset();
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#atendente-medicamento-form").addEventListener("submit", async event => {
        event.preventDefault();

        try {
            await requestJson("cadastro", "/medicamentos", {
                method: "POST",
                body: {
                    nome: container.querySelector("#atendenteMedicamentoNome").value.trim(),
                    indicacao: container.querySelector("#atendenteMedicamentoIndicacao").value.trim() || null
                }
            });

            context.notify("success", "Medicamento cadastrado.");
            event.target.reset();
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#atendente-exame-form").addEventListener("submit", async event => {
        event.preventDefault();

        try {
            await requestJson("cadastro", "/exames", {
                method: "POST",
                body: {
                    nome: container.querySelector("#atendenteExameNome").value.trim(),
                    indicacao: container.querySelector("#atendenteExameIndicacao").value.trim() || null
                }
            });

            context.notify("success", "Exame cadastrado.");
            event.target.reset();
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#atendente-pagamento-form").addEventListener("submit", async event => {
        event.preventDefault();

        const consultaPagamento = Number(container.querySelector("#atendentePagamentoConsulta").value);
        const pacientePagamento = Number(container.querySelector("#atendentePagamentoPaciente").value);
        const valorPagamento = Number(container.querySelector("#atendentePagamentoValor").value);

        try {
            await requestJson("faturamento", "/pagamentos", {
                method: "POST",
                body: {
                    consulta_id: Number.isFinite(consultaPagamento) && consultaPagamento > 0 ? consultaPagamento : null,
                    paciente_id: Number.isFinite(pacientePagamento) && pacientePagamento > 0 ? pacientePagamento : null,
                    valor: Number.isFinite(valorPagamento) && valorPagamento > 0 ? valorPagamento : null,
                    data_pagamento: container.querySelector("#atendentePagamentoData").value,
                    status: container.querySelector("#atendentePagamentoStatus").value.trim()
                }
            });

            context.notify("success", "Pagamento registrado.");
            event.target.reset();
            container.querySelector("#atendentePagamentoData").value = getTodayDate();
            container.querySelector("#atendentePagamentoStatus").value = "PAGO";
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    await atualizarTudo();
}
