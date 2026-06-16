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
        "numero": dados.get("numero"),
        "bloco": dados.get("bloco"),
        "tamanho": dados.get("tamanho")
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
            consultorio["numero"] = dados.get("numero", consultorio["numero"])
            consultorio["bloco"] = dados.get("bloco", consultorio["bloco"])
            consultorio["tamanho"] = dados.get("tamanho", consultorio["tamanho"])
            return jsonify(consultorio)

    return jsonify({"erro": "Consultório não encontrado"}), 404