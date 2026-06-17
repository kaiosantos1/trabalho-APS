export function usuarioSemCadastroTemplate() {
    return `
        <section class="card empty-landing">
            <span class="card-kicker">Usuário</span>
            <h2>Nenhum cadastro encontrado</h2>
            <p>Faça seu cadastro para agendar consultas, reagendar horários e solicitar cancelamentos.</p>
            <div class="card-actions">
                <button class="button primary" id="ir-home">Voltar à página principal</button>
            </div>
        </section>
    `;
}

export function usuarioPageTemplate({ paciente }) {
    return `
        <section class="page-hero">
            <div>
                <p class="eyebrow">Usuário</p>
                <h2>Área do paciente</h2>
                <p class="page-lead">Agende, reagende e acompanhe as suas consultas com base no cadastro já criado no serviço de pacientes.</p>
            </div>
            <div class="hero-side">
                <div class="hero-badge">Paciente ${paciente.nome} • ID ${paciente.id}</div>
                <div class="card-actions hero-actions">
                    <button class="button ghost" id="voltar-home-usuario">Voltar à página principal</button>
                </div>
            </div>
        </section>

        <section class="panel-grid two-columns">
            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Agendamento</span>
                        <h3>Marcar consulta</h3>
                    </div>
                    <div class="pill">Agendamento Service</div>
                </div>

                <form id="consulta-form" class="form-grid">
                    <label class="field">
                        <span>Paciente</span>
                        <input value="${paciente.nome} (ID ${paciente.id})" disabled>
                    </label>

                    <label class="field">
                        <span>Médico</span>
                        <select id="consultaMedico" required></select>
                    </label>

                    <label class="field">
                        <span>Especialidade</span>
                        <select id="consultaEspecialidade" required></select>
                    </label>

                    <label class="field">
                        <span>Data</span>
                        <input id="consultaData" type="date" required>
                    </label>

                    <label class="field">
                        <span>Hora</span>
                        <input id="consultaHora" type="time" required>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Agendar consulta</button>
                    </div>
                </form>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Acompanhamento</span>
                        <h3>Suas consultas</h3>
                    </div>
                    <div class="pill">Histórico em tempo real</div>
                </div>

                <div class="list-panel">
                    <ul id="listaConsultas" class="list"></ul>
                </div>
            </article>
        </section>

        <section class="panel-grid user-actions-grid">
            <article class="card schedule-card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Alteração</span>
                        <h3>Reagendar consulta</h3>
                    </div>
                </div>

                <form id="reagendar-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>ID da consulta</span>
                        <input id="reagendarConsultaId" type="number" min="1" required>
                    </label>

                    <label class="field">
                        <span>Nova data</span>
                        <input id="reagendarData" type="date" required>
                    </label>

                    <label class="field">
                        <span>Nova hora</span>
                        <input id="reagendarHora" type="time" required>
                    </label>

                    <label class="field">
                        <span>Novo médico</span>
                        <select id="reagendarMedico"></select>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Salvar reagendamento</button>
                    </div>
                </form>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Cancelamento</span>
                        <h3>Solicitar cancelamento</h3>
                    </div>
                </div>

                <form id="cancelamento-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>ID da consulta</span>
                        <input id="cancelamentoConsultaId" type="number" min="1" required>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button danger" type="submit">Solicitar cancelamento</button>
                    </div>
                </form>
            </article>

            <article class="card info-card">
                <span class="card-kicker">Resumo</span>
                <h3>Paciente logado</h3>
                <p><strong>${paciente.nome}</strong></p>
                <p>CPF: ${paciente.cpf || "-"}</p>
                <p>E-mail: ${(paciente.emails || []).join(", ") || "-"}</p>
            </article>
        </section>
    `;
}
