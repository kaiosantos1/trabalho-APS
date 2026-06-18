# Documentação do Sistema - APS Health
---

# Estrutura da Documentação

## `/Arquitetura`

Documentação relacionada à organização arquitetural do sistema.

### Arquivos

* `microsservicos.md`
  Descrição dos microsserviços do sistema, suas responsabilidades, domínios de negócio, comunicação entre serviços e principais endpoints.

* `api-contracts.md`
  Contratos das APIs REST efetivamente implementadas, incluindo autenticação/RBAC, endpoints por entidade e comunicação entre serviços.

---

## `/diagramas`

Contém todos os diagramas UML produzidos durante a modelagem do sistema.

### `/atividades`

Diagramas de fluxo operacional das funcionalidades principais.

Diagramas desenvolvidos:

* Agendar Consulta
* Cancelar Consulta
* Realizar Consulta
* Criar Escala Médica

---

### `/casos-de-uso`

Diagramas representando os atores e funcionalidades do sistema.

Inclui:

* Diagrama de Casos de Uso: Administração e Cadastro
* Diagrama de Casos de Uso: Gestão de Consultas e Autoatendimento

---

### `/classes`

Diagrama estrutural das entidades, relacionamentos e organização dos microsserviços.

Inclui:

* Diagrama de Classes do sistema APS Health.

---

### `/estados`

Modelagem do ciclo de vida dos objetos do domínio.

Inclui:

* Diagrama de Estados da Consulta.

---

### `/Implantacao`

Documentação da arquitetura física e implantação do sistema.

Inclui:

* Diagrama de Implantação com microsserviços;
* Comunicação REST;
* API Gateway;
* Bancos independentes por serviço;
* Estrutura Docker/Cloud VM.

---

## `/Documento com os Padroes utilizados`

Documentação dos padrões arquiteturais, estruturais e organizacionais adotados no projeto.

### Arquivos

* `Documento_dos_padroes.md`
  Documento principal contendo os padrões utilizados.

* `Padroes utilizados (versao principal).docx`
  Versão editável do documento em formato Word.

Conteúdo abordado:

* Arquitetura de Microsserviços
* Database per Service
* API REST
* API Gateway (planejado)
* RBAC (implementado: JWT + perfis)
* Padrões planejados para evolução futura

---

## `/Documento de Descrição Arquitetural`

Documentação referente à descrição do problema, solução proposta, concerns e pontos de vista arquiteturais.

### Arquivos

* `Descrição_Arquitetural.md`
* `Descrição_Arquitetural (versao principal).docx`

Conteúdo abordado:

* Problema do domínio clínico
* Sistema como solução proposta
* Concerns arquiteturais
* Pontos de vista
* Perspectivas arquiteturais

---

## `/minimundo`

Descrição formal do domínio do sistema.

### Arquivos

* `minimundo.md`
* `minimundo (versao principal).docx`

Conteúdo abordado:

* Regras de negócio
* Entidades do domínio
* Restrições do sistema
* Fluxos operacionais
* Responsabilidades dos atores


---

# Status da Documentação

| Documento                           | Status      |
| ----------------------------------- | ----------- |
| Minimundo                           | Completo  |
| Microsserviços                      | Completo  |
| Casos de Uso                        | Completo  |
| Diagramas de Atividades             | Completo  |
| Diagrama de Estados                 | Completo  |
| Diagrama de Implantação             | Completo  |
| Diagrama de Classes                 | Completo  |
| Documento de Padrões                | Completo  |
| Documento de Descrição Arquitetural | Completo  |
| Backend (3 microsserviços + MongoDB)| Implementado |
| Frontend (áreas por perfil)         | Implementado |
| API Contracts                       | Completo  |

---
