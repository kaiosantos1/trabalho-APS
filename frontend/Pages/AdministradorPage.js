import { formatCurrency, formatDate, getStoredPatientsRegistry, getTodayDate, parseCsvList, requestJson } from "./shared.js";
import { administradorPageTemplate } from "../Templates/AdministradorTemplate.js";

function renderPacientes(container, pacientes) {
    const listaElement = container.querySelector("#listaPacientes");

    if (!listaElement) {
        return;
    }

    if (!pacientes.length) {
        listaElement.innerHTML = '<li class="empty-state">Nenhum paciente cadastrado.</li>';
        return;
    }

    listaElement.innerHTML = pacientes.map(paciente => `
        <li class="list-item">
            <div>
                <strong>${paciente.nome || "Sem nome"}</strong>
                <span>ID ${paciente.id}</span>
            </div>
            <div class="muted">CPF ${paciente.cpf || "-"} • Telefone ${Array.isArray(paciente.telefones) && paciente.telefones.length ? paciente.telefones.join(", ") : "-"}</div>
        </li>
    `).join("");
}

function listToHtml(items, emptyMessage, renderer) {
    if (!items.length) {
        return `<li class="empty-state">${emptyMessage}</li>`;
    }

    return items.map(renderer).join("");
}

function renderEspecialidadesSelect(especialidades) {
    return especialidades.map(especialidade => `<option value="${especialidade.id}">${especialidade.nome} (ID ${especialidade.id})</option>`).join("");
}

