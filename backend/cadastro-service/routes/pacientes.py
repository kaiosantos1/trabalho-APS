from flask import Blueprint, jsonify, request

pacientes_bp = Blueprint("pacientes", __name__)

pacientes = []
proximo_id_paciente = 1


@pacientes_bp.route("/pacientes", methods=["GET"])
def listar_pacientes():
    return jsonify(pacientes)


@pacientes_bp.route("/pacientes", methods=["POST"])
def criar_paciente():
    global proximo_id_paciente

    dados = request.get_json()

    novo_paciente = {
        "id": proximo_id_paciente,
        "nome": dados.get("nome"),
        "cpf": dados.get("cpf"),
        "telefone": dados.get("telefone"),
        "email": dados.get("email")
    }

    pacientes.append(novo_paciente)
    proximo_id_paciente += 1

    return jsonify(novo_paciente), 201


@pacientes_bp.route("/pacientes/<int:id>", methods=["GET"])
def buscar_paciente(id):
    for paciente in pacientes:
        if paciente["id"] == id:
            return jsonify(paciente)

    return jsonify({"erro": "Paciente não encontrado"}), 404


@pacientes_bp.route("/pacientes/<int:id>", methods=["PUT"])
def atualizar_paciente(id):
    dados = request.get_json()

    for paciente in pacientes:
        if paciente["id"] == id:
            paciente["nome"] = dados.get("nome", paciente["nome"])
            paciente["cpf"] = dados.get("cpf", paciente["cpf"])
            paciente["telefone"] = dados.get("telefone", paciente["telefone"])
            paciente["email"] = dados.get("email", paciente["email"])
            return jsonify(paciente)

    return jsonify({"erro": "Paciente não encontrado"}), 404