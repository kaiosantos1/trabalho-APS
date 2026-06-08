# API Contracts - Sistema de Gestão Clínica Areas Health

## Visão Geral

Este documento apresenta uma proposta inicial dos contratos das APIs REST dos microsserviços do sistema de gestão clínica Areas Health.

Os contratos foram definidos com base no minimundo, nos diagramas produzidos e nos requisitos levantados até o momento.

Formato das mensagens:

- JSON

---

# 1. Cadastro Service

Responsável pelo gerenciamento dos dados cadastrais do sistema.

## Pacientes

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /pacientes | Cadastrar paciente |
| GET | /pacientes | Listar pacientes |
| GET | /pacientes/{id} | Consultar paciente |
| PUT | /pacientes/{id} | Atualizar paciente |

---

## Médicos

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /medicos | Cadastrar médico |
| GET | /medicos | Listar médicos |
| GET | /medicos/{id} | Consultar médico |
| PUT | /medicos/{id} | Atualizar médico |

---

## Especialidades

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /especialidades | Cadastrar especialidade |
| GET | /especialidades | Listar especialidades |
| GET | /especialidades/{id} | Consultar especialidade |
| PUT | /especialidades/{id} | Atualizar especialidade |

---

## Consultórios

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /consultorios | Cadastrar consultório |
| GET | /consultorios | Listar consultórios |
| GET | /consultorios/{id} | Consultar consultório |
| PUT | /consultorios/{id} | Atualizar consultório |

---

## Medicamentos

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /medicamentos | Cadastrar medicamento |
| GET | /medicamentos | Listar medicamentos |
| GET | /medicamentos/{id} | Consultar medicamento |
| PUT | /medicamentos/{id} | Atualizar medicamento |

---

## Exames

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /exames | Cadastrar exame |
| GET | /exames | Listar exames |
| GET | /exames/{id} | Consultar exame |
| PUT | /exames/{id} | Atualizar exame |

---

# 2. Agendamento Service

Responsável pelo gerenciamento das consultas, escalas médicas e cancelamentos.

## Consultas

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /consultas | Agendar consulta |
| GET | /consultas | Listar consultas |
| GET | /consultas/{id} | Consultar consulta |
| PUT | /consultas/{id}/reagendar | Remarcar consulta |
| POST | /consultas/{id}/solicitar-cancelamento | Solicitar cancelamento |
| GET | /consultas/disponibilidade | Consultar horários disponíveis |

---

## Realização da Consulta

| Método | Endpoint | Descrição |
|----------|----------|----------|
| PUT | /consultas/{id}/iniciar | Iniciar consulta |
| PUT | /consultas/{id}/finalizar | Finalizar consulta |
| POST | /consultas/{id}/prescricoes | Registrar prescrição |
| POST | /consultas/{id}/exames-solicitados | Solicitar exame |
| POST | /consultas/{id}/resultados-exames | Registrar resultado de exame* |

\* Endpoint sujeito a refinamentos durante a implementação.

---

## Cancelamentos

| Método | Endpoint | Descrição |
|----------|----------|----------|
| GET | /solicitacoes-cancelamento/pendentes | Listar solicitações pendentes |
| PUT | /solicitacoes-cancelamento/{id}/aprovar | Aprovar cancelamento |
| PUT | /solicitacoes-cancelamento/{id}/rejeitar | Rejeitar cancelamento |

---

## Escalas Médicas

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /escalas | Criar escala médica |
| GET | /escalas | Listar escalas |
| GET | /escalas/{id} | Consultar escala |
| PUT | /escalas/{id} | Atualizar escala |

---

# 3. Faturamento Service

Responsável pela gestão financeira da clínica.

## Valores de Consulta

| Método | Endpoint | Descrição |
|----------|----------|----------|
| GET | /valores/vigente | Consultar valor vigente |
| POST | /valores | Definir valor vigente |

---

## Pagamentos

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /pagamentos | Registrar pagamento |
| GET | /pagamentos/{id} | Consultar pagamento |

---

## Cobranças

| Método | Endpoint | Descrição |
|----------|----------|----------|
| POST | /cobrancas | Emitir cobrança |
| GET | /cobrancas/{id} | Consultar cobrança |

---

# 4. Comunicação Entre Microsserviços

As seguintes comunicações foram identificadas durante a modelagem do sistema.

| Origem | Destino | Objetivo |
|----------|----------|----------|
| Agendamento Service | Cadastro Service | Validar paciente |
| Agendamento Service | Cadastro Service | Validar médico |
| Agendamento Service | Cadastro Service | Validar especialidade |
| Agendamento Service | Faturamento Service | Obter valor vigente da consulta |

---

# 5. Observações

Este documento representa uma especificação inicial dos contratos REST do sistema.

Detalhes relacionados a:

- autenticação;
- autorização;
- versionamento;
- formatos completos de request e response;
- códigos HTTP;
- tratamento de erros;
- mecanismos de segurança;
- estratégias de comunicação entre microsserviços;

serão refinados durante a fase de implementação do projeto.
