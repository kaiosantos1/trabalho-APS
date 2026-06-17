from flask import Blueprint, jsonify, request

import repositorio
from seguranca import requer_perfil

cobrancas_bp = Blueprint("cobrancas", __name__)


@cobrancas_bp.route("/cobrancas", methods=["GET"])
def listar_cobrancas():
    # Filtros opcionais permitem ao paciente consultar apenas o seu historico
    # financeiro (consulta de cobrancas por paciente_id / consulta_id).
    paciente_id = request.args.get("paciente_id", type=int)
    consulta_id = request.args.get("consulta_id", type=int)

    resultado = repositorio.listar("cobrancas")
    if paciente_id is not None:
        resultado = [c for c in resultado if c.get("paciente_id") == paciente_id]
    if consulta_id is not None:
        resultado = [c for c in resultado if c.get("consulta_id") == consulta_id]

    return jsonify(resultado)


@cobrancas_bp.route("/cobrancas", methods=["POST"])
@requer_perfil("diretor")
def criar_cobranca():
    dados = request.get_json(silent=True) or {}

    nova_cobranca = repositorio.inserir("cobrancas", "cobranca", {
        "consulta_id": dados.get("consulta_id"),
        "paciente_id": dados.get("paciente_id"),
        "valor": dados.get("valor"),
        "data_emissao": dados.get("data_emissao"),
        "status": dados.get("status", "EMITIDA")
    })

    return jsonify(nova_cobranca), 201


@cobrancas_bp.route("/cobrancas/<int:id>", methods=["GET"])
def buscar_cobranca(id):
    cobranca = repositorio.buscar("cobrancas", id)
    if cobranca is not None:
        return jsonify(cobranca)

    return jsonify({"erro": "Cobrança não encontrada"}), 404


@cobrancas_bp.route("/cobrancas/<int:id>", methods=["PUT"])
@requer_perfil("diretor")
def atualizar_cobranca(id):
    dados = request.get_json(silent=True) or {}

    cobranca = repositorio.buscar("cobrancas", id)
    if cobranca is not None:
        cobranca = repositorio.atualizar("cobrancas", id, {
            "consulta_id": dados.get("consulta_id", cobranca.get("consulta_id")),
            "paciente_id": dados.get("paciente_id", cobranca.get("paciente_id")),
            "valor": dados.get("valor", cobranca["valor"]),
            "data_emissao": dados.get("data_emissao", cobranca["data_emissao"]),
            "status": dados.get("status", cobranca["status"])
        })
        return jsonify(cobranca)

    return jsonify({"erro": "Cobrança não encontrada"}), 404
