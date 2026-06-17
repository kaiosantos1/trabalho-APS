export function gerentePageTemplate({ hoje }) {
    const diasSemana = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"];

    return `
        <section class="page-hero">
            <div>
                <p class="eyebrow">Gerente</p>
                <h2>Gestão operacional</h2>
                <p class="page-lead">Médicos, escalas e cancelamentos.</p>
            </div>
            <div class="hero-side">
                <div class="hero-badge">Cadastro + Agendamento</div>
                <div class="card-actions hero-actions">
                    <button class="button ghost" id="voltar-home-gerente">Voltar</button>
                </div>
            </div>
        </section>

        <section class="panel-grid two-columns">
            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Cadastro Service</span>
                        <h3>Médicos</h3>
                    </div>
                </div>

                <form id="gerente-medico-form" class="form-grid">
                    <label class="field">
                        <span>Nome</span>
                        <input id="gerenteMedicoNome" type="text" required>
                    </label>

                    <label class="field">
                        <span>CPF</span>
                        <input id="gerenteMedicoCpf" type="text">
                    </label>

                    <label class="field">
                        <span>CRM</span>
                        <input id="gerenteMedicoCrm" type="text" required>
                    </label>

                    <label class="field">
                        <span>Data de nascimento</span>
                        <input id="gerenteMedicoNascimento" type="date">
                    </label>

                    <label class="field full-width">
                        <span>Endereço</span>
                        <input id="gerenteMedicoEndereco" type="text">
                    </label>

                    <label class="field">
                        <span>Telefone(s)</span>
                        <input id="gerenteMedicoTelefones" type="text" placeholder="21999999999, 21988888888">
                    </label>

                    <label class="field">
                        <span>E-mail(s)</span>
                        <input id="gerenteMedicoEmails" type="text">
                    </label>

                    <label class="field full-width">
                        <span>Especialidades</span>
                        <select id="gerenteMedicoEspecialidades" multiple size="3" required></select>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Cadastrar</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Médicos</h4>
                    <ul id="gerenteMedicos" class="list"></ul>
                </div>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Agendamento Service</span>
                        <h3>Escalas médicas</h3>
                    </div>
                </div>

                <form id="gerente-escala-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>Médico</span>
                        <select id="gerenteMedicoSelect" required></select>
                    </label>

                    <label class="field">
                        <span>Consultório</span>
                        <select id="gerenteConsultorioSelect" required></select>
                    </label>

                    <label class="field">
                        <span>Dia da semana</span>
                        <select id="gerenteDiaSemana" required>
                            ${diasSemana.map(d => `<option value="${d}">${d}</option>`).join("")}
                        </select>
                    </label>

                    <label class="field">
                        <span>Início vigência</span>
                        <input id="gerenteInicioVigencia" type="date" value="${hoje}" required>
                    </label>

                    <label class="field">
                        <span>Fim vigência</span>
                        <input id="gerenteFimVigencia" type="date">
                    </label>

                    <label class="field">
                        <span>Hora inicial</span>
                        <input id="gerenteHoraInicial" type="time" required>
                    </label>

                    <label class="field">
                        <span>Hora final</span>
                        <input id="gerenteHoraFinal" type="time" required>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Criar</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Escalas</h4>
                    <ul id="gerenteEscalas" class="list"></ul>
                </div>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Agendamento Service</span>
                        <h3>Cancelamentos pendentes</h3>
                    </div>
                </div>

                <ul id="gerentePendencias" class="list"></ul>
            </article>
        </section>
    `;
}
