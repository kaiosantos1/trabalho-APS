# Documento de Padrões de Software

## Sistema de Gestão Clínica Areas Health

**Versão:** 1.1
**Data:** junho/2026
**Arquitetura:** Microsserviços

> **Observação:** itens marcados como **(Planejado)** ou **(Futuro)** ainda não
> foram implementados; os demais já se encontram implementados no código.

---

# 1. Introdução

Este documento descreve os padrões de software adotados no sistema **Areas Health**,
um sistema de gestão clínica baseado em arquitetura de microsserviços.

Diferentemente da versão anterior — em que a maioria dos padrões estava apenas
modelada — esta versão reflete o **estado atual de implementação**: três
microsserviços independentes em execução (Cadastro, Agendamento e Faturamento),
comunicando-se via REST/JSON, com tolerância a falhas implementada. Os padrões
ainda não codificados estão sinalizados como planejados ou futuros.

---

# 2. Padrões Arquiteturais

## 2.1. Arquitetura de Microsserviços — Implementado

**Onde foi aplicado:** organização geral do sistema.

**Descrição:** o sistema foi dividido em serviços independentes, cada um
responsável por um domínio de negócio e executável de forma isolada.

| Microsserviço       | Porta | Responsabilidade                                                       |
| ------------------- | ----- | ---------------------------------------------------------------------- |
| Cadastro Service    | 5001  | Pacientes, médicos, especialidades, consultórios, medicamentos, exames |
| Agendamento Service | 5003  | Consultas, escalas médicas, cancelamentos, realização de consultas     |
| Faturamento Service | 5002  | Valores de consulta, pagamentos, cobranças                             |

**Por que foi utilizado:** separação dos domínios, menor acoplamento, evolução e
implantação independentes de cada serviço.

## 2.2. Database per Service — Parcialmente implementado

**Onde foi aplicado:** persistência de cada microsserviço.

**Descrição:** cada microsserviço gerencia exclusivamente seus próprios dados, sem
compartilhamento direto entre domínios. Atualmente os dados são mantidos **em
memória** em cada serviço, garantindo o isolamento lógico previsto pelo padrão.

**Situação:** o isolamento por serviço já está implementado; a **persistência
definitiva em banco de dados (MongoDB) é planejada** para a evolução do projeto.

**Por que foi utilizado:** isolamento dos dados, independência entre domínios e
redução de acoplamento.

---

# 3. Padrões de Organização de Código

## 3.1. Modularização por Blueprints — Implementado

**Onde foi aplicado:** Cadastro, Agendamento e Faturamento Services.

**Descrição:** cada serviço organiza suas rotas em **Blueprints do Flask**,
separadas por entidade ou domínio (ex.: `pacientes`, `medicos`, `consultas`,
`escalas`, `cancelamentos`, `valores`, `cobrancas`, `pagamentos`).

**Por que foi utilizado:** melhor organização, menor complexidade do arquivo
principal e facilidade de manutenção.

## 3.2. Separação de Responsabilidades — Implementado

**Onde foi aplicado:** os três serviços.

**Descrição:** o `app.py` de cada serviço cuida apenas da inicialização e do
registro das rotas; a lógica de cada endpoint fica nos módulos específicos.

**Por que foi utilizado:** reduz acoplamento, melhora a legibilidade e facilita a
evolução.

## 3.3. Repositório em Memória — Estrutura inicial

**Onde foi aplicado:** Agendamento Service (`repositorio.py`).

**Descrição:** o Agendamento centraliza o acesso aos dados (consultas, escalas e
solicitações) em um módulo único, isolando o armazenamento das rotas. É uma
estrutura inicial no sentido do **Repository Pattern**: quando a persistência
definitiva for adotada, apenas esse módulo precisará mudar.

---

# 4. Padrões de Comunicação

## 4.1. API REST — Implementado

**Onde foi aplicado:** comunicação cliente↔serviços e entre serviços.

**Descrição:** todos os serviços expõem APIs REST com mensagens em **JSON**. Os
contratos completos estão no documento de API Contracts.

**Por que foi utilizado:** simplicidade, ampla compatibilidade e desacoplamento.

## 4.2. Comunicação entre Microsserviços — Implementado

**Onde foi aplicado:** Agendamento Service (`services/integracao.py`).

**Descrição:** ao agendar uma consulta, o Agendamento consome outros serviços:

| Origem      | Destino     | Objetivo                        |
| ----------- | ----------- | ------------------------------- |
| Agendamento | Cadastro    | Validar paciente, médico, especialidade |
| Agendamento | Faturamento | Obter o valor vigente da consulta       |

Toda a integração está isolada em um módulo próprio, configurável por variáveis de
ambiente (`CADASTRO_URL`, `FATURAMENTO_URL`), o que viabiliza a execução local e
em containers.

## 4.3. API Gateway — Modelado (Planejado)

**Onde foi aplicado:** diagrama de implantação.

**Descrição:** foi modelado um API Gateway como ponto único de entrada e
roteamento. **Ainda não implementado** — atualmente os clientes acessam os
serviços diretamente.

---

# 5. Padrões de Resiliência / Tolerância a Falhas

## 5.1. Timeout — Implementado

**Descrição:** todas as chamadas entre serviços usam um tempo limite (timeout)
configurável, evitando que uma dependência lenta trave o serviço chamador.

