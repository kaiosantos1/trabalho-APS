from datetime import date

from flask import Blueprint, jsonify, request

import repositorio

valores_bp = Blueprint("valores", __name__)


def _valor_vigente_em(data_referencia):
    # Vigente = valor com a maior data_vigencia que ainda nao ultrapassou a data
    # de referencia. Mantem o valor associado a consulta estavel mesmo que a tabela
    # de precos mude no futuro (regra do minimundo).
    candidatos = [
        v for v in repositorio.listar("valores")
        if v.get("data_vigencia") and v["data_vigencia"] <= data_referencia
    ]
    if not candidatos:
        return None
    return max(candidatos, key=lambda v: v["data_vigencia"])


@valores_bp.route("/valores", methods=["GET"])
def listar_valores():
    return jsonify(repositorio.listar("valores"))


@valores_bp.route("/valores", methods=["POST"])
def criar_valor():
    dados = request.get_json(silent=True) or {}

    novo_valor = repositorio.inserir("valores", "valor", {
        "valor": dados.get("valor"),
        "data_vigencia": dados.get("data_vigencia")
    })

    return jsonify(novo_valor), 201


@valores_bp.route("/valores/vigente", methods=["GET"])
def obter_valor_vigente():
    data_referencia = request.args.get("data") or date.today().isoformat()
    vigente = _valor_vigente_em(data_referencia)

    if vigente is None:
        return jsonify({"erro": "Nenhum valor vigente para a data informada"}), 404

    return jsonify(vigente)


@valores_bp.route("/valores/<int:id>", methods=["GET"])
def buscar_valor(id):
    valor = repositorio.buscar("valores", id)
    if valor is not None:
        return jsonify(valor)

    return jsonify({"erro": "Valor não encontrado"}), 404


@valores_bp.route("/valores/<int:id>", methods=["PUT"])
def atualizar_valor(id):
    dados = request.get_json(silent=True) or {}

    valor = repositorio.buscar("valores", id)
    if valor is not None:
        valor = repositorio.atualizar("valores", id, {
            "valor": dados.get("valor", valor["valor"]),
            "data_vigencia": dados.get("data_vigencia", valor["data_vigencia"])
        })
        return jsonify(valor)

    return jsonify({"erro": "Valor não encontrado"}), 404
