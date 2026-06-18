# Sistema de Gestão de Clínicas 
## APS Health

Projeto acadêmico desenvolvido para modelagem de um **Sistema de Gestão Clínicas baseado em Arquitetura de Microsserviços**.

O sistema foi projetado para atender às necessidades operacionais da clínica médica **APS Health**, contemplando cadastro administrativo, agendamento clínico e gestão financeira das consultas.

---

## Objetivo do Projeto

Desenvolver a modelagem de um sistema clínico utilizando conceitos de:

* Arquitetura de Microsserviços
* Modelagem de Requisitos
* Casos de Uso
* Domínios de Negócio
* APIs REST
* Controle de Acesso por Perfis
* Tolerância a Falhas
* Documentação Técnica

---

## Arquitetura do Sistema

O sistema está organizado em três domínios principais:

### 1. Cadastro e Gestão Administrativa Service

Responsável pelo gerenciamento de:

* Pacientes
* Médicos
* Especialidades
* Consultórios
* Medicamentos
* Exames

---

### 2. Agendamento Clínico Service

Responsável pelo gerenciamento de:

* Escalas Médicas
* Disponibilidades
* Agendamentos
* Reagendamentos
* Cancelamentos
* Realização das Consultas

---

### 3. Faturamento e Cobrança Service

Responsável pelo gerenciamento de:

* Valores vigentes das consultas
* Pagamentos
* Cobranças
* Histórico financeiro

---

## Perfis de Usuário

O sistema utiliza **controle de acesso baseado em perfis**.

Perfis previstos:

* Diretor
* Gerente
* Médico
* Atendente
* Paciente

---

## Tecnologias Utilizadas

* Microsserviços (Flask)
* APIs REST com mensagens em JSON
* Autenticação JWT e controle de acesso por perfil (RBAC)
* MongoDB — um banco independente por serviço
* Docker e Docker Compose
* Frontend em JavaScript (servido em container Nginx)

---

## Funcionalidades Principais

### Autoatendimento do Paciente

* Cadastro próprio
* Atualização cadastral
* Consulta de médicos e especialidades
* Agendamento de consultas
* Reagendamento
* Solicitação de cancelamento
* Consulta de cobranças

### Operações Administrativas

* Gestão de médicos
* Gestão de escalas
* Cadastro administrativo
* Registro de pagamentos
* Emissão de cobranças

### Atendimento Clínico

* Início da consulta
* Registro clínico
* Prescrição de medicamentos
* Solicitação de exames
* Encerramento da consulta

---

## Status do Projeto

**Implementação funcional** — modelagem, documentação e desenvolvimento dos três
microsserviços concluídos; aplicação executável via Docker Compose (frontend +
backend + MongoDB). Itens em aberto: API Gateway e deploy em produção.

### Modelagem e Documentação
- [x] Levantamento de requisitos
- [x] Modelagem do minimundo
- [x] Definição da arquitetura de microsserviços
- [x] Diagramas de Casos de Uso
- [x] Diagrama de Estados
- [x] Diagrama de Implantação
- [x] Diagramas de Atividades (4)
- [x] Diagrama de Classes
- [x] Documento de Padrões de Software
- [x] Documento de Descrição do Sistema e Concerns
- [x] API Contracts

### Desenvolvimento
- [x] Estruturação dos microsserviços
- [x] Implementação das entidades/modelos
- [x] Implementação das regras de negócio (disponibilidade, janela temporal, valor congelado, cobrança automática)
- [x] Implementação das APIs REST
- [x] Comunicação entre microsserviços (validação + valor vigente + emissão de cobrança)
- [x] Persistência de dados (MongoDB — um banco por serviço)
- [x] Controle de acesso por perfis (RBAC) — autenticação por usuário/senha (JWT) e autorização por perfil nas operações de escrita dos 3 serviços

### Infraestrutura
- [x] Containerização com Docker (inclui o frontend)
- [x] Configuração do ambiente (Docker Compose)
- [x] Testes integrados (fluxo completo + cenários de tolerância a falhas validados)
- [ ] Deploy — projeto pronto para deploy;
