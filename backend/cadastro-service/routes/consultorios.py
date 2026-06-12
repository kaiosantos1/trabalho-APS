from flask import Blueprint, jsonify, request

consultorios_bp = Blueprint("consultorios", __name__)

consultorios = []
proximo_id_consultorio = 1


@consultorios_bp.route("/consultorios", methods=["GET"])
def listar_consultorios():
    return jsonify(consultorios)


@consultorios_bp.route("/consultorios", methods=["POST"])
def criar_consultorio():
    global proximo_id_consultorio

    dados = request.get_json()

    novo_consultorio = {
        "id": proximo_id_consultorio,
        "nome": dados.get("nome")
    }

    consultorios.append(novo_consultorio)
    proximo_id_consultorio += 1

    return jsonify(novo_consultorio), 201


@consultorios_bp.route("/consultorios/<int:id>", methods=["GET"])
def buscar_consultorio(id):
    for consultorio in consultorios:
        if consultorio["id"] == id:
            return jsonify(consultorio)

    return jsonify({"erro": "Consultório não encontrado"}), 404


@consultorios_bp.route("/consultorios/<int:id>", methods=["PUT"])
def atualizar_consultorio(id):
    dados = request.get_json()

    for consultorio in consultorios:
        if consultorio["id"] == id:
            consultorio["nome"] = dados.get("nome", consultorio["nome"])
            return jsonify(consultorio)

    return jsonify({"erro": "Consultório não encontrado"}), 404