from flask import Blueprint, jsonify, request

import repositorio

pacientes_bp = Blueprint("pacientes", __name__)


@pacientes_bp.route("/pacientes", methods=["GET"])
def listar_pacientes():
    return jsonify(repositorio.listar("pacientes"))


@pacientes_bp.route("/pacientes", methods=["POST"])
def criar_paciente():
    dados = request.get_json(silent=True) or {}

    novo_paciente = repositorio.inserir("pacientes", "paciente", {
        "nome": dados.get("nome"),
        "cpf": dados.get("cpf"),
        "data_nascimento": dados.get("data_nascimento"),
        "endereco": dados.get("endereco"),
        "telefones": dados.get("telefones", []),
        "emails": dados.get("emails", []),
        "ativo": dados.get("ativo", True),
    })

    return jsonify(novo_paciente), 201


@pacientes_bp.route("/pacientes/<int:id>", methods=["GET"])
def buscar_paciente(id):
    paciente = repositorio.buscar("pacientes", id)
    if paciente is not None:
        return jsonify(paciente)

    return jsonify({"erro": "Paciente não encontrado"}), 404


@pacientes_bp.route("/pacientes/<int:id>", methods=["PUT"])
def atualizar_paciente(id):
    dados = request.get_json(silent=True) or {}

    paciente = repositorio.buscar("pacientes", id)
    if paciente is not None:
        paciente = repositorio.atualizar("pacientes", id, {
            "nome": dados.get("nome", paciente["nome"]),
            "cpf": dados.get("cpf", paciente["cpf"]),
            "data_nascimento": dados.get("data_nascimento", paciente["data_nascimento"]),
            "endereco": dados.get("endereco", paciente["endereco"]),
            "telefones": dados.get("telefones", paciente["telefones"]),
            "emails": dados.get("emails", paciente["emails"]),
            "ativo": dados.get("ativo", paciente["ativo"]),
        })
        return jsonify(paciente)

    return jsonify({"erro": "Paciente não encontrado"}), 404


@pacientes_bp.route("/pacientes/<int:id>", methods=["DELETE"])
def remover_paciente(id):
    if repositorio.remover("pacientes", id):
        return jsonify({"mensagem": "Paciente removido"})

    return jsonify({"erro": "Paciente não encontrado"}), 404
