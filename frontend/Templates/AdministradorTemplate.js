export function administradorPageTemplate({ hoje }) {
    return `
        <section class="page-hero">
            <div>
                <p class="eyebrow">Administrador</p>
                <h2>Painel operacional</h2>
                <p class="page-lead">Centraliza cadastro de médicos e especialidades, aprovação de cancelamentos e ações financeiras.</p>
            </div>
            <div class="hero-side">
                <div class="hero-badge">Cadastro + Agendamento + Faturamento</div>
                <div class="card-actions hero-actions">
                    <button class="button ghost" id="voltar-home-admin">Voltar à página principal</button>
                </div>
            </div>
        </section>

        <section class="panel-grid two-columns">
            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Cadastro Service</span>
                        <h3>Especialidades</h3>
                    </div>
                    <div class="pill">Cadastro rápido</div>
                </div>

                <form id="especialidade-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>Nome</span>
                        <input id="especialidadeNome" type="text" placeholder="Cardiologia" required>
                    </label>

                    <label class="field full-width">
                        <span>Descrição</span>
                        <textarea id="especialidadeDescricao" rows="3" placeholder="Descrição da especialidade"></textarea>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Cadastrar especialidade</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Especialidades cadastradas</h4>
                    <ul id="listaEspecialidades" class="list"></ul>
                </div>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Cadastro Service</span>
                        <h3>Médicos</h3>
                    </div>
                    <div class="pill">Vincular ao menos uma especialidade</div>
                </div>

                <form id="medico-form" class="form-grid">
                    <label class="field">
                        <span>Nome</span>
                        <input id="medicoNome" type="text" placeholder="Nome do médico" required>
                    </label>

                    <label class="field">
                        <span>CPF</span>
                        <input id="medicoCpf" type="text" placeholder="00000000000">
                    </label>

                    <label class="field">
                        <span>CRM</span>
                        <input id="medicoCrm" type="text" placeholder="CRM 12345" required>
                    </label>

                    <label class="field">
                        <span>Data de nascimento</span>
                        <input id="medicoNascimento" type="date">
                    </label>

                    <label class="field full-width">
                        <span>Endereço</span>
                        <input id="medicoEndereco" type="text" placeholder="Rua, número, bairro">
                    </label>

                    <label class="field">
                        <span>Telefone(s)</span>
                        <input id="medicoTelefones" type="text" placeholder="21999999999, 21988888888">
                    </label>

                    <label class="field">
                        <span>E-mail(s)</span>
                        <input id="medicoEmails" type="text" placeholder="medico@exemplo.com">
                    </label>

                    <label class="field full-width">
                        <span>Especialidades</span>
                        <select id="medicoEspecialidades" multiple size="4"></select>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Cadastrar médico</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Médicos cadastrados</h4>
                    <ul id="listaMedicos" class="list"></ul>
                </div>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Cadastro Service</span>
                        <h3>Pacientes cadastrados</h3>
                    </div>
                    <div class="pill">Informação sigilosa</div>
                </div>

                <div class="list-panel">
                    <ul id="listaPacientes" class="list"></ul>
                </div>
            </article>
        </section>

        <section class="panel-grid two-columns">
            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Agendamento Service</span>
                        <h3>Solicitações de cancelamento</h3>
                    </div>
                    <div class="pill">Aprovar ou rejeitar</div>
                </div>

                <ul id="listaPendencias" class="list"></ul>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Faturamento Service</span>
                        <h3>Valores, cobranças e pagamentos</h3>
                    </div>
                    <div class="pill">Financeiro</div>
                </div>

                <form id="valor-form" class="form-grid compact-grid sub-section">
                    <label class="field">
                        <span>Valor da consulta</span>
                        <input id="valorConsulta" type="number" min="0" step="0.01" placeholder="250.00" required>
                    </label>

                    <label class="field">
                        <span>Vigência</span>
                        <input id="valorVigencia" type="date" value="${hoje}" required>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Definir valor vigente</button>
                    </div>
                </form>

                <form id="cobranca-form" class="form-grid compact-grid sub-section">
                    <label class="field">
                        <span>ID da consulta</span>
                        <input id="cobrancaConsulta" type="number" min="1" placeholder="opcional">
                    </label>

                    <label class="field">
                        <span>ID do paciente</span>
                        <input id="cobrancaPaciente" type="number" min="1" placeholder="opcional">
                    </label>

                    <label class="field">
                        <span>Valor da cobrança</span>
                        <input id="cobrancaValor" type="number" min="0" step="0.01" placeholder="250.00" required>
                    </label>

                    <label class="field">
                        <span>Data de emissão</span>
                        <input id="cobrancaEmissao" type="date" value="${hoje}" required>
                    </label>

                    <label class="field">
                        <span>Status</span>
                        <input id="cobrancaStatus" type="text" value="EMITIDA" required>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Emitir cobrança</button>
                    </div>
                </form>

                <form id="pagamento-form" class="form-grid compact-grid sub-section">
                    <label class="field">
                        <span>ID da consulta</span>
                        <input id="pagamentoConsulta" type="number" min="1" placeholder="opcional">
                    </label>

                    <label class="field">
                        <span>ID do paciente</span>
                        <input id="pagamentoPaciente" type="number" min="1" placeholder="opcional">
                    </label>

                    <label class="field">
                        <span>Valor pago</span>
                        <input id="pagamentoValor" type="number" min="0" step="0.01" placeholder="250.00">
                    </label>

                    <label class="field">
                        <span>Data do pagamento</span>
                        <input id="pagamentoData" type="date" value="${hoje}" required>
                    </label>

                    <label class="field">
                        <span>Status</span>
                        <input id="pagamentoStatus" type="text" value="PAGO" required>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Registrar pagamento</button>
                    </div>
                </form>

                <div class="finance-grid">
                    <div class="list-panel">
                        <h4>Valores</h4>
                        <ul id="listaValores" class="list"></ul>
                    </div>

                    <div class="list-panel">
                        <h4>Cobranças</h4>
                        <ul id="listaCobrancas" class="list"></ul>
                    </div>

                    <div class="list-panel">
                        <h4>Pagamentos</h4>
                        <ul id="listaPagamentos" class="list"></ul>
                    </div>
                </div>
            </article>
        </section>

        <section class="panel-grid two-columns">
            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Cadastro Service</span>
                        <h3>Consultórios</h3>
                    </div>
                    <div class="pill">Diretor</div>
                </div>

                <form id="consultorio-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>Número</span>
                        <input id="consultorioNumero" type="text" placeholder="101" required>
                    </label>

                    <label class="field">
                        <span>Bloco</span>
                        <input id="consultorioBloco" type="text" placeholder="A" required>
                    </label>

                    <label class="field">
                        <span>Tamanho</span>
                        <input id="consultorioTamanho" type="text" placeholder="Médio">
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Cadastrar consultório</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Consultórios cadastrados</h4>
                    <ul id="listaConsultorios" class="list"></ul>
                </div>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Agendamento Service</span>
                        <h3>Escalas médicas</h3>
                    </div>
                    <div class="pill">Gerente</div>
                </div>

                <form id="escala-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>Médico</span>
                        <select id="escalaMedico" required></select>
                    </label>

                    <label class="field">
                        <span>Consultório</span>
                        <select id="escalaConsultorio" required></select>
                    </label>

                    <label class="field">
                        <span>Dia da semana</span>
                        <select id="escalaDiaSemana" required>
                            <option value="Segunda">Segunda</option>
                            <option value="Terca">Terça</option>
                            <option value="Quarta">Quarta</option>
                            <option value="Quinta">Quinta</option>
                            <option value="Sexta">Sexta</option>
                            <option value="Sabado">Sábado</option>
                            <option value="Domingo">Domingo</option>
                        </select>
                    </label>

                    <label class="field">
                        <span>Início da vigência</span>
                        <input id="escalaInicioVigencia" type="date" value="${hoje}" required>
                    </label>

                    <label class="field">
                        <span>Fim da vigência (opcional)</span>
                        <input id="escalaFimVigencia" type="date">
                    </label>

                    <label class="field">
                        <span>Hora inicial</span>
                        <input id="escalaHoraInicial" type="time" required>
                    </label>

                    <label class="field">
                        <span>Hora final</span>
                        <input id="escalaHoraFinal" type="time" required>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Criar escala</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Escalas cadastradas</h4>
                    <ul id="listaEscalas" class="list"></ul>
                </div>
            </article>
        </section>

        <section class="panel-grid two-columns">
            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Cadastro Service</span>
                        <h3>Medicamentos</h3>
                    </div>
                    <div class="pill">Médico</div>
                </div>

                <form id="medicamento-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>Nome</span>
                        <input id="medicamentoNome" type="text" placeholder="Dipirona" required>
                    </label>

                    <label class="field full-width">
                        <span>Indicação</span>
                        <input id="medicamentoIndicacao" type="text" placeholder="Dor e febre">
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Cadastrar medicamento</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Medicamentos cadastrados</h4>
                    <ul id="listaMedicamentos" class="list"></ul>
                </div>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Cadastro Service</span>
                        <h3>Exames</h3>
                    </div>
                    <div class="pill">Médico</div>
                </div>

                <form id="exame-cadastro-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>Nome</span>
                        <input id="exameNome" type="text" placeholder="Hemograma" required>
                    </label>

                    <label class="field full-width">
                        <span>Indicação</span>
                        <input id="exameIndicacao" type="text" placeholder="Avaliação geral">
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Cadastrar exame</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Exames cadastrados</h4>
                    <ul id="listaExames" class="list"></ul>
                </div>
            </article>
        </section>
    `;
}
