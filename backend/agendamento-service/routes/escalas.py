from flask import Blueprint, jsonify, request

import repositorio

escalas_bp = Blueprint("escalas", __name__)


def _periodos_se_sobrepoem(inicio1, fim1, inicio2, fim2):
    
    fim1 = fim1 or "9999-12-31"
    fim2 = fim2 or "9999-12-31"
    return inicio1 <= fim2 and inicio2 <= fim1


def _horarios_se_sobrepoem(ini1, fim1, ini2, fim2):
    
    return ini1 < fim2 and ini2 < fim1


def _ha_conflito(escala, nova, mesmo_campo):
    if escala[mesmo_campo] != nova[mesmo_campo]:
        return False
    if escala["dia_semana"] != nova["dia_semana"]:
        return False
    if not _periodos_se_sobrepoem(
        escala["data_inicio_vigencia"], escala["data_fim_vigencia"],
        nova["data_inicio_vigencia"], nova["data_fim_vigencia"],
    ):
        return False
    return _horarios_se_sobrepoem(
        escala["hora_inicial"], escala["hora_final"],
        nova["hora_inicial"], nova["hora_final"],
    )


@escalas_bp.route("/escalas", methods=["GET"])
def listar_escalas():
    medico_id = request.args.get("medico_id", type=int)
    resultado = repositorio.listar("escalas")
    if medico_id is not None:
        resultado = [e for e in resultado if e["medico_id"] == medico_id]
    return jsonify(resultado)


@escalas_bp.route("/escalas/<int:id>", methods=["GET"])
def buscar_escala(id):
    escala = repositorio.buscar_escala(id)
    if escala is None:
        return jsonify({"erro": "Escala nao encontrada"}), 404
    return jsonify(escala)


@escalas_bp.route("/escalas", methods=["POST"])
def criar_escala():
    dados = request.get_json(silent=True) or {}

    nova = {
        "medico_id": dados.get("medico_id"),
        "consultorio_id": dados.get("consultorio_id"),
        "data_inicio_vigencia": dados.get("data_inicio_vigencia"),
        "data_fim_vigencia": dados.get("data_fim_vigencia"),
        "dia_semana": dados.get("dia_semana"),
        "hora_inicial": dados.get("hora_inicial"),
        "hora_final": dados.get("hora_final"),
    }

    obrigatorios = [
        "medico_id", "consultorio_id", "data_inicio_vigencia",
        "dia_semana", "hora_inicial", "hora_final",
    ]
    if any(nova[campo] is None for campo in obrigatorios):
        return jsonify({
            "erro": "medico_id, consultorio_id, data_inicio_vigencia, "
                    "dia_semana, hora_inicial e hora_final sao obrigatorios"
        }), 400

    if any(_ha_conflito(e, nova, "medico_id") for e in repositorio.listar("escalas")):
        return jsonify({
            "erro": "Conflito de horario: o medico ja possui escala nesse periodo"
        }), 409

    if any(_ha_conflito(e, nova, "consultorio_id") for e in repositorio.listar("escalas")):
        return jsonify({
            "erro": "Consultorio ja alocado para outro medico nesse horario"
        }), 409

    nova = repositorio.inserir("escalas", "escala", nova)
    return jsonify(nova), 201


@escalas_bp.route("/escalas/<int:id>", methods=["PUT"])
def atualizar_escala(id):
    dados = request.get_json(silent=True) or {}
    escala = repositorio.buscar_escala(id)
    if escala is None:
        return jsonify({"erro": "Escala nao encontrada"}), 404

    atualizada = dict(escala)
    for campo in (
        "medico_id", "consultorio_id", "data_inicio_vigencia",
        "data_fim_vigencia", "dia_semana", "hora_inicial", "hora_final",
    ):
        atualizada[campo] = dados.get(campo, escala[campo])

    outras = [e for e in repositorio.listar("escalas") if e["id"] != id]
    if any(_ha_conflito(e, atualizada, "medico_id") for e in outras):
        return jsonify({
            "erro": "Conflito de horario: o medico ja possui escala nesse periodo"
        }), 409
    if any(_ha_conflito(e, atualizada, "consultorio_id") for e in outras):
        return jsonify({
            "erro": "Consultorio ja alocado para outro medico nesse horario"
        }), 409

    escala = repositorio.substituir("escalas", id, atualizada)
    return jsonify(escala)


@escalas_bp.route("/escalas/<int:id>", methods=["DELETE"])
def remover_escala(id):
    if repositorio.remover("escalas", id):
        return jsonify({"mensagem": "Escala removida"})

    return jsonify({"erro": "Escala não encontrada"}), 404
