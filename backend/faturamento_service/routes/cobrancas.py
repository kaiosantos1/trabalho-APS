from flask import Blueprint, jsonify, request

import repositorio

cobrancas_bp = Blueprint("cobrancas", __name__)

@cobrancas_bp.route("/cobrancas", methods=["GET"])
def listar_cobrancas():
    return jsonify(repositorio.listar("cobrancas"))


@cobrancas_bp.route("/cobrancas", methods=["POST"])
def criar_cobranca():
    dados = request.get_json()

    nova_cobranca = repositorio.inserir("cobrancas", "cobranca", {
        "valor": dados.get("valor"),
        "data_emissao": dados.get("data_emissao"),
        "status": dados.get("status")
    })

    return jsonify(nova_cobranca), 201


@cobrancas_bp.route("/cobrancas/<int:id>", methods=["GET"])
def buscar_cobranca(id):
    cobranca = repositorio.buscar("cobrancas", id)
    if cobranca is not None:
        return jsonify(cobranca)

    return jsonify({"erro": "Cobrança não encontrada"}), 404


@cobrancas_bp.route("/cobrancas/<int:id>", methods=["PUT"])
def atualizar_cobranca(id):
    dados = request.get_json()

    cobranca = repositorio.buscar("cobrancas", id)
    if cobranca is not None:
        cobranca = repositorio.atualizar("cobrancas", id, {
            "valor": dados.get("valor", cobranca["valor"]),
            "data_emissao": dados.get("data_emissao", cobranca["data_emissao"]),
            "status": dados.get("status", cobranca["status"])
        })
        return jsonify(cobranca)

    return jsonify({"erro": "Cobrança não encontrada"}), 404