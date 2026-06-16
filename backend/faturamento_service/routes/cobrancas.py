from flask import Blueprint, jsonify, request

cobrancas_bp = Blueprint("cobrancas", __name__)

cobrancas = []
proximo_id_cobranca = 1


@cobrancas_bp.route("/cobrancas", methods=["GET"])
def listar_cobrancas():
    return jsonify(cobrancas)


@cobrancas_bp.route("/cobrancas", methods=["POST"])
def criar_cobranca():
    global proximo_id_cobranca

    dados = request.get_json()

    nova_cobranca = {
        "id": proximo_id_cobranca,
        "valor": dados.get("valor"),
        "data_emissao": dados.get("data_emissao"),
        "status": dados.get("status")
    }

    cobrancas.append(nova_cobranca)
    proximo_id_cobranca += 1

    return jsonify(nova_cobranca), 201


@cobrancas_bp.route("/cobrancas/<int:id>", methods=["GET"])
def buscar_cobranca(id):
    for cobranca in cobrancas:
        if cobranca["id"] == id:
            return jsonify(cobranca)

    return jsonify({"erro": "Cobrança não encontrada"}), 404


@cobrancas_bp.route("/cobrancas/<int:id>", methods=["PUT"])
def atualizar_cobranca(id):
    dados = request.get_json()

    for cobranca in cobrancas:
        if cobranca["id"] == id:
            cobranca["valor"] = dados.get("valor", cobranca["valor"])
            cobranca["data_emissao"] = dados.get(
                "data_emissao",
                cobranca["data_emissao"]
            )
            cobranca["status"] = dados.get(
                "status",
                cobranca["status"]
            )

            return jsonify(cobranca)

    return jsonify({"erro": "Cobrança não encontrada"}), 404