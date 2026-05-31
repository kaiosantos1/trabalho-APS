# Sistema de Gestão de Clínicas 
## Areas Health

Projeto acadêmico desenvolvido para modelagem de um **Sistema de Gestão Clínicas baseado em Arquitetura de Microsserviços**.

O sistema foi projetado para atender às necessidades operacionais da clínica médica **Areas Health**, contemplando cadastro administrativo, agendamento clínico e gestão financeira das consultas.

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

## Tecnologias Previstas

Tecnologias planejadas para implementação futura:

* Microsserviços
* APIs REST
* JSON
* Docker
* Banco de dados independente por serviço

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

**Em desenvolvimento**

Atualmente o projeto encontra-se na fase de:

* [x] Levantamento de requisitos
* [x] Modelagem do minimundo
* [x] Definição de microsserviços
* [x] Diagrama de Casos de Uso
* [x] Diagrama de Estados
* [x] Diagrama de Implementação
* [x] Diagrama de Atividades (3)
* [ ] Diagrama de Classes (Enxuto)
* [ ] Documento de Padrões de Software
* [ ] Documento do Sistema + Concerns
* [ ] Modelagem complementar
* [ ] Implementação dos serviços
* [ ] Containerização
* [ ] APIs REST
* [ ] Deploy

