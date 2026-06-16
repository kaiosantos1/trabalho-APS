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
    especialidades_ids = dados.get("especialidades_ids", [])

    if not especialidades_ids:
        return jsonify({"erro": "Médico deve possuir pelo menos uma especialidade"}), 400

    novo_medico = {
        "id": proximo_id_medico,
        "nome": dados.get("nome"),
        "cpf": dados.get("cpf"),
        "crm": dados.get("crm"),
        "data_nascimento": dados.get("data_nascimento"),
        "endereco": dados.get("endereco"),
        "telefones": dados.get("telefones", []),
        "emails": dados.get("emails", []),
        "especialidades_ids": especialidades_ids
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
            medico["cpf"] = dados.get("cpf", medico["cpf"])
            medico["crm"] = dados.get("crm", medico["crm"])
            medico["data_nascimento"] = dados.get("data_nascimento", medico["data_nascimento"])
            medico["endereco"] = dados.get("endereco", medico["endereco"])
            medico["telefones"] = dados.get("telefones", medico["telefones"])
            medico["emails"] = dados.get("emails", medico["emails"])
            medico["especialidades_ids"] = dados.get("especialidades_ids", medico["especialidades_ids"])
            return jsonify(medico)

    return jsonify({"erro": "Médico não encontrado"}), 404