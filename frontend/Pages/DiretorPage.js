import { formatCurrency, formatDate, getTodayDate, parseCsvList, requestJson } from "./shared.js";
import { diretorPageTemplate } from "../Templates/DiretorTemplate.js";

function listToHtml(items, emptyMessage, renderer) {
    if (!items.length) {
        return `<li class="empty-state">${emptyMessage}</li>`;
    }
    return items.map(renderer).join("");
}

async function carregarDados(container) {
    const [especialidades, consultorios, valores] = await Promise.all([
        requestJson("cadastro", "/especialidades").catch(() => []),
        requestJson("cadastro", "/consultorios").catch(() => []),
        requestJson("faturamento", "/valores").catch(() => [])
    ]);

    const especialidadeLista = container.querySelector("#diretorEspecialidades");
    const consultorioLista = container.querySelector("#diretorConsultorios");
    const valorLista = container.querySelector("#diretorValores");
    const especialidadeSelect = container.querySelector("#diretorEspecialidadeSelect");

    if (especialidadeSelect) {
        especialidadeSelect.innerHTML = especialidades.map(e => `<option value="${e.id}">${e.nome} (ID ${e.id})</option>`).join("");
    }

    especialidadeLista.innerHTML = listToHtml(especialidades, "Nenhuma especialidade cadastrada.", especialidade => `
        <li class="list-item">
            <div><strong>${especialidade.nome}</strong><span>ID ${especialidade.id}</span></div>
            <div class="muted">${especialidade.descricao || "Sem descrição"}</div>
            <div class="card-actions inline-actions">
                <button class="button danger" data-action="deletar-esp" data-id="${especialidade.id}">Remover</button>
            </div>
        </li>
    `);

    consultorioLista.innerHTML = listToHtml(consultorios, "Nenhum consultório cadastrado.", consultorio => `
        <li class="list-item">
            <div><strong>Sala ${consultorio.numero} • Bloco ${consultorio.bloco}</strong><span>ID ${consultorio.id}</span></div>
            <div class="muted">Tamanho: ${consultorio.tamanho || "-"}</div>
            <div class="card-actions inline-actions">
                <button class="button danger" data-action="deletar-cons" data-id="${consultorio.id}">Remover</button>
            </div>
        </li>
    `);

    valorLista.innerHTML = listToHtml(valores, "Nenhum valor de consulta cadastrado.", valor => `
        <li class="list-item">
            <div><strong>${formatCurrency(valor.valor)}</strong><span>ID ${valor.id}</span></div>
            <div class="muted">Vigência: ${formatDate(valor.data_vigencia)}</div>
        </li>
    `);

    return { especialidades, consultorios, valores };
}

export async function renderDiretorPage(container, context) {
    const hoje = getTodayDate();
    container.innerHTML = diretorPageTemplate({ hoje });

    container.querySelector("#voltar-home-diretor").addEventListener("click", () => context.navigateTo("home"));

    let cache = { especialidades: [], consultorios: [], valores: [] };

    async function atualizarTudo() {
        cache = await carregarDados(container);

        // Deletar
        container.querySelectorAll("[data-action^='deletar-']").forEach(btn => {
            btn.addEventListener("click", async () => {
                const tipo = btn.dataset.action.split("-")[1];
                const id = btn.dataset.id;
                const path = tipo === "esp" ? "/especialidades" : "/consultorios";

                try {
                    await requestJson("cadastro", `${path}/${id}`, { method: "DELETE" });
                    context.notify("success", "Removido com sucesso.");
                    await atualizarTudo();
                } catch (error) {
                    context.notify("error", error.message);
                }
            });
        });
    }

    container.querySelector("#diretor-especialidade-form").addEventListener("submit", async event => {
        event.preventDefault();

        try {
            await requestJson("cadastro", "/especialidades", {
                method: "POST",
                body: {
                    nome: container.querySelector("#diretorEspNome").value.trim(),
                    descricao: container.querySelector("#diretorEspDescricao").value.trim() || null
                }
            });

            context.notify("success", "Especialidade cadastrada.");
            event.target.reset();
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#diretor-consultorio-form").addEventListener("submit", async event => {
        event.preventDefault();

        try {
            await requestJson("cadastro", "/consultorios", {
                method: "POST",
                body: {
                    numero: container.querySelector("#diretorConsNumero").value.trim(),
                    bloco: container.querySelector("#diretorConsBloco").value.trim(),
                    tamanho: container.querySelector("#diretorConsTamanho").value.trim() || null
                }
            });

            context.notify("success", "Consultório cadastrado.");
            event.target.reset();
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    container.querySelector("#diretor-valor-form").addEventListener("submit", async event => {
        event.preventDefault();

        try {
            await requestJson("faturamento", "/valores", {
                method: "POST",
                body: {
                    valor: Number(container.querySelector("#diretorValorConsulta").value),
                    data_vigencia: container.querySelector("#diretorValorVigencia").value
                }
            });

            context.notify("success", "Valor de consulta definido.");
            event.target.reset();
            container.querySelector("#diretorValorVigencia").value = getTodayDate();
            await atualizarTudo();
        } catch (error) {
            context.notify("error", error.message);
        }
    });

    await atualizarTudo();
}