async function carregarDados(container) {
    const [especialidades, medicos, pendentes, valores, cobrancas, pagamentos, consultorios, escalas, medicamentos, exames] = await Promise.all([
        requestJson("cadastro", "/especialidades"),
        requestJson("cadastro", "/medicos"),
        requestJson("agendamento", "/solicitacoes-cancelamento/pendentes"),
        requestJson("faturamento", "/valores").catch(() => []),
        requestJson("faturamento", "/cobrancas").catch(() => []),
        requestJson("faturamento", "/pagamentos").catch(() => []),
        requestJson("cadastro", "/consultorios").catch(() => []),
        requestJson("agendamento", "/escalas").catch(() => []),
        requestJson("cadastro", "/medicamentos").catch(() => []),
        requestJson("cadastro", "/exames").catch(() => [])
    ]);

    const especialidadeMap = new Map(especialidades.map(item => [item.id, item]));
    const medicoMap = new Map(medicos.map(item => [item.id, item]));

    const medicoLista = container.querySelector("#listaMedicos");
    const especialidadeLista = container.querySelector("#listaEspecialidades");
    const pendenciaLista = container.querySelector("#listaPendencias");
    const valorLista = container.querySelector("#listaValores");
    const cobrancaLista = container.querySelector("#listaCobrancas");
    const pagamentoLista = container.querySelector("#listaPagamentos");
    const consultorioLista = container.querySelector("#listaConsultorios");
    const escalaLista = container.querySelector("#listaEscalas");
    const medicamentoLista = container.querySelector("#listaMedicamentos");
    const exameLista = container.querySelector("#listaExames");
    const especialidadeSelect = container.querySelector("#medicoEspecialidades");
    const escalaMedicoSelect = container.querySelector("#escalaMedico");
    const escalaConsultorioSelect = container.querySelector("#escalaConsultorio");
    const pacientesBackend = await requestJson("cadastro", "/pacientes").catch(() => []);
    const pacientesLocais = getStoredPatientsRegistry();

    especialidadeSelect.innerHTML = renderEspecialidadesSelect(especialidades);
    escalaMedicoSelect.innerHTML = medicos.map(m => `<option value="${m.id}">${m.nome} (ID ${m.id})</option>`).join("");
    escalaConsultorioSelect.innerHTML = consultorios.map(c => `<option value="${c.id}">Sala ${c.numero} / Bloco ${c.bloco} (ID ${c.id})</option>`).join("");

    consultorioLista.innerHTML = listToHtml(consultorios, "Nenhum consultório cadastrado.", consultorio => `
        <li class="list-item">
            <div><strong>Sala ${consultorio.numero} • Bloco ${consultorio.bloco}</strong><span>ID ${consultorio.id}</span></div>
            <div class="muted">Tamanho: ${consultorio.tamanho || "-"}</div>
        </li>
    `);

    escalaLista.innerHTML = listToHtml(escalas, "Nenhuma escala cadastrada.", escala => `
        <li class="list-item">
            <div><strong>${escala.dia_semana} ${escala.hora_inicial}–${escala.hora_final}</strong><span>ID ${escala.id}</span></div>
            <div class="muted">Médico: ${medicoMap.get(escala.medico_id)?.nome || `ID ${escala.medico_id}`} • Consultório ${escala.consultorio_id} • Vigência: ${escala.data_inicio_vigencia}${escala.data_fim_vigencia ? ` a ${escala.data_fim_vigencia}` : ""}</div>
        </li>
    `);

    medicamentoLista.innerHTML = listToHtml(medicamentos, "Nenhum medicamento cadastrado.", medicamento => `
        <li class="list-item">
            <div><strong>${medicamento.nome || "Sem nome"}</strong><span>ID ${medicamento.id}</span></div>
            <div class="muted">${medicamento.indicacao || "Sem indicação"}</div>
        </li>
    `);

    exameLista.innerHTML = listToHtml(exames, "Nenhum exame cadastrado.", exame => `
        <li class="list-item">
            <div><strong>${exame.nome || "Sem nome"}</strong><span>ID ${exame.id}</span></div>
            <div class="muted">${exame.indicacao || "Sem indicação"}</div>
        </li>
    `);

    especialidadeLista.innerHTML = listToHtml(especialidades, "Nenhuma especialidade cadastrada.", especialidade => `
        <li class="list-item">
            <div><strong>${especialidade.nome || "Sem nome"}</strong><span>ID ${especialidade.id}</span></div>
            <div class="muted">${especialidade.descricao || "Sem descrição"}</div>
        </li>
    `);

    medicoLista.innerHTML = listToHtml(medicos, "Nenhum médico cadastrado.", medico => `
        <li class="list-item">
            <div><strong>${medico.nome || "Sem nome"}</strong><span>CRM ${medico.crm || "-"}</span></div>
            <div class="muted">Especialidades: ${(medico.especialidades_ids || []).map(id => especialidadeMap.get(id)?.nome || `ID ${id}`).join(", ") || "-"}</div>
        </li>
    `);

    pendenciaLista.innerHTML = listToHtml(pendentes, "Não há solicitações de cancelamento pendentes.", solicitacao => `
        <li class="list-item pending-item">
            <div>
                <strong>Solicitação ${solicitacao.id}</strong>
                <span>Consulta ${solicitacao.consulta_id}</span>
            </div>
            <div class="card-actions inline-actions">
                <button class="button success" data-action="aprovar" data-id="${solicitacao.id}">Aprovar</button>
                <button class="button danger" data-action="rejeitar" data-id="${solicitacao.id}">Rejeitar</button>
            </div>
        </li>
    `);

    valorLista.innerHTML = listToHtml(valores, "Nenhum valor de consulta cadastrado.", valor => `
        <li class="list-item">
            <div><strong>${formatCurrency(valor.valor)}</strong><span>ID ${valor.id}</span></div>
            <div class="muted">Vigência: ${formatDate(valor.data_vigencia)}</div>
        </li>
    `);

    cobrancaLista.innerHTML = listToHtml(cobrancas, "Nenhuma cobrança emitida.", cobranca => `
        <li class="list-item">
            <div><strong>${formatCurrency(cobranca.valor)}</strong><span>ID ${cobranca.id}</span></div>
            <div class="muted">Emissão: ${formatDate(cobranca.data_emissao)} • Status: ${cobranca.status || "-"}</div>
        </li>
    `);

    pagamentoLista.innerHTML = listToHtml(pagamentos, "Nenhum pagamento registrado.", pagamento => `
        <li class="list-item">
            <div><strong>ID ${pagamento.id}</strong><span>${pagamento.status || "-"}</span></div>
            <div class="muted">Pagamento: ${formatDate(pagamento.data_pagamento)}</div>
        </li>
    `);

    const pacientesMap = new Map();

    [...pacientesBackend, ...pacientesLocais].forEach(paciente => {
        if (!paciente || typeof paciente !== "object") {
            return;
        }

        const chave = paciente.id ?? paciente.cpf ?? paciente.nome;

        if (!pacientesMap.has(chave)) {
            pacientesMap.set(chave, paciente);
        }
    });

    renderPacientes(container, Array.from(pacientesMap.values()).slice().reverse().slice(0, 10));

    return { especialidades, medicos, pendentes };
}

