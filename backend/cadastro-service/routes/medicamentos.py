from flask import Blueprint, jsonify, request

import repositorio

medicamentos_bp = Blueprint("medicamentos", __name__)

@medicamentos_bp.route("/medicamentos", methods=["GET"])
def listar_medicamentos():
    return jsonify(repositorio.listar("medicamentos"))


@medicamentos_bp.route("/medicamentos", methods=["POST"])
def criar_medicamento():
    dados = request.get_json()

    novo_medicamento = repositorio.inserir("medicamentos", "medicamento", {
        "nome": dados.get("nome"),
        "indicacao": dados.get("indicacao")
    })

    return jsonify(novo_medicamento), 201


@medicamentos_bp.route("/medicamentos/<int:id>", methods=["GET"])
def buscar_medicamento(id):
    medicamento = repositorio.buscar("medicamentos", id)
    if medicamento is not None:
        return jsonify(medicamento)

    return jsonify({"erro": "Medicamento não encontrado"}), 404


@medicamentos_bp.route("/medicamentos/<int:id>", methods=["PUT"])
def atualizar_medicamento(id):
    dados = request.get_json()

    medicamento = repositorio.buscar("medicamentos", id)
    if medicamento is not None:
        medicamento = repositorio.atualizar("medicamentos", id, {
            "nome": dados.get("nome", medicamento["nome"]),
            "indicacao": dados.get("indicacao", medicamento["indicacao"])
        })
        return jsonify(medicamento)

    return jsonify({"erro": "Medicamento não encontrado"}), 404


@medicamentos_bp.route("/medicamentos/<int:id>", methods=["DELETE"])
def remover_medicamento(id):
    if repositorio.remover("medicamentos", id):
        return jsonify({"mensagem": "Medicamento removido"})

    return jsonify({"erro": "Medicamento não encontrado"}), 404