# API Contracts - Sistema de Gestão Clínica APS Health

## Visão Geral

Este documento apresenta os contratos das APIs REST dos microsserviços do sistema
de gestão clínica, **atualizado para refletir o que está efetivamente implementado**.

Formato das mensagens: JSON.

Portas dos serviços:

| Serviço             | Porta | Situação      |
| ------------------- | ----- | ------------- |
| Cadastro Service    | 5001  | Implementado  |
| Faturamento Service | 5002  | Implementado  |
| Agendamento Service | 5003  | Implementado  |

> Persistência: cada serviço possui o **seu próprio banco MongoDB** (database per
> service), sem compartilhamento entre serviços. As coleções recebem um campo `id`
> sequencial (controlado pela coleção `counters`). Os serviços sobem em containers
> Docker independentes via `docker-compose` (ver `docker/`).

Cada serviço expõe também `GET /health` para verificação de disponibilidade.

---

# 0. Autenticação e Controle de Acesso (RBAC)

A autenticação é feita no **Cadastro Service** e devolve um **token JWT**. As
operações de **escrita** (POST/PUT/DELETE) exigem o header
`Authorization: Bearer <token>` e são restritas por perfil; as **leituras**
(GET) ficam abertas. As chamadas internas entre serviços usam o header
`X-Internal-Token` (ex.: o Agendamento emitindo cobrança no Faturamento).

Perfis: `diretor`, `gerente`, `atendente`, `medico`, `paciente`.

| Método | Endpoint       | Descrição                                                        |
| ------ | -------------- | ---------------------------------------------------------------- |
| POST   | /auth/login    | Autentica (body: `perfil`, `username`, `senha`); retorna `token` + dados |
| POST   | /auth/registro | Auto-cadastro de paciente (cria paciente + usuário) e já retorna `token` |

Login com credenciais erradas retorna `401`; perfil sem permissão para a
operação retorna `403`; ausência de token em operação protegida retorna `401`.

Permissões de **escrita** por perfil:

| Recurso                                              | Perfis com escrita                    |
| ---------------------------------------------------- | ------------------------------------- |
| Especialidades, Consultórios, Valores, Cobranças     | Diretor                               |
| Médicos, Escalas, Aprovar/Rejeitar cancelamento      | Gerente                               |
| Pacientes, Pagamentos                                | Atendente                             |
| Medicamentos, Exames                                 | Atendente e Médico                    |
| Iniciar/Finalizar/Prescrições/Exames da consulta     | Médico                                |
| Agendar / Reagendar / Solicitar cancelamento         | Paciente, Atendente                   |

> Além de POST/PUT, **todas as entidades de cadastro** (pacientes, médicos,
> especialidades, consultórios, medicamentos, exames) e as **escalas** expõem
> `DELETE /{entidade}/{id}`, sujeito às mesmas permissões de perfil acima.

---

# 1. Cadastro Service (porta 5001)

Responsável pelos dados cadastrais do sistema. **Implementado** em Flask com
Blueprints por entidade.

