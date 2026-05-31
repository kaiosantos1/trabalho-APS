# Microsserviços do Sistema

O sistema será estruturado utilizando uma arquitetura baseada em **microsserviços independentes**, organizados por domínio de negócio.

Cada microsserviço possuirá responsabilidade própria sobre seus dados, regras de negócio e funcionalidades.

Cada microsserviço possuirá **seu próprio banco de dados independente**, garantindo isolamento dos dados e evitando compartilhamento direto entre os domínios.

A comunicação entre os microsserviços ocorrerá por meio de **APIs REST**, utilizando mensagens em formato **JSON**.

---

# 1. Cadastro e Gestão Administrativa Service

## Responsabilidade

Responsável pelo gerenciamento dos cadastros centrais da clínica.

## Entidades Gerenciadas

- Pacientes
- Médicos
- Especialidades
- Consultórios
- Medicamentos
- Exames

---

## Funcionalidades e Perfis

### Pacientes

| Funcionalidade | Perfis Autorizados |
|----------------|-------------------|
| Cadastrar paciente | Paciente, Atendente |
| Consultar paciente | Paciente, Atendente |
| Atualizar paciente | Paciente, Atendente |
| Listar pacientes | Atendente, Gerente |

### Médicos

| Funcionalidade | Perfis Autorizados |
|----------------|-------------------|
| Cadastrar médico | Gerente |
| Atualizar médico | Gerente |
| Consultar médico | Gerente, Atendente, Paciente |
| Associar especialidades | Gerente |

### Especialidades

| Funcionalidade | Perfis Autorizados |
|----------------|-------------------|
| Cadastrar especialidade | Diretor |
| Atualizar especialidade | Diretor |
| Consultar especialidades | Diretor, Gerente, Médico, Atendente, Paciente |

### Consultórios

| Funcionalidade | Perfis Autorizados |
|----------------|-------------------|
| Cadastrar consultório | Diretor |
| Atualizar consultório | Diretor |
| Consultar consultório | Diretor, Gerente |

### Medicamentos

| Funcionalidade | Perfis Autorizados |
|----------------|-------------------|
| Cadastrar medicamento | Médico |
| Atualizar medicamento | Médico |
| Consultar medicamento | Médico |

### Exames

| Funcionalidade | Perfis Autorizados |
|----------------|-------------------|
| Cadastrar exame | Médico |
| Atualizar exame | Médico |
| Consultar exame | Médico |

---

## Exemplos de Endpoints REST

```plaintext
GET /pacientes
POST /pacientes
PUT /pacientes/{id}

GET /medicos
POST /medicos

GET /especialidades
POST /especialidades
```

---

# 2. Agendamento Clínico Service

## Responsabilidade

Responsável pela gestão operacional das consultas e disponibilidade médica.

## Entidades Gerenciadas

- Consultas
- Escalas Médicas
- Disponibilidades
- Solicitações de Cancelamento

---

## Funcionalidades

### Escalas Médicas

**Perfis autorizados:** Gerente, Médico

Funções:

- Criar escala médica
- Atualizar escala
- Consultar escalas
- Validar conflitos de horários
- Validar ocupação de consultórios

O gerente realiza o gerenciamento das escalas.

O médico poderá consultar suas próprias escalas de trabalho.

---

### Consultas

| Funcionalidade | Perfis Autorizados |
|----------------|-------------------|
| Agendar consulta | Paciente, Atendente |
| Consultar disponibilidade | Paciente, Atendente |
| Reagendar consulta | Paciente, Atendente |
| Solicitar cancelamento | Paciente, Atendente |
| Consultar consultas | Paciente, Atendente |

---

### Autoatendimento do Paciente

O paciente poderá utilizar diretamente o sistema para:

- realizar cadastro;
- consultar suas consultas;
- agendar consultas;
- reagendar consultas;
- solicitar cancelamento.

O atendente também poderá executar essas operações em nome do paciente durante atendimento presencial.

---

### Exemplos de Endpoints REST

