# Documento de Descrição Arquitetural — Sistema de Gestão Clínica APS Health

## 1. Introdução

O presente documento descreve o problema abordado pelo sistema **APS Health**, a solução proposta, suas principais preocupações arquiteturais (*concerns*) e os pontos de vista utilizados para tratá-las.

---

## 2. Problema

Clínicas médicas possuem processos administrativos e operacionais complexos envolvendo diversos atores, como pacientes, médicos, atendentes, gerentes e diretores.

Entre os principais desafios encontrados estão:

* gerenciamento de consultas e horários;
* controle de escalas médicas;
* prevenção de conflitos de agenda;
* controle de cancelamentos;
* organização do faturamento;
* controle de permissões conforme perfil de usuário.

A execução manual desses processos pode gerar inconsistências, retrabalho, erros de agendamento e dificuldades de gestão.

---

## 3. Sistema Proposto

O **APS Health** é um sistema de gestão clínica baseado em arquitetura de microsserviços.

Sua proposta é automatizar os processos operacionais e administrativos da clínica por meio da separação de responsabilidades em domínios especializados.

O sistema foi dividido em três microsserviços principais:

| Microsserviço       | Responsabilidade                                                                  |
| ------------------- | --------------------------------------------------------------------------------- |
| Cadastro Service    | Gestão de pacientes, médicos, especialidades, consultórios, medicamentos e exames |
| Agendamento Service | Gestão de consultas, escalas médicas, cancelamentos e realização de consultas     |
| Faturamento Service | Gestão de cobranças, pagamentos e valores de consultas                            |

---

## 4. Principais Concerns do Sistema

### 4.1 Modularidade

O sistema deve possuir responsabilidades claramente separadas, reduzindo acoplamento entre funcionalidades.

### 4.2 Segurança

As funcionalidades devem respeitar permissões específicas por perfil de usuário.

Exemplos:

* paciente agenda consultas;
* médico realiza consultas;
* gerente aprova cancelamentos;
* diretor administra parâmetros institucionais.

### 4.3 Escalabilidade

O sistema deve permitir crescimento independente de partes específicas da aplicação.

### 4.4 Tolerância a Falhas

Falhas em um domínio não devem interromper totalmente o funcionamento da solução.

### 4.5 Manutenibilidade

O sistema deve facilitar futuras evoluções, correções e inclusão de funcionalidades.

### 4.6 Integridade dos Dados

Regras de negócio devem impedir inconsistências, como conflitos de horários médicos ou duplicidade de recursos.

---

## 5. Pontos de Vista e Perspectivas Arquiteturais

### 5.1 Visão Funcional

Relacionada às funcionalidades oferecidas pelo sistema e aos atores envolvidos.

Foi representada por meio dos diagramas de casos de uso e diagramas de atividades.

<img width="707" height="729" alt="image" src="https://github.com/user-attachments/assets/0d167f41-9137-4990-9af1-377a90fcce30" />
[Diagrama de Casos de Uso - Administração e Cadastros.pdf](https://github.com/user-attachments/files/29074584/Diagrama.de.Casos.de.Uso.-.Administracao.e.Cadastros.pdf)

<img width="591" height="782" alt="image" src="https://github.com/user-attachments/assets/5d851058-9e61-4726-b600-995a7ec539a1" />
[Diagra de Atividades - Agendar consulta.pdf](https://github.com/user-attachments/files/29074870/Diagra.de.Atividades.-.Agendar.consulta.pdf)

<img width="878" height="716" alt="image" src="https://github.com/user-attachments/assets/3e6d6b77-494e-4167-973d-ec984b2c2aaa" />
[Diagrama de Atividades - Cancelar Consulta.pdf](https://github.com/user-attachments/files/29074887/Diagrama.de.Atividades.-.Cancelar.Consulta.pdf)

<img width="671" height="692" alt="image" src="https://github.com/user-attachments/assets/82e27ca4-9169-4f2c-92c6-1560f97a3713" />
[Diagrama de Atividades - Criar Escala Médica.pdf](https://github.com/user-attachments/files/29074903/Diagrama.de.Atividades.-.Criar.Escala.Medica.pdf)

<img width="780" height="755" alt="image" src="https://github.com/user-attachments/assets/81cfb903-2672-4e9f-bf4c-8f4b7bec8e5b" />
[Diagrama de Atividades - Realizar Consulta.pdf](https://github.com/user-attachments/files/29074911/Diagrama.de.Atividades.-.Realizar.Consulta.pdf)

Essa visão atende preocupações ligadas a:

* fluxo operacional;
* responsabilidades dos atores;
* regras de negócio.

### 5.2 Visão Estrutural

Relacionada à organização interna do sistema.

Representada pelo diagrama de classes e separação em microsserviços.

Endereça:

* modularidade;
* organização do domínio;
* manutenibilidade.

### 5.3 Visão de Implantação

Relacionada à infraestrutura do sistema.

Representada pelo diagrama de implantação.
<img width="920" height="568" alt="image" src="https://github.com/user-attachments/assets/405e6bf0-c48f-4e80-801c-3e5da7e8a41c" />
[Diagrama de Implantação.pdf](https://github.com/user-attachments/files/29074954/Diagrama.de.Implantacao.pdf)


Endereça:

* distribuição dos microsserviços;
* isolamento dos bancos de dados;
* comunicação entre serviços;
* escalabilidade.

### 5.4 Perspectiva de Segurança

Relacionada ao controle de acesso baseado em perfis.

Implementada via RBAC: autenticação com token JWT e autorização por perfil nas operações de escrita dos serviços.

Endereça:

* autenticação e autorização;
* restrição de acesso;
* separação de responsabilidades.

### 5.5 Perspectiva de Resiliência

Relacionada à continuidade operacional do sistema.

Utiliza separação por microsserviços e independência entre domínios.

Endereça:

* tolerância a falhas;
* isolamento de problemas;
* continuidade parcial da operação.

---

## 6. Conclusão

A arquitetura proposta para o sistema APS Health foi concebida para atender às necessidades de gestão clínica através de modularização baseada em microsserviços.

Os concerns identificados foram tratados por diferentes visões arquiteturais, permitindo melhor organização do sistema, separação de responsabilidades, segurança, escalabilidade e capacidade de evolução futura.
