from flask import Blueprint, jsonify, request

import repositorio

pagamentos_bp = Blueprint("pagamentos", __name__)


@pagamentos_bp.route("/pagamentos", methods=["GET"])
def listar_pagamentos():
    # Filtros opcionais permitem ao paciente consultar apenas os seus pagamentos.
    paciente_id = request.args.get("paciente_id", type=int)
    consulta_id = request.args.get("consulta_id", type=int)

    resultado = repositorio.listar("pagamentos")
    if paciente_id is not None:
        resultado = [p for p in resultado if p.get("paciente_id") == paciente_id]
    if consulta_id is not None:
        resultado = [p for p in resultado if p.get("consulta_id") == consulta_id]

    return jsonify(resultado)


@pagamentos_bp.route("/pagamentos", methods=["POST"])
def criar_pagamento():
    dados = request.get_json(silent=True) or {}

    novo_pagamento = repositorio.inserir("pagamentos", "pagamento", {
        "consulta_id": dados.get("consulta_id"),
        "paciente_id": dados.get("paciente_id"),
        "valor": dados.get("valor"),
        "data_pagamento": dados.get("data_pagamento"),
        "status": dados.get("status", "PAGO")
    })

    return jsonify(novo_pagamento), 201


@pagamentos_bp.route("/pagamentos/<int:id>", methods=["GET"])
def buscar_pagamento(id):
    pagamento = repositorio.buscar("pagamentos", id)
    if pagamento is not None:
        return jsonify(pagamento)

    return jsonify({"erro": "Pagamento não encontrado"}), 404


@pagamentos_bp.route("/pagamentos/<int:id>", methods=["PUT"])
def atualizar_pagamento(id):
    dados = request.get_json(silent=True) or {}

    pagamento = repositorio.buscar("pagamentos", id)
    if pagamento is not None:
        pagamento = repositorio.atualizar("pagamentos", id, {
            "consulta_id": dados.get("consulta_id", pagamento.get("consulta_id")),
            "paciente_id": dados.get("paciente_id", pagamento.get("paciente_id")),
            "valor": dados.get("valor", pagamento.get("valor")),
            "data_pagamento": dados.get("data_pagamento", pagamento["data_pagamento"]),
            "status": dados.get("status", pagamento["status"])
        })
        return jsonify(pagamento)

    return jsonify({"erro": "Pagamento não encontrado"}), 404