## Pacientes

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "cpf": "12345678900",
  "data_nascimento": "1998-05-10",
  "endereco": "Rua A, 100",
  "telefones": ["21999999999"],
  "emails": ["maria@email.com"],
  "ativo": true
}
```

| Método | Endpoint        | Descrição          |
| ------ | --------------- | ------------------ |
| POST   | /pacientes      | Cadastrar paciente |
| GET    | /pacientes      | Listar pacientes   |
| GET    | /pacientes/{id} | Consultar paciente |
| PUT    | /pacientes/{id} | Atualizar paciente |

## Médicos

```json
{
  "id": 1,
  "nome": "Dr. Paulo",
  "cpf": "11111111111",
  "crm": "12345",
  "data_nascimento": "1980-01-01",
  "endereco": "Rua B, 200",
  "telefones": ["21988888888"],
  "emails": ["paulo@email.com"],
  "especialidades_ids": [1, 2]
}
```

Regra: um médico deve possuir **pelo menos uma** especialidade
(`especialidades_ids` não pode ser vazio; caso contrário retorna 400).

| Método | Endpoint      | Descrição        |
| ------ | ------------- | ---------------- |
| POST   | /medicos      | Cadastrar médico |
| GET    | /medicos      | Listar médicos   |
| GET    | /medicos/{id} | Consultar médico |
| PUT    | /medicos/{id} | Atualizar médico |

## Especialidades

```json
{ "id": 1, "nome": "Cardiologia", "descricao": "Doenças cardiovasculares." }
```

| Método | Endpoint             | Descrição               |
| ------ | -------------------- | ----------------------- |
| POST   | /especialidades      | Cadastrar especialidade |
| GET    | /especialidades      | Listar especialidades   |
| GET    | /especialidades/{id} | Consultar especialidade |
| PUT    | /especialidades/{id} | Atualizar especialidade |

## Consultórios

```json
{ "id": 1, "numero": "101", "bloco": "A", "tamanho": "Médio" }
```

| Método | Endpoint           | Descrição             |
| ------ | ------------------ | --------------------- |
| POST   | /consultorios      | Cadastrar consultório |
| GET    | /consultorios      | Listar consultórios   |
| GET    | /consultorios/{id} | Consultar consultório |
| PUT    | /consultorios/{id} | Atualizar consultório |

## Medicamentos

```json
{ "id": 1, "nome": "Dipirona", "indicacao": "Dor e febre." }
```

| Método | Endpoint           | Descrição             |
| ------ | ------------------ | --------------------- |
| POST   | /medicamentos      | Cadastrar medicamento |
| GET    | /medicamentos      | Listar medicamentos   |
| GET    | /medicamentos/{id} | Consultar medicamento |
| PUT    | /medicamentos/{id} | Atualizar medicamento |

## Exames

```json
{ "id": 1, "nome": "Hemograma", "indicacao": "Avaliação geral." }
```

| Método | Endpoint     | Descrição       |
| ------ | ------------ | --------------- |
| POST   | /exames      | Cadastrar exame |
| GET    | /exames      | Listar exames   |
| GET    | /exames/{id} | Consultar exame |
| PUT    | /exames/{id} | Atualizar exame |

---

# 2. Agendamento Service (porta 5003)

Responsável pelas consultas, escalas médicas e solicitações de cancelamento.
**Implementado** em Flask com Blueprints. Ao agendar, comunica-se com o Cadastro
(validação) e o Faturamento (valor vigente) — ver seção 4.

## Consultas

Estrutura da consulta:

```json
{
  "id": 1,
  "paciente_id": 1,
  "medico_id": 1,
  "especialidade_id": 1,
  "data_hora": "2026-06-20T10:00:00",
  "estado": "AGENDADA",
  "data_hora_inicio": null,
  "data_hora_encerramento": null,
  "descricao_estado_geral": null,
  "valor_consulta": 250.0,
  "prescricoes": [],
  "exames_solicitados": []
}
```

Estados possíveis: `AGENDADA`, `EM_ANDAMENTO`, `FINALIZADA`, `CANCELADA`.

| Método | Endpoint                                  | Descrição                          |
| ------ | ----------------------------------------- | ---------------------------------- |
| POST   | /consultas                                | Agendar consulta                   |
| GET    | /consultas                                | Listar consultas (filtros opcionais: `paciente_id`, `medico_id`) |
| GET    | /consultas/{id}                           | Consultar consulta                 |
| GET    | /consultas/disponibilidade                | Consultar disponibilidade (`medico_id`, `data`) |
| PUT    | /consultas/{id}/reagendar                 | Reagendar (apenas se AGENDADA)     |
| PUT    | /consultas/{id}/iniciar                   | Iniciar consulta (→ EM_ANDAMENTO)  |
| PUT    | /consultas/{id}/finalizar                 | Finalizar consulta (→ FINALIZADA)  |
| POST   | /consultas/{id}/prescricoes               | Registrar prescrição               |
| POST   | /consultas/{id}/exames-solicitados        | Solicitar exame                    |
| POST   | /consultas/{id}/resultados-exames         | Registrar resultado de exame       |
| POST   | /consultas/{id}/solicitar-cancelamento    | Solicitar cancelamento             |

Regras de estado aplicadas: só é possível reagendar/cancelar uma consulta
`AGENDADA`; iniciar exige `AGENDADA`; finalizar exige `EM_ANDAMENTO`.

Regras de negócio adicionais aplicadas no agendamento:

- **Disponibilidade:** a data/hora deve cair dentro de uma escala vigente do médico
  para o dia da semana correspondente (caso contrário, 409).
- **Sem dupla marcação:** não é permitido agendar dois pacientes no mesmo médico e
  horário (409).
- **Janela temporal:** não é possível agendar/reagendar/solicitar cancelamento de um
  horário que já passou (409).
- **Valor congelado:** ao agendar, o `valor_consulta` recebe o valor vigente obtido do
  Faturamento e permanece fixo na consulta.
- **Cobrança automática:** ao finalizar (`/finalizar`), o Agendamento emite uma cobrança
  no Faturamento (`POST /cobrancas`) com `consulta_id`, `paciente_id` e `valor`. Se o
  Faturamento estiver indisponível, a consulta é finalizada mesmo assim.

## Solicitações de Cancelamento

```json
{ "id": 1, "consulta_id": 1, "status": "PENDENTE" }
```

Status: `PENDENTE`, `APROVADA`, `REJEITADA`. Ao aprovar, a consulta passa a
`CANCELADA`; ao rejeitar, permanece `AGENDADA`.

| Método | Endpoint                                   | Descrição                     |
| ------ | ------------------------------------------ | ----------------------------- |
| GET    | /solicitacoes-cancelamento/pendentes       | Listar pendentes (gerente)    |
| PUT    | /solicitacoes-cancelamento/{id}/aprovar    | Aprovar cancelamento          |
| PUT    | /solicitacoes-cancelamento/{id}/rejeitar   | Rejeitar cancelamento         |

## Escalas Médicas

```json
{
  "id": 1,
  "medico_id": 1,
  "consultorio_id": 1,
  "data_inicio_vigencia": "2026-06-01",
  "data_fim_vigencia": null,
  "dia_semana": "Segunda",
  "hora_inicial": "08:00",
  "hora_final": "12:00"
}
```

Na criação/atualização são validados conflito de horário do médico e ocupação do
consultório (retorna 409 em caso de conflito).

| Método | Endpoint      | Descrição           |
| ------ | ------------- | ------------------- |
| POST   | /escalas      | Criar escala médica |
| GET    | /escalas      | Listar escalas (filtro opcional: `medico_id`) |
| GET    | /escalas/{id} | Consultar escala    |
| PUT    | /escalas/{id} | Atualizar escala    |

---

# 3. Faturamento Service (porta 5002)

Responsável pela gestão financeira. **Implementado** em Flask com Blueprints.

## Valores de Consulta

```json
{ "id": 1, "valor": 250.0, "data_vigencia": "2026-06-01" }
```

| Método | Endpoint                | Descrição                          |
| ------ | ----------------------- | ---------------------------------- |
| GET    | /valores                | Listar valores                     |
| POST   | /valores                | Definir valor                      |
| GET    | /valores/vigente        | Consultar valor vigente            |
| GET    | /valores/{id}           | Consultar valor por id             |
| PUT    | /valores/{id}           | Atualizar valor                    |

> `GET /valores/vigente` retorna o valor com a **maior `data_vigencia` que não
> ultrapassa a data de referência** (vigente). Aceita `?data=YYYY-MM-DD` (padrão:
> hoje). É consumido pelo Agendamento no momento do agendamento.

## Pagamentos

```json
{ "id": 1, "consulta_id": 1, "paciente_id": 1, "valor": 250.0, "data_pagamento": "2026-06-20", "status": "PAGO" }
```

| Método | Endpoint         | Descrição                                              |
| ------ | ---------------- | ------------------------------------------------------ |
| GET    | /pagamentos      | Listar pagamentos (filtros: `paciente_id`, `consulta_id`) |
| POST   | /pagamentos      | Registrar pagamento                                    |
| GET    | /pagamentos/{id} | Consultar pagamento                                    |
| PUT    | /pagamentos/{id} | Atualizar pagamento                                    |

## Cobranças

```json
{ "id": 1, "consulta_id": 1, "paciente_id": 1, "valor": 250.0, "data_emissao": "2026-06-20", "status": "EMITIDA" }
```

| Método | Endpoint        | Descrição                                            |
| ------ | --------------- | ---------------------------------------------------- |
| GET    | /cobrancas      | Listar cobranças (filtros: `paciente_id`, `consulta_id`) |
| POST   | /cobrancas      | Emitir cobrança                                      |
| GET    | /cobrancas/{id} | Consultar cobrança                                   |
| PUT    | /cobrancas/{id} | Atualizar cobrança                                   |

> O paciente consulta o próprio histórico financeiro via `GET /cobrancas?paciente_id={id}`
> e `GET /pagamentos?paciente_id={id}`.

---

# 4. Comunicação Entre Microsserviços (Implementada)

A comunicação entre serviços é feita via REST/JSON e está **implementada** no
Agendamento Service (módulo `services/integracao.py`).

| Origem      | Destino     | Endpoint consumido          | Objetivo                        |
| ----------- | ----------- | --------------------------- | ------------------------------- |
| Agendamento | Cadastro    | GET /pacientes/{id}         | Validar paciente                |
| Agendamento | Cadastro    | GET /medicos/{id}           | Validar médico                  |
| Agendamento | Cadastro    | GET /especialidades/{id}    | Validar especialidade           |
| Agendamento | Faturamento | GET /valores/vigente        | Obter valor vigente da consulta |
| Agendamento | Faturamento | POST /cobrancas             | Emitir cobrança ao finalizar    |

As URLs dos serviços são configuráveis por variáveis de ambiente
(`CADASTRO_URL`, `FATURAMENTO_URL`), o que permite execução local e em containers.

## Tolerância a Falhas (Implementada)

As chamadas entre serviços usam **timeout**, e o comportamento em caso de falha
foi implementado conforme os requisitos:

- **Faturamento indisponível:** o agendamento prossegue normalmente; a consulta é
  criada com `valor_consulta` nulo (degradação graciosa).
- **Cadastro indisponível:** o serviço não quebra; a operação que dependia da
  validação retorna `503` de forma controlada.

---

# 5. Observações

Itens **implementados** recentemente:

- Autenticação por usuário/senha com **token JWT** e **autorização por perfil
  (RBAC)** nas operações de escrita dos três serviços (ver seção 0);
- Endpoints `DELETE` para as entidades de cadastro e para as escalas.

Itens ainda **não implementados** (previstos para evolução):

- API Gateway — modelado no diagrama de implantação, ainda não implementado;
- Versionamento de API, paginação e padronização completa de códigos de erro.
