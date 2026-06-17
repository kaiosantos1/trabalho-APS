export function loginPageTemplate({ pacienteCadastrado }) {
    return `
        <section class="panel-grid two-columns">
            <article class="card callout-card">
                <span class="card-kicker">Administrador</span>
                <h3>Acesso ao painel administrativo</h3>
                <p>Fluxo pensado para aprovar cancelamentos, manter cadastros e operar o faturamento.</p>
                <div class="card-actions">
                    <button class="button primary" id="admin-access">Entrar como administrador</button>
                </div>
            </article>

            <article class="card callout-card accent-card">
                <span class="card-kicker">Paciente</span>
                <h3>${pacienteCadastrado ? "Continuar meus agendamentos" : "Criar cadastro de paciente"}</h3>
                <p>${pacienteCadastrado ? `Cadastro localizado para ${pacienteCadastrado.nome}. Você já pode acessar sua área de consultas.` : "Ainda não encontrei seu cadastro local. Faça o registro para continuar."}</p>
                <div class="card-actions">
                    ${pacienteCadastrado ? '<button class="button primary" id="go-usuario">Ir para meus agendamentos</button>' : '<button class="button primary" id="go-cadastro">Ir para cadastro</button>'}
                    <button class="button ghost" id="go-home">Voltar à página principal</button>
                </div>
            </article>
        </section>
    `;
}
