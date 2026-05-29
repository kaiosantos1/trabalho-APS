# Minimundo — Sistema de Gestão Clínica

A clínica médica **Areas Health** está expandindo a sua atuação no Sudeste do Brasil e solicitou à empresa **JKLE** o desenvolvimento de um software para controlar os agendamentos e a realização das consultas. A clínica atende a várias especialidades (cardiologia, ortopedia, pediatria, entre outras). Para suportar esse crescimento operacional, o sistema de gestão clínica será organizado em domínios independentes, seguindo uma arquitetura baseada em microsserviços.

## Domínios do Sistema

O domínio **Cadastro e Gestão Administrativa** será responsável pelo gerenciamento dos cadastros da clínica, incluindo:

* Especialidades;
* Consultórios;
* Médicos;
* Pacientes;
* Medicamentos;
* Exames.

O domínio **Agendamento Clínico** será responsável pelo gerenciamento operacional das consultas, incluindo:

* Escalas médicas;
* Disponibilidade de horários;
* Agendamento;
* Remarcação;
* Cancelamento;
* Realização das consultas.

O domínio **Faturamento e Cobrança** será responsável pela gestão financeira das consultas, incluindo:

* Definição dos valores vigentes;
* Registro de pagamentos;
* Emissão de cobranças;
* Acompanhamento das cobranças.

Os domínios deverão disponibilizar operações de gerenciamento (**CRUD**) compatíveis com suas responsabilidades, incluindo criação, consulta, atualização e gerenciamento das entidades do sistema, tais como pacientes, médicos, especialidades, consultórios, escalas de atendimento, consultas e registros financeiros.

## Controle de Acesso

O sistema deverá possuir controle de acesso baseado em perfis de usuário, restringindo funcionalidades de acordo com os papéis de:

* Diretor;
* Gerente;
* Médico;
* Atendente;
* Paciente.

O atendente continuará responsável pelas operações administrativas internas da clínica, podendo:

* Cadastrar pacientes;
* Consultar pacientes;
* Atualizar informações de pacientes;
* Registrar pagamentos;
* Auxiliar pacientes presencialmente;
* Prestar suporte operacional às funcionalidades do sistema.

## Arquitetura Baseada em Microsserviços

Cada domínio será implementado como um microsserviço independente, possuindo responsabilidade própria sobre seus dados, regras de negócio e funcionalidades.

Cada microsserviço será responsável pelo gerenciamento de suas próprias informações, evitando compartilhamento direto de banco de dados entre os domínios.

A comunicação entre os microsserviços ocorrerá por meio de **APIs REST**, utilizando mensagens em formato **JSON**, preservando o desacoplamento entre os domínios do sistema.

A arquitetura deverá garantir **tolerância a falhas**, permitindo que a indisponibilidade temporária de um microsserviço não interrompa completamente o funcionamento do sistema. Por exemplo, falhas momentâneas no domínio de Faturamento e Cobrança não deverão impedir o registro ou agendamento das consultas.

Para a execução de determinadas funcionalidades, poderá haver comunicação entre os domínios do sistema. Por exemplo, durante o processo de agendamento, o domínio de Agendamento Clínico poderá consultar informações do domínio Cadastro e Gestão Administrativa para validar pacientes, médicos e especialidades disponíveis, bem como interagir com o domínio de Faturamento e Cobrança para obtenção do valor vigente da consulta.

---

## Regras de Negócio

### Especialidades

É necessário que o diretor mantenha esse cadastro atualizado.

Das especialidades é necessário conhecer:

* Nome;
* Descrição.

### Consultórios

O cadastro dos consultórios é mantido pelo diretor.

De cada consultório deve-se conhecer:

* Número;
* Bloco;
* Tamanho.

### Médicos

O cadastro dos médicos que trabalham na clínica é mantido pelo gerente.

Dos médicos é preciso conhecer:

* Nome;
* CPF;
* CRM;
* Data de nascimento;
* Endereço;
* Telefones;
* E-mails;
* Especialidades atendidas.

Um médico deve ser especializado em, pelo menos, uma das especialidades oferecidas pela clínica.

Além da gestão dos médicos e das escalas, o gerente será responsável por:

* Listar solicitações de cancelamento pendentes;
* Analisar solicitações;
* Aprovar solicitações;
* Reprovar solicitações de cancelamento.

### Escalas Médicas

No domínio de **Agendamento Clínico**, o gerente deverá atualizar, sempre que necessário, a escala de trabalho de cada médico, contendo:

* Data de início da vigência;
* Data de término da vigência (quando existir);
* Dia da semana;
* Hora inicial;
* Hora final da escala.

