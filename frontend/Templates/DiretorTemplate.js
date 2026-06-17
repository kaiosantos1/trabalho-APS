export function diretorPageTemplate({ hoje }) {
    return `
        <section class="page-hero">
            <div>
                <p class="eyebrow">Diretor</p>
                <h2>Gestão de políticas clínicas</h2>
                <p class="page-lead">Especialidades, consultórios e valores de consulta.</p>
            </div>
            <div class="hero-side">
                <div class="hero-badge">Cadastro + Faturamento</div>
                <div class="card-actions hero-actions">
                    <button class="button ghost" id="voltar-home-diretor">Voltar</button>
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
                </div>

                <form id="diretor-especialidade-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>Nome</span>
                        <input id="diretorEspNome" type="text" placeholder="Cardiologia" required>
                    </label>

                    <label class="field full-width">
                        <span>Descrição</span>
                        <textarea id="diretorEspDescricao" rows="2"></textarea>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Cadastrar</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Cadastradas</h4>
                    <ul id="diretorEspecialidades" class="list"></ul>
                </div>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Cadastro Service</span>
                        <h3>Consultórios</h3>
                    </div>
                </div>

                <form id="diretor-consultorio-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>Número</span>
                        <input id="diretorConsNumero" type="text" placeholder="101" required>
                    </label>

                    <label class="field">
                        <span>Bloco</span>
                        <input id="diretorConsBloco" type="text" placeholder="A" required>
                    </label>

                    <label class="field">
                        <span>Tamanho</span>
                        <input id="diretorConsTamanho" type="text" placeholder="Médio">
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Cadastrar</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Cadastrados</h4>
                    <ul id="diretorConsultorios" class="list"></ul>
                </div>
            </article>

            <article class="card">
                <div class="card-header">
                    <div>
                        <span class="card-kicker">Faturamento Service</span>
                        <h3>Valores de consulta</h3>
                    </div>
                </div>

                <form id="diretor-valor-form" class="form-grid compact-grid">
                    <label class="field">
                        <span>Valor</span>
                        <input id="diretorValorConsulta" type="number" min="0" step="0.01" placeholder="250.00" required>
                    </label>

                    <label class="field">
                        <span>Vigência</span>
                        <input id="diretorValorVigencia" type="date" value="${hoje}" required>
                    </label>

                    <div class="form-actions full-width">
                        <button class="button primary" type="submit">Definir</button>
                    </div>
                </form>

                <div class="list-panel">
                    <h4>Histórico</h4>
                    <ul id="diretorValores" class="list"></ul>
                </div>
            </article>
        </section>
    `;
}
