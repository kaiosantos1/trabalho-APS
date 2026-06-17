from flask import Blueprint, jsonify, request

import repositorio

consultorios_bp = Blueprint("consultorios", __name__)

@consultorios_bp.route("/consultorios", methods=["GET"])
def listar_consultorios():
    return jsonify(repositorio.listar("consultorios"))


@consultorios_bp.route("/consultorios", methods=["POST"])
def criar_consultorio():
    dados = request.get_json()

    novo_consultorio = repositorio.inserir("consultorios", "consultorio", {
        "numero": dados.get("numero"),
        "bloco": dados.get("bloco"),
        "tamanho": dados.get("tamanho")
    })

    return jsonify(novo_consultorio), 201


@consultorios_bp.route("/consultorios/<int:id>", methods=["GET"])
def buscar_consultorio(id):
    consultorio = repositorio.buscar("consultorios", id)
    if consultorio is not None:
        return jsonify(consultorio)

    return jsonify({"erro": "Consultório não encontrado"}), 404


@consultorios_bp.route("/consultorios/<int:id>", methods=["PUT"])
def atualizar_consultorio(id):
    dados = request.get_json()

    consultorio = repositorio.buscar("consultorios", id)
    if consultorio is not None:
        consultorio = repositorio.atualizar("consultorios", id, {
            "numero": dados.get("numero", consultorio["numero"]),
            "bloco": dados.get("bloco", consultorio["bloco"]),
            "tamanho": dados.get("tamanho", consultorio["tamanho"])
        })
        return jsonify(consultorio)

    return jsonify({"erro": "Consultório não encontrado"}), 404


@consultorios_bp.route("/consultorios/<int:id>", methods=["DELETE"])
def remover_consultorio(id):
    if repositorio.remover("consultorios", id):
        return jsonify({"mensagem": "Consultório removido"})

    return jsonify({"erro": "Consultório não encontrado"}), 404