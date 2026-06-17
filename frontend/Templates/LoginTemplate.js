export function loginPageTemplate({ pacienteCadastrado }) {
    return `
        <section class="page-hero">
            <div>
                <p class="eyebrow">Login</p>
                <h2>Escolha o seu perfil de acesso</h2>
                <p class="page-lead">O sistema separa as funcionalidades por perfil de usuário, conforme as regras da clínica APS Health.</p>
            </div>
            <div class="hero-badge">Diretor • Gerente • Atendente • Médico • Paciente</div>
        </section>

        <section class="panel-grid three-columns">
            <article class="card callout-card">
                <span class="card-kicker">Administração</span>
                <h3>Diretor · Gerente · Atendente</h3>
                <p>Mantém especialidades, consultórios, médicos, medicamentos e exames; gerencia escalas, aprova cancelamentos e opera o faturamento.</p>
                <div class="card-actions">
                    <button class="button primary" id="admin-access">Entrar na administração</button>
                </div>
            </article>

            <article class="card callout-card">
                <span class="card-kicker">Médico</span>
                <h3>Atendimento clínico</h3>
                <p>Consulta suas escalas, realiza consultas (início e encerramento), prescreve medicamentos, solicita exames e registra resultados.</p>
                <div class="card-actions">
                    <button class="button primary" id="medico-access">Entrar como médico</button>
                </div>
            </article>

            <article class="card callout-card accent-card">
                <span class="card-kicker">Paciente</span>
                <h3>${pacienteCadastrado ? "Continuar meus agendamentos" : "Criar cadastro de paciente"}</h3>
                <p>${pacienteCadastrado ? `Cadastro localizado para ${pacienteCadastrado.nome}. Você já pode acessar sua área de consultas.` : "Ainda não encontrei seu cadastro local. Faça o registro para continuar."}</p>
                <div class="card-actions">
                    ${pacienteCadastrado ? '<button class="button primary" id="go-usuario">Ir para meus agendamentos</button>' : '<button class="button primary" id="go-cadastro">Ir para cadastro</button>'}
                </div>
            </article>
        </section>

        <section class="card-actions hero-actions">
            <button class="button ghost" id="go-home">Voltar à página principal</button>
        </section>
    `;
}