Nesse momento, o gerente deverá identificar qual consultório será utilizado pelo médico durante cada escala.

Não poderá haver:

* Sobreposição nas escalas estabelecidas para um médico em determinado período;
* Sobreposição nos consultórios definidos para cada escala.

O médico poderá consultar suas próprias escalas de trabalho para visualizar seus horários de atendimento.

### Valores e Cobranças

No domínio de **Faturamento e Cobrança**, o diretor será responsável por atualizar o valor vigente das consultas.

O valor:

* Não depende da especialidade;
* Deve possuir data de vigência.

O diretor também poderá emitir cobranças referentes às consultas realizadas.

### Pacientes e Agendamento

No domínio de **Agendamento Clínico**, o paciente poderá solicitar diretamente o agendamento de uma consulta pelo sistema ou realizá-lo por intermédio do atendente.

Antes do agendamento, deverá ser verificado se o paciente já possui cadastro ativo.

Caso não possua cadastro:

* O paciente poderá realizar seu próprio cadastro no sistema;
* O atendente poderá efetuar o cadastro em nome do paciente durante o atendimento.

Tanto o paciente quanto o atendente poderão atualizar as informações cadastrais do paciente sempre que necessário.

Dos pacientes é preciso conhecer:

* Nome;
* CPF;
* Gênero biológico;
* Data de nascimento;
* Endereço;
* Telefones;
* E-mails.

O paciente poderá consultar diretamente pelo sistema:

* Especialidades oferecidas;
* Médicos disponíveis;
* Disponibilidades de atendimento.

Alternativamente, essa operação poderá ser realizada com auxílio do atendente.

Em seguida, o paciente poderá selecionar o médico ou a especialidade desejada.

Com base nisso, o sistema deverá consultar e apresentar as disponibilidades existentes.

Caso exista interesse, a consulta poderá ser agendada identificando:

* Data;
* Horário;
* Médico responsável.

A operação poderá ser realizada diretamente pelo paciente ou pelo atendente.

Após o agendamento, o paciente poderá consultar diretamente pelo sistema suas consultas:

* Agendadas;
* Reagendadas;
* Canceladas;
* Finalizadas.

O paciente poderá acompanhar informações como:

* Data;
* Horário;
* Médico responsável;
* Estado da consulta.

Uma consulta agendada poderá ser reagendada pelo paciente ou pelo atendente, desde que permaneça no estado **Agendada**.

No processo de reagendamento, o sistema deverá consultar novamente as disponibilidades do médico ou da especialidade desejada, registrando:

* Nova data;
* Novo horário;
* Médico responsável (quando aplicável).

### Realização da Consulta

No início do atendimento, o médico deverá iniciar a consulta, fazendo com que sejam registradas:

* Data de início;
* Hora de início.

Nesse momento, o estado da consulta deverá ser alterado para **Em Andamento**.

Durante a realização da consulta, o médico deverá informar uma descrição sobre o estado geral do paciente.

O médico poderá:

* Prescrever medicamentos (dose e posologia);
* Solicitar exames;
* Registrar resultados de exames solicitados anteriormente.

Ao final da consulta, o médico deverá encerrá-la, registrando:

* Data de encerramento;
* Hora de encerramento.

### Medicamentos e Exames

No domínio de **Cadastro e Gestão Administrativa**, os médicos são responsáveis pela manutenção do cadastro de medicamentos e exames.

Tanto dos medicamentos quanto dos exames deve-se conhecer:

* Nome;
* Indicação.

### Pagamentos

O domínio de **Faturamento e Cobrança** será responsável pelo registro dos pagamentos associados às consultas, utilizando o valor vigente correspondente à data do agendamento.

O pagamento poderá ocorrer conforme as políticas operacionais da clínica.

O paciente poderá consultar diretamente pelo sistema seu histórico de:

* Cobranças;
* Pagamentos relacionados às consultas realizadas.

Isso permitirá o acompanhamento financeiro de seus atendimentos.

### Estados da Consulta

Uma consulta poderá assumir os seguintes estados:

* Agendada;
* Em Andamento;
* Finalizada;
* Cancelada.

Enquanto estiver no estado **Agendada**, o paciente ou o atendente poderão registrar solicitações de:

* Reagendamento;
* Cancelamento.

Essas operações somente poderão ocorrer enquanto o horário previsto da consulta ainda não tiver sido ultrapassado.

As solicitações de cancelamento deverão ser analisadas pelo gerente, que poderá:

* Aprovar;
* Rejeitar.
