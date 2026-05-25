# Minimundo do Trabalho — Sistema de Gestão de Clínicas Baseado em Microsserviços

A clínica médica **Areas Health** está expandindo sua atuação no Sudeste do Brasil e solicitou à empresa **JKLE** o desenvolvimento de um software para controlar os agendamentos e a realização das consultas.

A clínica atende a várias especialidades médicas, como cardiologia, ortopedia, pediatria, entre outras. Para suportar esse crescimento operacional, o sistema de gestão clínica será organizado em **domínios independentes**, seguindo uma **arquitetura baseada em microsserviços**.

## Domínios do Sistema

### Cadastro e Gestão Administrativa

O domínio **Cadastro e Gestão Administrativa** será responsável pelo gerenciamento dos cadastros da clínica, incluindo:

- Especialidades;
- Consultórios;
- Médicos;
- Pacientes;
- Medicamentos;
- Exames.

### Agendamento Clínico

O domínio **Agendamento Clínico** será responsável pelo gerenciamento operacional das consultas, incluindo:

- Escalas médicas;
- Disponibilidade de horários;
- Agendamento;
- Remarcação;
- Cancelamento;
- Realização das consultas.

### Faturamento e Cobrança

O domínio **Faturamento e Cobrança** será responsável pela gestão financeira das consultas, incluindo:

- Definição dos valores vigentes;
- Registro de pagamentos;
- Emissão e acompanhamento das cobranças.

Os domínios deverão disponibilizar operações de gerenciamento (**CRUD**) compatíveis com suas responsabilidades, incluindo criação, consulta, atualização e gerenciamento das entidades do sistema, tais como pacientes, médicos, especialidades, consultórios, escalas de atendimento, consultas e registros financeiros.

## Controle de Acesso e Papéis

O sistema deverá possuir controle de acesso baseado em perfis de usuário, restringindo funcionalidades de acordo com os seguintes papéis:

- Diretor;
- Gerente;
- Médico;
- Atendente;
- Paciente.

O atendente continuará responsável pelas operações administrativas internas da clínica, podendo auxiliar pacientes presencialmente, realizar cadastros, atualizar informações cadastrais, registrar pagamentos e prestar suporte operacional às funcionalidades do sistema.

## Arquitetura e Comunicação entre Microsserviços

Cada domínio será implementado como um **microsserviço independente**, possuindo responsabilidade própria sobre seus dados, regras de negócio e funcionalidades, evitando compartilhamento direto de banco de dados entre os domínios.

A comunicação entre os microsserviços ocorrerá por meio de **APIs REST**, utilizando mensagens em formato **JSON**, preservando o desacoplamento entre os domínios do sistema.

A arquitetura deverá garantir **tolerância a falhas**, permitindo que a indisponibilidade temporária de um microsserviço não interrompa completamente o funcionamento do sistema.

Por exemplo, falhas momentâneas no domínio de faturamento não deverão impedir o registro ou agendamento das consultas.

Para a execução de determinadas funcionalidades, poderá haver comunicação entre os domínios do sistema. Durante o processo de agendamento, por exemplo, o domínio de **Agendamento Clínico** poderá consultar informações do domínio **Cadastro e Gestão Administrativa** para validar pacientes, médicos e especialidades disponíveis, bem como interagir com o domínio de **Faturamento e Cobrança** para obtenção do valor vigente da consulta.

## Regras de Negócio

### Especialidades

O diretor é responsável por manter o cadastro das especialidades atualizado.

De cada especialidade devem ser conhecidos:

- Nome;
- Descrição.

### Consultórios

O cadastro dos consultórios é mantido pelo diretor.

De cada consultório devem ser conhecidos:

- Número;
- Bloco;
- Tamanho.

### Médicos

O cadastro dos médicos que trabalham na clínica é mantido pelo gerente.

Dos médicos é preciso conhecer:

- Nome;
- CPF;
- CRM;
- Data de nascimento;
- Endereço;
- Telefones;
- E-mails;
- Especialidades atendidas.

