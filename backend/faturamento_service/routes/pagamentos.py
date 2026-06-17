from flask import Blueprint, jsonify, request

import repositorio

pagamentos_bp = Blueprint("pagamentos", __name__)

@pagamentos_bp.route("/pagamentos", methods=["GET"])
def listar_pagamentos():
    return jsonify(repositorio.listar("pagamentos"))


@pagamentos_bp.route("/pagamentos", methods=["POST"])
def criar_pagamento():
    dados = request.get_json()

    novo_pagamento = repositorio.inserir("pagamentos", "pagamento", {
        "data_pagamento": dados.get("data_pagamento"),
        "status": dados.get("status")
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
    dados = request.get_json()

    pagamento = repositorio.buscar("pagamentos", id)
    if pagamento is not None:
        pagamento = repositorio.atualizar("pagamentos", id, {
            "data_pagamento": dados.get("data_pagamento", pagamento["data_pagamento"]),
            "status": dados.get("status", pagamento["status"])
        })
        return jsonify(pagamento)

    return jsonify({"erro": "Pagamento não encontrado"}), 404