## 5.2. Degradação Graciosa (Fallback) — Implementado

**Onde foi aplicado:** Agendamento Service.

**Descrição:** o comportamento em caso de falha de um serviço dependente foi
implementado conforme o requisito de tolerância a falhas:

- **Faturamento indisponível:** o agendamento prossegue; a consulta é criada com
  `valor_consulta` nulo.
- **Cadastro indisponível:** o serviço não quebra; retorna `503` de forma
  controlada na operação que dependia da validação.

**Por que foi utilizado:** garante que a indisponibilidade de um serviço não
interrompa todo o sistema — exatamente o cenário de tolerância a falhas do projeto.

## 5.3. Circuit Breaker / Retry — Futuro

**Descrição:** mecanismos adicionais de resiliência previstos para evolução; ainda
não implementados (apenas o Timeout e a degradação graciosa foram aplicados).

---

# 6. Padrões de Segurança

## 6.1. Controle de Acesso por Perfis (RBAC conceitual) — Modelado

**Onde foi aplicado:** regras de negócio e modelagem.

**Descrição:** o sistema define perfis (Paciente, Atendente, Médico, Gerente,
Diretor), cada um com responsabilidades específicas.

| Perfil    | Responsabilidades                                       |
| --------- | ------------------------------------------------------- |
| Paciente  | Autocadastro, agendamento, remarcação, cancelamento     |
| Atendente | Cadastro de pacientes, registro de pagamentos           |
| Médico    | Realização de consultas, prescrições, solicitação de exames |
| Gerente   | Gestão de médicos, escalas e aprovação de cancelamentos |
| Diretor   | Gestão de especialidades, consultórios e valores        |

**Situação:** o modelo de perfis está definido, mas a **camada técnica de
autenticação/autorização ainda não foi implementada (Planejado)**.

---

# 7. Padrões de Modelagem

## 7.1. Enumeração de Estados — Implementado em código

**Onde foi aplicado:** Agendamento Service (`estados.py`).

**Descrição:** os estados da consulta são representados por uma enumeração
(`EstadoConsulta`): `AGENDADA`, `EM_ANDAMENTO`, `FINALIZADA`, `CANCELADA`. A
transição entre estados é validada nas regras de negócio.

**Por que foi utilizado:** evita valores inválidos e torna as regras de negócio
mais claras.

## 7.2. Classe Associativa — Modelado e refletido em código

**Onde foi aplicado:** relacionamento entre Consulta e Exame.

**Descrição:** a classe associativa **ExameSolicitado** (atributos `resultado` e
`data_realizacao`) representa dados próprios da associação. Reflete-se no código
na lista `exames_solicitados` de cada consulta.

---

# 8. Padrões de Implantação

## 8.1. Containerização com Docker — Planejado

**Descrição:** o diagrama de implantação modela cada serviço em um container
Docker independente, com seu próprio banco. **Ainda não implementado** — em
preparação pela equipe.

## 8.2. Orquestração com Docker Compose — Planejado

**Descrição:** orquestração dos três serviços em rede, prevista para subir o
ambiente completo com um único comando.

---

# 9. Padrões Planejados para Evolução

> Itens ainda não implementados.

- **DTO (Data Transfer Object):** separar objetos de API dos objetos internos.
- **Repository Pattern completo:** abstrair a persistência definitiva.
- **Circuit Breaker / Retry:** resiliência adicional entre serviços.

---

# 10. Resumo dos Padrões

| Padrão                              | Categoria     | Situação                          |
| ----------------------------------- | ------------- | --------------------------------- |
| Arquitetura de Microsserviços       | Arquitetural  | Implementado                      |
| Database per Service                | Arquitetural  | Isolamento implementado; BD planejado |
| Modularização por Blueprints        | Organização   | Implementado                      |
| Separação de Responsabilidades      | Organização   | Implementado                      |
| Repositório em memória              | Organização   | Estrutura inicial                 |
| API REST                            | Comunicação   | Implementado                      |
| Comunicação entre Microsserviços    | Comunicação   | Implementado                      |
| API Gateway                         | Comunicação   | Modelado (Planejado)              |
| Timeout                             | Resiliência   | Implementado                      |
| Degradação Graciosa (Fallback)      | Resiliência   | Implementado                      |
| Circuit Breaker / Retry             | Resiliência   | Futuro                            |
| RBAC (conceitual)                   | Segurança     | Modelado                          |
| Enumeração de Estados               | Modelagem     | Implementado em código            |
| Classe Associativa                  | Modelagem     | Modelado / refletido em código    |
| Containerização com Docker          | Implantação   | Planejado                         |
| Docker Compose                      | Implantação   | Planejado                         |
| DTO                                 | Dados         | Futuro                            |

---

# 11. Conclusão

O projeto Areas Health evoluiu da fase de modelagem para uma implementação
funcional: três microsserviços independentes, comunicando-se via REST/JSON, com
isolamento de dados por serviço e tolerância a falhas implementada (timeout e
degradação graciosa).

Os padrões já aplicados favorecem modularidade, separação de responsabilidades,
baixo acoplamento e organização por domínio de negócio. Os itens ainda planejados
— persistência definitiva, API Gateway, autenticação/autorização e containerização
— estão claramente identificados e direcionam a continuidade do desenvolvimento.
