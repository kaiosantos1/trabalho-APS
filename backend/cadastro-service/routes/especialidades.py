from flask import Blueprint, jsonify, request

import repositorio
from seguranca import requer_perfil

especialidades_bp = Blueprint("especialidades", __name__)

@especialidades_bp.route("/especialidades", methods=["GET"])
def listar_especialidades():
    return jsonify(repositorio.listar("especialidades"))


@especialidades_bp.route("/especialidades", methods=["POST"])
@requer_perfil("diretor")
def criar_especialidade():
    dados = request.get_json()

    nova_especialidade = repositorio.inserir("especialidades", "especialidade", {
        "nome": dados.get("nome"),
        "descricao": dados.get("descricao")
    })

    return jsonify(nova_especialidade), 201


@especialidades_bp.route("/especialidades/<int:id>", methods=["GET"])
def buscar_especialidade(id):
    especialidade = repositorio.buscar("especialidades", id)
    if especialidade is not None:
        return jsonify(especialidade)

    return jsonify({"erro": "Especialidade não encontrada"}), 404


@especialidades_bp.route("/especialidades/<int:id>", methods=["PUT"])
@requer_perfil("diretor")
def atualizar_especialidade(id):
    dados = request.get_json()

    especialidade = repositorio.buscar("especialidades", id)
    if especialidade is not None:
        especialidade = repositorio.atualizar("especialidades", id, {
            "nome": dados.get("nome", especialidade["nome"]),
            "descricao": dados.get("descricao", especialidade["descricao"])
        })
        return jsonify(especialidade)

    return jsonify({"erro": "Especialidade não encontrada"}), 404


@especialidades_bp.route("/especialidades/<int:id>", methods=["DELETE"])
@requer_perfil("diretor")
def remover_especialidade(id):
    if repositorio.remover("especialidades", id):
        return jsonify({"mensagem": "Especialidade removida"})

    return jsonify({"erro": "Especialidade não encontrada"}), 404