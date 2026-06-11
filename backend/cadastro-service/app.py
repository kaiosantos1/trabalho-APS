from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# "Banco de dados" temporário em memória
especialidades = []
medicos = []
pacientes = []

proximo_id_especialidade = 1
proximo_id_medico = 1
proximo_id_paciente = 1


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Cadastro Service funcionando"})


# ---------------- ESPECIALIDADES ----------------

@app.route("/especialidades", methods=["GET"])
def listar_especialidades():
    return jsonify(especialidades)


@app.route("/especialidades", methods=["POST"])
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


@app.route("/especialidades/<int:id>", methods=["GET"])
def buscar_especialidade(id):
    for especialidade in especialidades:
        if especialidade["id"] == id:
            return jsonify(especialidade)

    return jsonify({"erro": "Especialidade não encontrada"}), 404


@app.route("/especialidades/<int:id>", methods=["PUT"])
def atualizar_especialidade(id):
    dados = request.get_json()

    for especialidade in especialidades:
        if especialidade["id"] == id:
            especialidade["nome"] = dados.get("nome", especialidade["nome"])
            return jsonify(especialidade)

    return jsonify({"erro": "Especialidade não encontrada"}), 404


# ---------------- MÉDICOS ----------------

@app.route("/medicos", methods=["GET"])
def listar_medicos():
    return jsonify(medicos)


@app.route("/medicos", methods=["POST"])
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


@app.route("/medicos/<int:id>", methods=["GET"])
def buscar_medico(id):
    for medico in medicos:
        if medico["id"] == id:
            return jsonify(medico)

    return jsonify({"erro": "Médico não encontrado"}), 404


@app.route("/medicos/<int:id>", methods=["PUT"])
def atualizar_medico(id):
    dados = request.get_json()

    for medico in medicos:
        if medico["id"] == id:
            medico["nome"] = dados.get("nome", medico["nome"])
            medico["crm"] = dados.get("crm", medico["crm"])
            medico["especialidade_id"] = dados.get("especialidade_id", medico["especialidade_id"])
            return jsonify(medico)

    return jsonify({"erro": "Médico não encontrado"}), 404


# ---------------- PACIENTES ----------------

@app.route("/pacientes", methods=["GET"])
def listar_pacientes():
    return jsonify(pacientes)


@app.route("/pacientes", methods=["POST"])
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


@app.route("/pacientes/<int:id>", methods=["GET"])
def buscar_paciente(id):
    for paciente in pacientes:
        if paciente["id"] == id:
            return jsonify(paciente)

    return jsonify({"erro": "Paciente não encontrado"}), 404


@app.route("/pacientes/<int:id>", methods=["PUT"])
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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)