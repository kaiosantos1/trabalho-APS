export function medicoPageTemplate({ medico }) {
    const nomeMedico = medico?.nome ? `Dr(a). ${medico.nome}` : "Selecione o médico";

    return `
        <section class="page-hero">
            <div>
                <p class="eyebrow">Médico</p>
                <h2>Atendimento clínico</h2>
                <p class="page-lead">Consulte suas escalas, inicie e encerre consultas, prescreva medicamentos, solicite exames e registre resultados.</p>
            </div>
            <div class="hero-side">
                <div class="hero-badge">${nomeMedico}</div>
                <div class="card-actions hero-actions">
                    <button class="button ghost" id="voltar-home-medico">Voltar à página principal</button>
                </div>
            </div>
        </section>

        <section class="panel-grid two-columns">
            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Identificação</span>
                        <h3>Quem está atendendo</h3>
                    </div>
                    <div class="pill">Cadastro Service</div>
                </div>

                <label class="field">
                    <span>Selecione o seu registro de médico</span>
                    <select id="medicoSelect" required></select>
                </label>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Agendamento Service</span>
                        <h3>Minhas escalas</h3>
                    </div>
                    <div class="pill">Somente leitura</div>
                </div>

                <div class="list-panel">
                    <ul id="listaEscalasMedico" class="list"></ul>
                </div>
            </article>
        </section>

        <section class="panel-grid one-column">
            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Agendamento Service</span>
                        <h3>Minhas consultas</h3>
                    </div>
                    <div class="pill">Inicie pela própria lista</div>
                </div>

                <div class="list-panel">
                    <ul id="listaConsultasMedico" class="list"></ul>
                </div>
            </article>
        </section>

        <section class="panel-grid two-columns">
            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Realização</span>
                        <h3>Encerrar consulta</h3>
                    </div>
                </div>

                <form id="finalizar-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>ID da consulta (EM_ANDAMENTO)</span>
                        <input id="finalizarConsultaId" type="number" min="1" required>
                    </label>

                    <label class="field full-width">
                        <span>Descrição do estado geral do paciente</span>
                        <textarea id="finalizarDescricao" rows="3" placeholder="Resumo clínico do atendimento" required></textarea>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Encerrar consulta</button>
                    </div>
                </form>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Realização</span>
                        <h3>Prescrever medicamento</h3>
                    </div>
                </div>

                <form id="prescricao-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>ID da consulta</span>
                        <input id="prescricaoConsultaId" type="number" min="1" required>
                    </label>

                    <label class="field">
                        <span>Medicamento</span>
                        <select id="prescricaoMedicamento" required></select>
                    </label>

                    <label class="field">
                        <span>Dose</span>
                        <input id="prescricaoDose" type="text" placeholder="500 mg" required>
                    </label>

                    <label class="field">
                        <span>Posologia</span>
                        <input id="prescricaoPosologia" type="text" placeholder="1x ao dia por 7 dias" required>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Prescrever</button>
                    </div>
                </form>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Realização</span>
                        <h3>Solicitar exame</h3>
                    </div>
                </div>

                <form id="exame-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>ID da consulta</span>
                        <input id="exameConsultaId" type="number" min="1" required>
                    </label>

                    <label class="field">
                        <span>Exame</span>
                        <select id="exameSelect" required></select>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Solicitar exame</button>
                    </div>
                </form>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Realização</span>
                        <h3>Registrar resultado de exame</h3>
                    </div>
                </div>

                <form id="resultado-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>ID da consulta</span>
                        <input id="resultadoConsultaId" type="number" min="1" required>
                    </label>

                    <label class="field">
                        <span>ID do exame solicitado</span>
                        <input id="resultadoExameId" type="number" min="1" required>
                    </label>

                    <label class="field full-width">
                        <span>Resultado</span>
                        <textarea id="resultadoTexto" rows="2" placeholder="Resultado do exame" required></textarea>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Registrar resultado</button>
                    </div>
                </form>
            </article>
        </section>
    `;
}
