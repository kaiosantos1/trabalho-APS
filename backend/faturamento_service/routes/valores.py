from flask import Blueprint, jsonify, request

valores_bp = Blueprint("valores", __name__)

valores = []
proximo_id_valor = 1


@valores_bp.route("/valores", methods=["GET"])
def listar_valores():
    return jsonify(valores)


@valores_bp.route("/valores", methods=["POST"])
def criar_valor():
    global proximo_id_valor

    dados = request.get_json()

    novo_valor = {
        "id": proximo_id_valor,
        "valor": dados.get("valor"),
        "data_vigencia": dados.get("data_vigencia")
    }

    valores.append(novo_valor)
    proximo_id_valor += 1

    return jsonify(novo_valor), 201


@valores_bp.route("/valores/<int:id>", methods=["PUT"])
def atualizar_valor(id):
    dados = request.get_json()

    for valor in valores:
        if valor["id"] == id:
            valor["valor"] = dados.get("valor", valor["valor"])
            valor["data_vigencia"] = dados.get(
                "data_vigencia",
                valor["data_vigencia"]
            )

            return jsonify(valor)

    return jsonify({"erro": "Valor não encontrado"}), 404


@valores_bp.route("/valores/vigente", methods=["GET"])
def obter_valor_vigente():

    if not valores:
        return jsonify({"erro": "Nenhum valor cadastrado"}), 404

    return jsonify(valores[-1])