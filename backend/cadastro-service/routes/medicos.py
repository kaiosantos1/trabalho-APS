from flask import Blueprint, jsonify, request

medicos_bp = Blueprint("medicos", __name__)

medicos = []
proximo_id_medico = 1


@medicos_bp.route("/medicos", methods=["GET"])
def listar_medicos():
    return jsonify(medicos)


@medicos_bp.route("/medicos", methods=["POST"])
def criar_medico():
    global proximo_id_medico

    dados = request.get_json()

    novo_medico = {
        "id": proximo_id_medico,
        "nome": dados.get("nome"),
        "crm": dados.get("crm"),
        "especialidade_id": dados.get("especialidade_id")
    }

    medicos.append(novo_medico)
    proximo_id_medico += 1

    return jsonify(novo_medico), 201


@medicos_bp.route("/medicos/<int:id>", methods=["GET"])
def buscar_medico(id):
    for medico in medicos:
        if medico["id"] == id:
            return jsonify(medico)

    return jsonify({"erro": "Médico não encontrado"}), 404


@medicos_bp.route("/medicos/<int:id>", methods=["PUT"])
def atualizar_medico(id):
    dados = request.get_json()

    for medico in medicos:
        if medico["id"] == id:
            medico["nome"] = dados.get("nome", medico["nome"])
            medico["crm"] = dados.get("crm", medico["crm"])
            medico["especialidade_id"] = dados.get("especialidade_id", medico["especialidade_id"])
            return jsonify(medico)

    return jsonify({"erro": "Médico não encontrado"}), 404