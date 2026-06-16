from flask import Blueprint, jsonify, request

pagamentos_bp = Blueprint("pagamentos", __name__)

pagamentos = []
proximo_id_pagamento = 1


@pagamentos_bp.route("/pagamentos", methods=["GET"])
def listar_pagamentos():
    return jsonify(pagamentos)


@pagamentos_bp.route("/pagamentos", methods=["POST"])
def criar_pagamento():
    global proximo_id_pagamento

    dados = request.get_json()

    novo_pagamento = {
        "id": proximo_id_pagamento,
        "data_pagamento": dados.get("data_pagamento"),
        "status": dados.get("status")
    }

    pagamentos.append(novo_pagamento)
    proximo_id_pagamento += 1

    return jsonify(novo_pagamento), 201


@pagamentos_bp.route("/pagamentos/<int:id>", methods=["GET"])
def buscar_pagamento(id):
    for pagamento in pagamentos:
        if pagamento["id"] == id:
            return jsonify(pagamento)

    return jsonify({"erro": "Pagamento não encontrado"}), 404


@pagamentos_bp.route("/pagamentos/<int:id>", methods=["PUT"])
def atualizar_pagamento(id):
    dados = request.get_json()

    for pagamento in pagamentos:
        if pagamento["id"] == id:
            pagamento["data_pagamento"] = dados.get(
                "data_pagamento",
                pagamento["data_pagamento"]
            )

            pagamento["status"] = dados.get(
                "status",
                pagamento["status"]
            )

            return jsonify(pagamento)

    return jsonify({"erro": "Pagamento não encontrado"}), 404