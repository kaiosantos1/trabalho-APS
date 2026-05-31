# Documento de Padrões de Software

## Sistema de Gestão Clínica Areas Health

**Versão:** 1.0
**Arquitetura:** Microsserviços

---

# 1. Introdução

Este documento descreve os padrões de software adotados no desenvolvimento do sistema **Areas Health**.

Os padrões apresentados foram selecionados considerando os requisitos do projeto, o minimundo definido, os diagramas UML produzidos e a arquitetura baseada em microsserviços.

O objetivo é favorecer:

* separação de responsabilidades;
* modularidade;
* escalabilidade;
* organização por domínio de negócio;
* segurança baseada em perfis.

---

# 2. Padrões Arquiteturais

## 2.1. Arquitetura de Microsserviços

### Onde foi aplicado

Organização geral do sistema.

### Descrição

O sistema foi dividido em serviços independentes, cada um responsável por um domínio de negócio específico.

| Microsserviço       | Responsabilidade                                                                         |
| ------------------- | ---------------------------------------------------------------------------------------- |
| Cadastro Service    | gerenciamento de pacientes, médicos, especialidades, consultórios, medicamentos e exames |
| Agendamento Service | gerenciamento de consultas, escalas médicas e cancelamentos                              |
| Faturamento Service | gerenciamento de cobranças, pagamentos e valores de consulta                             |

### Por que foi utilizado

* separação dos domínios do sistema;
* menor acoplamento entre funcionalidades;
* maior organização arquitetural;
* possibilidade de evolução independente dos serviços.

---

## 2.2. Database per Service

### Onde foi aplicado

Persistência dos dados de cada microsserviço.

### Descrição

Cada microsserviço possui seu próprio banco de dados, evitando compartilhamento direto entre domínios.

### Estrutura modelada

| Microsserviço       | Banco               |
| ------------------- | ------------------- |
| Cadastro Service    | mongodb-cadastro    |
| Agendamento Service | mongodb-agendamento |
| Faturamento Service | mongodb-faturamento |

### Por que foi utilizado

* isolamento dos dados;
* independência entre domínios;
* redução de acoplamento entre serviços.

---

# 3. Padrões de Comunicação

## 3.1. API Gateway

### Onde foi aplicado

Entrada do sistema e comunicação com os microsserviços.

### Descrição

Foi modelado um **API Gateway** como ponto único de entrada do sistema.

Todas as requisições do cliente passam inicialmente pelo gateway, que direciona a solicitação ao microsserviço responsável.

### Responsabilidades modeladas

* roteamento de requisições;
* ponto único de acesso;
* centralização futura das políticas de segurança;
* suporte ao controle de acesso por perfis.

### Por que foi utilizado

* simplifica a comunicação com o cliente;
* reduz necessidade de acesso direto aos serviços internos;
* centraliza responsabilidades comuns.

---

## 3.2. Comunicação REST *(planejada)*

### Onde será aplicada

Comunicação entre gateway e microsserviços.

### Descrição

A arquitetura foi modelada considerando comunicação baseada em APIs REST utilizando troca de dados estruturados.

### Observação

A implementação detalhada desta comunicação será definida nas etapas de desenvolvimento do código.

---

# 4. Padrões de Segurança

## 4.1. RBAC — Role-Based Access Control

### Onde foi aplicado

Modelagem das permissões e responsabilidades do sistema.

### Descrição

O sistema utiliza controle de acesso baseado em perfis de usuário.

Cada papel possui responsabilidades específicas definidas pelo minimundo.

| Perfil    | Responsabilidades                                       |
| --------- | ------------------------------------------------------- |
| Paciente  | autocadastro, agendamento, cancelamento                 |
| Atendente | cadastro de pacientes, pagamentos                       |
| Médico    | realização de consultas                                 |
| Gerente   | gerenciamento de médicos, escalas e aprovações          |
| Diretor   | gerenciamento de especialidades, consultórios e valores |

### Por que foi utilizado

* separação clara de responsabilidades;
* organização das permissões do sistema;
* controle de acesso baseado no papel do usuário.

---

# 5. Padrões de Implantação

## 5.1. Containerização com Docker *(arquitetura prevista)*

### Onde será aplicada

Implantação dos microsserviços.

### Descrição

O diagrama de implantação modela um ambiente baseado em **Docker / Cloud VM**, no qual os serviços poderão ser executados de forma isolada.

### Objetivos previstos

* isolamento entre serviços;
* padronização do ambiente;
* facilidade futura de implantação.

---

# 6. Padrões Planejados para Evolução do Projeto

> **Observação:** Os itens desta seção ainda não foram implementados e serão definidos durante a fase de desenvolvimento.

---

## 6.1. Repository Pattern *(futuro)*

### Objetivo

Encapsular a lógica de acesso aos bancos MongoDB.

### Possível aplicação futura

* PacienteRepository
* ConsultaRepository
* PagamentoRepository

---

## 6.2. DTO — Data Transfer Object *(futuro)*

### Objetivo

Separar objetos de API dos objetos internos do domínio.

### Possível aplicação futura

* ConsultaRequestDTO
* ConsultaResponseDTO
* PacienteDTO

---

## 6.3. Estratégias de Resiliência *(futuro)*

### Possíveis padrões

* Circuit Breaker
* Timeout
* Retry

### Objetivo

Melhorar tolerância a falhas na comunicação entre microsserviços.

---

## 6.4. Docker Compose *(futuro)*

### Objetivo

Orquestração do ambiente de desenvolvimento e testes.

---

# 7. Conclusão

Os padrões selecionados refletem a arquitetura e os artefatos atualmente produzidos no projeto Areas Health.

O sistema foi modelado utilizando princípios de:

* microsserviços;
* separação de responsabilidades;
* isolamento de dados;
* segurança baseada em perfis;
* arquitetura preparada para evolução futura.

As próximas etapas do desenvolvimento permitirão detalhar e implementar os padrões previstos para persistência, comunicação e resiliência.
