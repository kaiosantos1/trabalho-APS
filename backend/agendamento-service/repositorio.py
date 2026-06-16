consultas = []
escalas = []
solicitacoes = []

_sequencias = {
    "consulta": 1,
    "escala": 1,
    "solicitacao": 1,
}


def proximo_id(entidade):
    valor = _sequencias[entidade]
    _sequencias[entidade] += 1
    return valor


def buscar_consulta(consulta_id):
    return next((c for c in consultas if c["id"] == consulta_id), None)


def buscar_escala(escala_id):
    return next((e for e in escalas if e["id"] == escala_id), None)


def buscar_solicitacao(solicitacao_id):
    return next((s for s in solicitacoes if s["id"] == solicitacao_id), None)
