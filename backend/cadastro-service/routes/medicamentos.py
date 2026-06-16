from flask import Blueprint, jsonify, request

medicamentos_bp = Blueprint("medicamentos", __name__)

medicamentos = []
proximo_id_medicamento = 1


@medicamentos_bp.route("/medicamentos", methods=["GET"])
def listar_medicamentos():
    return jsonify(medicamentos)


@medicamentos_bp.route("/medicamentos", methods=["POST"])
def criar_medicamento():
    global proximo_id_medicamento

    dados = request.get_json()

    novo_medicamento = {
        "id": proximo_id_medicamento,
        "nome": dados.get("nome"),
        "indicacao": dados.get("indicacao")
    }

    medicamentos.append(novo_medicamento)
    proximo_id_medicamento += 1

    return jsonify(novo_medicamento), 201


@medicamentos_bp.route("/medicamentos/<int:id>", methods=["GET"])
def buscar_medicamento(id):
    for medicamento in medicamentos:
        if medicamento["id"] == id:
            return jsonify(medicamento)

    return jsonify({"erro": "Medicamento não encontrado"}), 404


@medicamentos_bp.route("/medicamentos/<int:id>", methods=["PUT"])
def atualizar_medicamento(id):
    dados = request.get_json()

    for medicamento in medicamentos:
        if medicamento["id"] == id:
            medicamento["nome"] = dados.get("nome", medicamento["nome"])
            medicamento["indicacao"] = dados.get("indicacao", medicamento["indicacao"])
            return jsonify(medicamento)

    return jsonify({"erro": "Medicamento não encontrado"}), 404