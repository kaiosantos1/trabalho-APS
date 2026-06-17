from flask import Blueprint, jsonify

import repositorio
from estados import EstadoConsulta
from seguranca import requer_perfil

cancelamentos_bp = Blueprint("cancelamentos", __name__)


@cancelamentos_bp.route("/solicitacoes-cancelamento/pendentes", methods=["GET"])
def listar_pendentes():
    pendentes = [s for s in repositorio.listar("solicitacoes") if s["status"] == "PENDENTE"]
    return jsonify(pendentes)


@cancelamentos_bp.route("/solicitacoes-cancelamento/<int:id>/aprovar", methods=["PUT"])
@requer_perfil("gerente")
def aprovar_cancelamento(id):
    solicitacao = repositorio.buscar_solicitacao(id)
    if solicitacao is None:
        return jsonify({"erro": "Solicitacao nao encontrada"}), 404

    if solicitacao["status"] != "PENDENTE":
        return jsonify({"erro": "Solicitacao ja foi analisada"}), 409

    solicitacao["status"] = "APROVADA"
    solicitacao = repositorio.substituir("solicitacoes", id, solicitacao)

    consulta = repositorio.buscar_consulta(solicitacao["consulta_id"])
    if consulta is not None:
        consulta["estado"] = EstadoConsulta.CANCELADA
        repositorio.substituir("consultas", consulta["id"], consulta)

    return jsonify(solicitacao)


@cancelamentos_bp.route("/solicitacoes-cancelamento/<int:id>/rejeitar", methods=["PUT"])
@requer_perfil("gerente")
def rejeitar_cancelamento(id):
    solicitacao = repositorio.buscar_solicitacao(id)
    if solicitacao is None:
        return jsonify({"erro": "Solicitacao nao encontrada"}), 404

    if solicitacao["status"] != "PENDENTE":
        return jsonify({"erro": "Solicitacao ja foi analisada"}), 409

    solicitacao["status"] = "REJEITADA"
    solicitacao = repositorio.substituir("solicitacoes", id, solicitacao)
    return jsonify(solicitacao)
