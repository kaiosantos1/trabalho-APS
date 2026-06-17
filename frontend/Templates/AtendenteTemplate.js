export function atendentePageTemplate({ hoje }) {
    return `
        <section class="page-hero">
            <div>
                <p class="eyebrow">Atendente</p>
                <h2>Operações clínicas</h2>
                <p class="page-lead">Pacientes, medicamentos, exames e pagamentos.</p>
            </div>
            <div class="hero-side">
                <div class="hero-badge">Cadastro + Faturamento</div>
                <div class="card-actions hero-actions">
                    <button class="button ghost" id="voltar-home-atendente">Voltar</button>
                </div>
            </div>
        </section>

        <section class="panel-grid two-columns">
            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Cadastro Service</span>
                        <h3>Pacientes</h3>
                    </div>
                </div>

                <form id="atendente-paciente-form" class="form-grid">
                    <label class="field">
                        <span>Nome</span>
                        <input id="atendentePacienteNome" type="text" required>
                    </label>

                    <label class="field">
                        <span>CPF</span>
                        <input id="atendentePacienteCpf" type="text" required>
                    </label>

                    <label class="field">
                        <span>Data de nascimento</span>
                        <input id="atendentePacienteNascimento" type="date">
                    </label>

                    <label class="field full-width">
                        <span>Endereço</span>
                        <input id="atendentePacienteEndereco" type="text">
                    </label>

                    <label class="field">
                        <span>Telefone(s)</span>
                        <input id="atendentePacienteTelefone" type="text" placeholder="21999999999">
                    </label>

                    <label class="field">
                        <span>E-mail(s)</span>
                        <input id="atendentePacienteEmail" type="email">
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Cadastrar</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Pacientes recentes</h4>
                    <ul id="atendentePacientes" class="list"></ul>
                </div>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Cadastro Service</span>
                        <h3>Medicamentos</h3>
                    </div>
                </div>

                <form id="atendente-medicamento-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>Nome</span>
                        <input id="atendenteMedicamentoNome" type="text" required>
                    </label>

                    <label class="field full-width">
                        <span>Indicação</span>
                        <input id="atendenteMedicamentoIndicacao" type="text">
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Cadastrar</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Medicamentos</h4>
                    <ul id="atendenteMedicamentos" class="list"></ul>
                </div>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Cadastro Service</span>
                        <h3>Exames</h3>
                    </div>
                </div>

                <form id="atendente-exame-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>Nome</span>
                        <input id="atendenteExameNome" type="text" required>
                    </label>

                    <label class="field full-width">
                        <span>Indicação</span>
                        <input id="atendenteExameIndicacao" type="text">
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Cadastrar</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Exames</h4>
                    <ul id="atendenteExames" class="list"></ul>
                </div>
            </article>
        </section>

        <section class="panel-grid two-columns">
            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Faturamento Service</span>
                        <h3>Pagamentos</h3>
                    </div>
                </div>

                <form id="atendente-pagamento-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>ID Consulta</span>
                        <input id="atendentePagamentoConsulta" type="number" min="1">
                    </label>

                    <label class="field">
                        <span>ID Paciente</span>
                        <input id="atendentePagamentoPaciente" type="number" min="1">
                    </label>

                    <label class="field">
                        <span>Valor</span>
                        <input id="atendentePagamentoValor" type="number" min="0" step="0.01">
                    </label>

                    <label class="field">
                        <span>Data</span>
                        <input id="atendentePagamentoData" type="date" value="${hoje}" required>
                    </label>

                    <label class="field">
                        <span>Status</span>
                        <input id="atendentePagamentoStatus" type="text" value="PAGO" required>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Registrar</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Pagamentos</h4>
                    <ul id="atendentePagamentos" class="list"></ul>
                </div>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Faturamento Service</span>
                        <h3>Cobranças</h3>
                    </div>
                </div>

                <div class="list-panel">
                    <ul id="atendenteCobrancas" class="list"></ul>
                </div>
            </article>
        </section>
    `;
}
