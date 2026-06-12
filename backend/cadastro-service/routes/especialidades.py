from flask import Blueprint, jsonify, request

especialidades_bp = Blueprint("especialidades", __name__)

especialidades = []
proximo_id_especialidade = 1


@especialidades_bp.route("/especialidades", methods=["GET"])
def listar_especialidades():
    return jsonify(especialidades)


@especialidades_bp.route("/especialidades", methods=["POST"])
def criar_especialidade():
    global proximo_id_especialidade

    dados = request.get_json()

    nova_especialidade = {
        "id": proximo_id_especialidade,
        "nome": dados.get("nome")
    }

    especialidades.append(nova_especialidade)
    proximo_id_especialidade += 1

    return jsonify(nova_especialidade), 201


@especialidades_bp.route("/especialidades/<int:id>", methods=["GET"])
def buscar_especialidade(id):
    for especialidade in especialidades:
        if especialidade["id"] == id:
            return jsonify(especialidade)

    return jsonify({"erro": "Especialidade não encontrada"}), 404


@especialidades_bp.route("/especialidades/<int:id>", methods=["PUT"])
def atualizar_especialidade(id):
    dados = request.get_json()

    for especialidade in especialidades:
        if especialidade["id"] == id:
            especialidade["nome"] = dados.get("nome", especialidade["nome"])
            return jsonify(especialidade)

    return jsonify({"erro": "Especialidade não encontrada"}), 404