Um médico deverá ser especializado em, pelo menos, uma das especialidades oferecidas pela clínica.

Além da gestão dos médicos e das escalas, o gerente será responsável por **analisar, aprovar ou reprovar solicitações de cancelamento** das consultas.

### Escalas Médicas

No domínio de **Agendamento Clínico**, o gerente deverá atualizar, sempre que necessário, a escala de trabalho de cada médico.

Cada escala deverá conter:

- Data de início da vigência;
- Data de término da vigência (quando ocorrer);
- Dia da semana;
- Hora inicial;
- Hora final.

Durante a definição da escala, deverá ser identificado qual consultório será utilizado pelo médico.

Não poderá haver:

- Sobreposição de escalas para um mesmo médico;
- Sobreposição de utilização dos consultórios.

### Valores das Consultas

No domínio de **Faturamento e Cobrança**, o diretor será responsável por atualizar o valor vigente das consultas.

O valor:

- Não dependerá da especialidade;
- Deverá possuir data de vigência.

### Pacientes

No domínio de **Agendamento Clínico**, o paciente poderá solicitar diretamente o agendamento de consultas pelo sistema ou realizá-lo por intermédio do atendente.

Antes do agendamento, deverá ser verificado se o paciente possui cadastro ativo.

Caso não possua cadastro:

- O próprio paciente poderá realizar seu cadastro;
- O atendente poderá realizar o cadastro em seu nome durante o atendimento.

Tanto o paciente quanto o atendente poderão atualizar informações cadastrais sempre que necessário.

Dos pacientes é preciso conhecer:

- Nome;
- CPF;
- Gênero biológico;
- Data de nascimento;
- Endereço;
- Telefones;
- E-mails.

O paciente poderá selecionar diretamente o médico ou a especialidade desejada por meio do sistema, ou realizar essa operação com auxílio do atendente.

Com base nisso, o sistema deverá consultar e apresentar as disponibilidades existentes.

Caso exista interesse, a consulta poderá ser agendada identificando:

- Data;
- Horário;
- Médico responsável.

A operação poderá ser realizada diretamente pelo paciente ou pelo atendente.

### Reagendamento

Uma consulta agendada poderá ser reagendada pelo paciente ou pelo atendente, desde que permaneça no estado **Agendada**.

Durante o processo de reagendamento, o sistema deverá consultar novamente as disponibilidades do médico ou da especialidade desejada, registrando:

- Nova data;
- Novo horário;
- Médico responsável, quando aplicável.

### Realização da Consulta

Durante a realização de uma consulta, no domínio de **Agendamento Clínico**, deverão ser registradas:

- Data e hora inicial da consulta;
- Descrição do estado geral do paciente.

O médico poderá:

- Prescrever medicamentos, informando dose e posologia;
- Solicitar exames;
- Registrar resultados de exames solicitados anteriormente.

Ao final da consulta, o médico deverá encerrá-la, fazendo com que fique registrada a data e a hora de encerramento.

### Medicamentos e Exames

No domínio de **Cadastro e Gestão Administrativa**, os médicos serão responsáveis pela manutenção do cadastro de medicamentos e exames.

De ambos devem ser conhecidos:

- Nome;
- Indicação.

### Pagamentos e Cobranças

O domínio de **Faturamento e Cobrança** será responsável pelo registro dos pagamentos associados às consultas, utilizando o valor vigente correspondente à data do agendamento.

O pagamento poderá ocorrer conforme as políticas operacionais da clínica.

### Estados da Consulta

Uma consulta poderá assumir os seguintes estados:

- Agendada;
- Em Andamento;
- Finalizada;
- Cancelada.

Enquanto estiver no estado **Agendada**, o paciente ou o atendente poderão registrar solicitações de reagendamento ou cancelamento, desde que o horário previsto ainda não tenha sido ultrapassado.

As solicitações de cancelamento deverão ser analisadas pelo gerente, que poderá aprová-las ou rejeitá-las.