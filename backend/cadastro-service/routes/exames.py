from flask import Blueprint, jsonify, request

import repositorio

exames_bp = Blueprint("exames", __name__)

@exames_bp.route("/exames", methods=["GET"])
def listar_exames():
    return jsonify(repositorio.listar("exames"))


@exames_bp.route("/exames", methods=["POST"])
def criar_exame():
    dados = request.get_json()

    novo_exame = repositorio.inserir("exames", "exame", {
        "nome": dados.get("nome"),
        "indicacao": dados.get("indicacao")
    })

    return jsonify(novo_exame), 201


@exames_bp.route("/exames/<int:id>", methods=["GET"])
def buscar_exame(id):
    exame = repositorio.buscar("exames", id)
    if exame is not None:
        return jsonify(exame)

    return jsonify({"erro": "Exame não encontrado"}), 404


@exames_bp.route("/exames/<int:id>", methods=["PUT"])
def atualizar_exame(id):
    dados = request.get_json()

    exame = repositorio.buscar("exames", id)
    if exame is not None:
        exame = repositorio.atualizar("exames", id, {
            "nome": dados.get("nome", exame["nome"]),
            "indicacao": dados.get("indicacao", exame["indicacao"])
        })
        return jsonify(exame)

    return jsonify({"erro": "Exame não encontrado"}), 404