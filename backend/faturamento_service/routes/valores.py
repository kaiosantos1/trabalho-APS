from flask import Blueprint, jsonify, request

import repositorio

valores_bp = Blueprint("valores", __name__)

@valores_bp.route("/valores", methods=["GET"])
def listar_valores():
    return jsonify(repositorio.listar("valores"))


@valores_bp.route("/valores", methods=["POST"])
def criar_valor():
    dados = request.get_json()

    novo_valor = repositorio.inserir("valores", "valor", {
        "valor": dados.get("valor"),
        "data_vigencia": dados.get("data_vigencia")
    })

    return jsonify(novo_valor), 201


@valores_bp.route("/valores/vigente", methods=["GET"])
def obter_valor_vigente():
    valores = repositorio.listar("valores")
    if not valores:
        return jsonify({"erro": "Nenhum valor cadastrado"}), 404

    return jsonify(valores[-1])


@valores_bp.route("/valores/<int:id>", methods=["GET"])
def buscar_valor(id):
    valor = repositorio.buscar("valores", id)
    if valor is not None:
        return jsonify(valor)

    return jsonify({"erro": "Valor não encontrado"}), 404


@valores_bp.route("/valores/<int:id>", methods=["PUT"])
def atualizar_valor(id):
    dados = request.get_json()

    valor = repositorio.buscar("valores", id)
    if valor is not None:
        valor = repositorio.atualizar("valores", id, {
            "valor": dados.get("valor", valor["valor"]),
            "data_vigencia": dados.get("data_vigencia", valor["data_vigencia"])
        })
        return jsonify(valor)

    return jsonify({"erro": "Valor não encontrado"}), 404
