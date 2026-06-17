export function loginPageTemplate({ pacienteCadastrado }) {
    return `
        <section class="page-hero">
            <div>
                <p class="eyebrow">Login</p>
                <h2>Sistema APS Health</h2>
                <p class="page-lead">Escolha o seu perfil de acesso para continuar.</p>
            </div>
            <div class="hero-badge">5 Perfis • Cadastro • Agendamento • Faturamento</div>
        </section>

        <section class="panel-grid">
            <article class="card callout-card">
                <span class="card-kicker">Administração</span>
                <h3>Diretor</h3>
                <p>Gestão de políticas clínicas: especialidades, consultórios e valores de consulta.</p>
                <div class="card-actions">
                    <button class="button primary" id="diretor-access">Entrar como diretor</button>
                </div>
            </article>

            <article class="card callout-card">
                <span class="card-kicker">Administração</span>
                <h3>Gerente</h3>
                <p>Gestão operacional: médicos, escalas e análise de cancelamentos.</p>
                <div class="card-actions">
                    <button class="button primary" id="gerente-access">Entrar como gerente</button>
                </div>
            </article>

            <article class="card callout-card">
                <span class="card-kicker">Administração</span>
                <h3>Atendente</h3>
                <p>Operações clínicas: pacientes, medicamentos, exames e pagamentos.</p>
                <div class="card-actions">
                    <button class="button primary" id="atendente-access">Entrar como atendente</button>
                </div>
            </article>

            <article class="card callout-card">
                <span class="card-kicker">Clínico</span>
                <h3>Médico</h3>
                <p>Atendimento clínico: consultas, prescrições e exames.</p>
                <div class="card-actions">
                    <button class="button primary" id="medico-access">Entrar como médico</button>
                </div>
            </article>

            <article class="card callout-card accent-card">
                <span class="card-kicker">Usuário</span>
                <h3>${pacienteCadastrado ? "Continuar agendamentos" : "Paciente"}</h3>
                <p>${pacienteCadastrado ? `Bem-vindo, ${pacienteCadastrado.nome}. Acesse sua área de consultas.` : "Agende, reagende e acompanhe suas consultas."}</p>
                <div class="card-actions">
                    ${pacienteCadastrado ? '<button class="button primary" id="go-usuario">Acessar minha área</button>' : '<button class="button primary" id="go-cadastro">Fazer cadastro</button>'}
                </div>
            </article>
        </section>

        <section class="card-actions hero-actions">
            <button class="button ghost" id="go-home">Voltar à página principal</button>
        </section>
    `;
}
