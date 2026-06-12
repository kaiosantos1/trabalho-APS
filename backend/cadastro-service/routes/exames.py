from flask import Blueprint, jsonify, request

exames_bp = Blueprint("exames", __name__)

exames = []
proximo_id_exame = 1


@exames_bp.route("/exames", methods=["GET"])
def listar_exames():
    return jsonify(exames)


@exames_bp.route("/exames", methods=["POST"])
def criar_exame():
    global proximo_id_exame

    dados = request.get_json()

    novo_exame = {
        "id": proximo_id_exame,
        "nome": dados.get("nome")
    }

    exames.append(novo_exame)
    proximo_id_exame += 1

    return jsonify(novo_exame), 201


@exames_bp.route("/exames/<int:id>", methods=["GET"])
def buscar_exame(id):
    for exame in exames:
        if exame["id"] == id:
            return jsonify(exame)

    return jsonify({"erro": "Exame não encontrado"}), 404


@exames_bp.route("/exames/<int:id>", methods=["PUT"])
def atualizar_exame(id):
    dados = request.get_json()

    for exame in exames:
        if exame["id"] == id:
            exame["nome"] = dados.get("nome", exame["nome"])
            return jsonify(exame)

    return jsonify({"erro": "Exame não encontrado"}), 404