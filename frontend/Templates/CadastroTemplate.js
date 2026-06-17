export function cadastroPageTemplate({ pacienteAtual }) {
    return `
        <section class="page-hero">
            <div>
                <p class="eyebrow">Cadastro</p>
                <h2>Crie seu cadastro de paciente</h2>
                <p class="page-lead">Os dados são enviados para o Cadastro Service e ficam prontos para o fluxo de agendamento.</p>
            </div>
            <div class="hero-badge">Pacientes, médicos e especialidades no backend</div>
        </section>

        <section class="panel-grid one-column">
            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Novo paciente</span>
                        <h3>Formulário de registro</h3>
                    </div>
                    <div class="pill">Cadastro Service</div>
                </div>

                <form id="cadastro-form" class="form-grid">
                    <label class="field">
                        <span>Nome</span>
                        <input id="pacienteNome" type="text" placeholder="Nome completo" required>
                    </label>

                    <label class="field">
                        <span>CPF</span>
                        <input id="pacienteCpf" type="text" placeholder="00000000000" required>
                    </label>

                    <label class="field">
                        <span>Data de nascimento</span>
                        <input id="pacienteNascimento" type="date">
                    </label>

                    <label class="field full-width">
                        <span>Endereço</span>
                        <input id="pacienteEndereco" type="text" placeholder="Rua, número, bairro">
                    </label>

                    <label class="field">
                        <span>Telefone(s)</span>
                        <input id="pacienteTelefone" type="text" placeholder="21999999999, 21988888888">
                    </label>

                    <label class="field">
                        <span>E-mail(s)</span>
                        <input id="pacienteEmail" type="email" placeholder="email@exemplo.com">
                    </label>

                    <label class="field">
                        <span>Usuário de acesso</span>
                        <input id="pacienteUsuario" type="text" placeholder="nome de usuário" autocomplete="username" required>
                    </label>

                    <label class="field">
                        <span>Senha</span>
                        <input id="pacienteSenha" type="password" placeholder="crie uma senha" autocomplete="new-password" required>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Salvar cadastro</button>
                        <button class="button ghost" type="button" id="voltar-login">Voltar ao login</button>
                    </div>
                </form>
            </article>
        </section>
    `;
}
