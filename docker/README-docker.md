## Execucao com Docker e MongoDB

Este diretório concentra a orquestração dos microsserviços da APS Health com
MongoDB independente por serviço.

### Estrutura

- `frontend` (Nginx) servindo o site
- `cadastro-service` com seu próprio MongoDB
- `agendamento-service` com seu próprio MongoDB
- `faturamento-service` com seu próprio MongoDB

### Subir o ambiente

Execute a partir da pasta `docker`:

```bash
docker compose up --build
```

### Portas expostas

- Frontend (site): `8080`
- Cadastro Service: `5001`
- Faturamento Service: `5002`
- Agendamento Service: `5003`

### Bancos MongoDB

- Cadastro Mongo: `27017`
- Agendamento Mongo: `27018`
- Faturamento Mongo: `27019`

### Variáveis principais

- `MONGO_URI`
- `MONGO_DB`
- `CADASTRO_URL`
- `FATURAMENTO_URL`
- `SERVICOS_TIMEOUT`
- `JWT_SECRET` (assinatura do token de login)
- `INTERNAL_TOKEN` (autenticação das chamadas internas entre serviços)

### Observações

- Cada serviço roda em container independente.
- Os dados são persistidos em volumes separados.
- O agendamento-service mantém a lógica de tolerância a falhas para depender
	do cadastro e do faturamento sem derrubar o próprio fluxo quando um deles
	estiver indisponível.
