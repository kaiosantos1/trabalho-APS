export function homePageTemplate() {
    return `
        <section class="page-hero home-hero">
            <div>
                <p class="eyebrow">Página inicial</p>
                <h2>Portal de acesso da clínica</h2>
                <p class="page-lead">Esta é a porta de entrada do sistema. A partir daqui você segue para login, cadastro ou acesso da área do paciente.</p>
            </div>
            <div class="hero-badge">Cadastro, agendamento e faturamento integrados</div>
        </section>

        <section class="panel-grid two-columns">
            <article class="card callout-card">
                <span class="card-kicker">Administrador</span>
                <h3>Operação e fiscalização</h3>
                <p>Gerencie especialidades, médicos, cancelamentos e rotinas financeiras em uma área separada da navegação pública.</p>
                <div class="card-actions">
                    <a class="button primary" href="#login">Ir para o login</a>
                </div>
            </article>

            <article class="card callout-card accent-card">
                <span class="card-kicker">Paciente</span>
                <h3>Cadastro e agendamentos</h3>
                <p>Crie seu cadastro e depois acesse a área do paciente para marcar, reagendar ou cancelar consultas.</p>
                <div class="card-actions">
                    <a class="button ghost" href="#cadastro">Fazer cadastro</a>
                    <a class="button primary" href="#login">Ir para o login</a>
                </div>
            </article>
        </section>
    `;
}