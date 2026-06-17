from flask import Blueprint, jsonify, request

import repositorio

medicos_bp = Blueprint("medicos", __name__)

@medicos_bp.route("/medicos", methods=["GET"])
def listar_medicos():
    return jsonify(repositorio.listar("medicos"))


@medicos_bp.route("/medicos", methods=["POST"])
def criar_medico():
    dados = request.get_json()
    especialidades_ids = dados.get("especialidades_ids", [])

    if not especialidades_ids:
        return jsonify({"erro": "Médico deve possuir pelo menos uma especialidade"}), 400

    novo_medico = repositorio.inserir("medicos", "medico", {
        "nome": dados.get("nome"),
        "cpf": dados.get("cpf"),
        "crm": dados.get("crm"),
        "data_nascimento": dados.get("data_nascimento"),
        "endereco": dados.get("endereco"),
        "telefones": dados.get("telefones", []),
        "emails": dados.get("emails", []),
        "especialidades_ids": especialidades_ids
    })

    return jsonify(novo_medico), 201


@medicos_bp.route("/medicos/<int:id>", methods=["GET"])
def buscar_medico(id):
    medico = repositorio.buscar("medicos", id)
    if medico is not None:
        return jsonify(medico)

    return jsonify({"erro": "Médico não encontrado"}), 404


@medicos_bp.route("/medicos/<int:id>", methods=["PUT"])
def atualizar_medico(id):
    dados = request.get_json()

    medico = repositorio.buscar("medicos", id)
    if medico is not None:
        medico = repositorio.atualizar("medicos", id, {
            "nome": dados.get("nome", medico["nome"]),
            "cpf": dados.get("cpf", medico["cpf"]),
            "crm": dados.get("crm", medico["crm"]),
            "data_nascimento": dados.get("data_nascimento", medico["data_nascimento"]),
            "endereco": dados.get("endereco", medico["endereco"]),
            "telefones": dados.get("telefones", medico["telefones"]),
            "emails": dados.get("emails", medico["emails"]),
            "especialidades_ids": dados.get("especialidades_ids", medico["especialidades_ids"])
        })
        return jsonify(medico)

    return jsonify({"erro": "Médico não encontrado"}), 404


@medicos_bp.route("/medicos/<int:id>", methods=["DELETE"])
def remover_medico(id):
    if repositorio.remover("medicos", id):
        return jsonify({"mensagem": "Médico removido"})

    return jsonify({"erro": "Médico não encontrado"}), 404