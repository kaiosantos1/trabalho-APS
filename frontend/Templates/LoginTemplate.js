export function loginPageTemplate({ pacienteCadastrado }) {
    return `
        <section class="page-hero">
            <div>
                <p class="eyebrow">Login</p>
                <h2>Sistema APS Health</h2>
                <p class="page-lead">Selecione o tipo de acesso, informe seu usuário e senha para entrar.</p>
            </div>
            <div class="hero-badge">Controle de acesso por perfil</div>
        </section>

        <section class="panel-grid two-columns">
            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Acesso</span>
                        <h3>Entrar no sistema</h3>
                    </div>
                </div>

                <form id="login-form" class="form-grid">
                    <label class="field full-width">
                        <span>Tipo de acesso</span>
                        <select id="loginPerfil" required>
                            <option value="diretor">Diretor</option>
                            <option value="gerente">Gerente</option>
                            <option value="atendente">Atendente</option>
                            <option value="medico">Médico</option>
                            <option value="paciente">Paciente</option>
                        </select>
                    </label>

                    <label class="field full-width">
                        <span>Usuário</span>
                        <input id="loginUsuario" type="text" placeholder="nome de usuário" autocomplete="username" required>
                    </label>

                    <label class="field full-width">
                        <span>Senha</span>
                        <input id="loginSenha" type="password" placeholder="senha" autocomplete="current-password" required>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Entrar</button>
                    </div>
                </form>

                <p class="muted" style="margin-top: 12px;">
                    Ainda não é paciente?
                    <button class="button ghost" id="go-cadastro" type="button">Criar cadastro</button>
                </p>
            </article>

            <article class="card info-card">
                <span class="card-kicker">Credenciais de teste</span>
                <h3>Usuários padrão</h3>
                <p class="muted">Use estas credenciais administrativas (criadas automaticamente):</p>
                <ul class="list">
                    <li class="list-item"><div><strong>Diretor</strong><span>diretor / diretor123</span></div></li>
                    <li class="list-item"><div><strong>Gerente</strong><span>gerente / gerente123</span></div></li>
                    <li class="list-item"><div><strong>Atendente</strong><span>atendente / atendente123</span></div></li>
                    <li class="list-item"><div><strong>Médico</strong><span>medico / medico123</span></div></li>
                </ul>
                <p class="muted">${pacienteCadastrado ? `Último paciente neste navegador: ${pacienteCadastrado.nome}.` : "Pacientes criam o próprio usuário no cadastro."}</p>
            </article>
        </section>

        <section class="card-actions hero-actions">
            <button class="button ghost" id="go-home">Voltar à página principal</button>
        </section>
    `;
}