export async function renderAdministradorPage(container, context) {
    const hoje = getTodayDate();

    container.innerHTML = administradorPageTemplate({ hoje });

    const botaoVoltarHome = container.querySelector("#voltar-home-admin");

    if (botaoVoltarHome) {
        botaoVoltarHome.addEventListener("click", () => context.navigateTo("home"));
    }

    let cache = { especialidades: [], medicos: [], pendentes: [] };

    async function atualizarTudo() {
        cache = await carregarDados(container);

        container.querySelectorAll("[data-action]").forEach(button => {
            button.addEventListener("click", async () => {
                const acao = button.dataset.action;
                const id = Number(button.dataset.id);

                try {
                    await requestJson("agendamento", `/solicitacoes-cancelamento/${id}/${acao}`, {
                        method: "PUT"
                    });

                    context.notify("success", `Solicitação ${acao === "aprovar" ? "aprovada" : "rejeitada"}.`);
                    await atualizarTudo();
                } catch (error) {
                    context.notify("error", error.message);
                }
            });
        });
    }

    container.querySelector("#especialidade-form").addEventListener("submit", async event => {
        event.preventDefault();

        try {
            await requestJson("cadastro", "/especialidades", {
                method: "POST",
                body: {
                    nome: container.querySelector("#especialidadeNome").value.trim(),
                    descricao: container.querySelector("#especialidadeDescricao").value.trim() || null
                }
            });

            context.notify("success", "Especialidade cadastrada.");
            event.target.reset();
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#medico-form").addEventListener("submit", async event => {
        event.preventDefault();

        const especialidadesSelecionadas = Array.from(container.querySelector("#medicoEspecialidades").selectedOptions).map(option => Number(option.value));

        try {
            await requestJson("cadastro", "/medicos", {
                method: "POST",
                body: {
                    nome: container.querySelector("#medicoNome").value.trim(),
                    cpf: container.querySelector("#medicoCpf").value.trim() || null,
                    crm: container.querySelector("#medicoCrm").value.trim(),
                    data_nascimento: container.querySelector("#medicoNascimento").value || null,
                    endereco: container.querySelector("#medicoEndereco").value.trim() || null,
                    telefones: parseCsvList(container.querySelector("#medicoTelefones").value),
                    emails: parseCsvList(container.querySelector("#medicoEmails").value),
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

    container.querySelector("#valor-form").addEventListener("submit", async event => {
        event.preventDefault();

        try {
            await requestJson("faturamento", "/valores", {
                method: "POST",
                body: {
                    valor: Number(container.querySelector("#valorConsulta").value),
                    data_vigencia: container.querySelector("#valorVigencia").value
                }
            });

            context.notify("success", "Valor de consulta definido.");
            event.target.reset();
            container.querySelector("#valorVigencia").value = getTodayDate();
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#cobranca-form").addEventListener("submit", async event => {
        event.preventDefault();

        try {
            const consultaCobranca = Number(container.querySelector("#cobrancaConsulta").value);
            const pacienteCobranca = Number(container.querySelector("#cobrancaPaciente").value);

            await requestJson("faturamento", "/cobrancas", {
                method: "POST",
                body: {
                    consulta_id: Number.isFinite(consultaCobranca) && consultaCobranca > 0 ? consultaCobranca : null,
                    paciente_id: Number.isFinite(pacienteCobranca) && pacienteCobranca > 0 ? pacienteCobranca : null,
                    valor: Number(container.querySelector("#cobrancaValor").value),
                    data_emissao: container.querySelector("#cobrancaEmissao").value,
                    status: container.querySelector("#cobrancaStatus").value.trim()
                }
            });

            context.notify("success", "Cobrança emitida.");
            event.target.reset();
            container.querySelector("#cobrancaEmissao").value = getTodayDate();
            container.querySelector("#cobrancaStatus").value = "EMITIDA";
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#pagamento-form").addEventListener("submit", async event => {
        event.preventDefault();

        try {
            const consultaPagamento = Number(container.querySelector("#pagamentoConsulta").value);
            const pacientePagamento = Number(container.querySelector("#pagamentoPaciente").value);
            const valorPagamento = Number(container.querySelector("#pagamentoValor").value);

            await requestJson("faturamento", "/pagamentos", {
                method: "POST",
                body: {
                    consulta_id: Number.isFinite(consultaPagamento) && consultaPagamento > 0 ? consultaPagamento : null,
                    paciente_id: Number.isFinite(pacientePagamento) && pacientePagamento > 0 ? pacientePagamento : null,
                    valor: Number.isFinite(valorPagamento) && valorPagamento > 0 ? valorPagamento : null,
                    data_pagamento: container.querySelector("#pagamentoData").value,
                    status: container.querySelector("#pagamentoStatus").value.trim()
                }
            });

            context.notify("success", "Pagamento registrado.");
            event.target.reset();
            container.querySelector("#pagamentoData").value = getTodayDate();
            container.querySelector("#pagamentoStatus").value = "PAGO";
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#consultorio-form").addEventListener("submit", async event => {
        event.preventDefault();

        try {
            await requestJson("cadastro", "/consultorios", {
                method: "POST",
                body: {
                    numero: container.querySelector("#consultorioNumero").value.trim(),
                    bloco: container.querySelector("#consultorioBloco").value.trim(),
                    tamanho: container.querySelector("#consultorioTamanho").value.trim() || null
                }
            });

            context.notify("success", "Consultório cadastrado.");
            event.target.reset();
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#escala-form").addEventListener("submit", async event => {
        event.preventDefault();

        try {
            await requestJson("agendamento", "/escalas", {
                method: "POST",
                body: {
                    medico_id: Number(container.querySelector("#escalaMedico").value),
                    consultorio_id: Number(container.querySelector("#escalaConsultorio").value),
                    dia_semana: container.querySelector("#escalaDiaSemana").value,
                    data_inicio_vigencia: container.querySelector("#escalaInicioVigencia").value,
                    data_fim_vigencia: container.querySelector("#escalaFimVigencia").value || null,
                    hora_inicial: container.querySelector("#escalaHoraInicial").value,
                    hora_final: container.querySelector("#escalaHoraFinal").value
                }
            });

            context.notify("success", "Escala criada.");
            event.target.reset();
            container.querySelector("#escalaInicioVigencia").value = getTodayDate();
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#medicamento-form").addEventListener("submit", async event => {
        event.preventDefault();

        try {
            await requestJson("cadastro", "/medicamentos", {
                method: "POST",
                body: {
                    nome: container.querySelector("#medicamentoNome").value.trim(),
                    indicacao: container.querySelector("#medicamentoIndicacao").value.trim() || null
                }
            });

            context.notify("success", "Medicamento cadastrado.");
            event.target.reset();
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#exame-cadastro-form").addEventListener("submit", async event => {
        event.preventDefault();

        try {
            await requestJson("cadastro", "/exames", {
                method: "POST",
                body: {
                    nome: container.querySelector("#exameNome").value.trim(),
                    indicacao: container.querySelector("#exameIndicacao").value.trim() || null
                }
            });

            context.notify("success", "Exame cadastrado.");
            event.target.reset();
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    await atualizarTudo();
}