```plaintext
GET /consultas/minhas

POST /consultas

PUT /consultas/{id}/reagendar

POST /consultas/{id}/solicitar-cancelamento

GET /consultas/disponibilidade?medicoId={id}&data={data}

GET /consultas/disponibilidade?especialidadeId={id}&data={data}
```

---

### Realização da Consulta

**Perfil responsável:** Médico

Funções:

- registrar início da consulta;
- registrar encerramento;
- registrar estado clínico do paciente;
- prescrever medicamentos;
- solicitar exames;
- registrar resultados de exames.

---

### Cancelamentos

Fluxo operacional:

```plaintext
Paciente / Atendente
        ↓
Solicita cancelamento
        ↓
Gerente
 ↓              ↓
Aprova       Rejeita
```

Regras de negócio:

- apenas consultas no estado **Agendada** podem ser canceladas;
- solicitação permitida somente antes do horário previsto;
- gerente aprova ou rejeita solicitações.

Endpoints:

```plaintext
POST /consultas/{id}/solicitar-cancelamento

GET /cancelamentos/pendentes

PUT /cancelamentos/{id}/aprovar

PUT /cancelamentos/{id}/rejeitar
```

---

## Estados da Consulta

Uma consulta poderá assumir os seguintes estados:

- Agendada
- Em Andamento
- Finalizada
- Cancelada

### Transições de Estado

```plaintext
POST /consultas
→ AGENDADA

PUT /consultas/{id}/iniciar
AGENDADA → EM_ANDAMENTO

PUT /consultas/{id}/finalizar
EM_ANDAMENTO → FINALIZADA

PUT /cancelamentos/{id}/aprovar
AGENDADA → CANCELADA
```

---

# 3. Faturamento e Cobrança Service

## Responsabilidade

Responsável pela gestão financeira das consultas.

## Entidades Gerenciadas

- Valores de Consulta
- Pagamentos
- Cobranças

---

## Funcionalidades e Perfis

### Valores da Consulta

**Perfil responsável:** Diretor

Funções:

- definir valor vigente;
- atualizar valor vigente;
- consultar valor vigente.

### Pagamentos

**Perfis autorizados:** Atendente

Funções:

- registrar pagamento;
- consultar pagamento;
- listar pagamentos.

### Cobranças

#### Diretor

Funções:

- emitir cobrança;
- consultar cobranças;
- acompanhar cobranças.

#### Gerente

Funções:

- consultar cobranças;
- acompanhar cobranças.

#### Paciente

Funções:

- consultar suas cobranças;
- consultar seu histórico financeiro;
- consultar seus pagamentos.
---

## Regras de Negócio

- o valor da consulta não depende da especialidade;
- o valor deverá possuir data de vigência;
- o pagamento utilizará o valor vigente correspondente à data do agendamento.

---

## Exemplos de Endpoints REST

```plaintext
GET /valores

POST /valores

GET /pagamentos

POST /pagamentos

GET /pagamentos/meus

GET /cobrancas

GET /cobrancas/minhas
```

---


# Comunicação entre Microsserviços

## Agendamento → Cadastro

O serviço de Agendamento poderá consultar o serviço de Cadastro para:

- validar pacientes;
- validar médicos;
- validar especialidades;
- consultar informações cadastrais.

## Agendamento → Faturamento

O serviço de Agendamento poderá consultar o serviço de Faturamento para:

- obter valor vigente da consulta;
- registrar informações financeiras associadas.

---

## Tecnologias de Comunicação

- REST
- JSON
- HTTP

---

# Tolerância a Falhas

A arquitetura deverá garantir tolerância a falhas entre os microsserviços.

Estratégias adotadas:

- microsserviços independentes;
- comunicação desacoplada via REST;
- timeout nas chamadas entre serviços;
- falha em um serviço não interrompe completamente os demais.

## Cenários de Tolerância

| Cenário | Comportamento |
|----------|---------------|
| Faturamento indisponível | Agendamento continua funcionando |
| Cadastro indisponível | Serviços restantes continuam operando |
| Agendamento indisponível | Cadastro e faturamento permanecem disponíveis |

---

# Implantação

Cada microsserviço será executado em um **container Docker independente**.

Exemplo:

- cadastro-service
- agendamento-service
- faturamento-service