from datetime import date, datetime

from flask import Blueprint, jsonify, request

import repositorio
from estados import EstadoConsulta
from services.integracao import (
    ServicoIndisponivel,
    obter_valor_vigente,
    validar_especialidade,
    validar_medico,
    validar_paciente,
)

consultas_bp = Blueprint("consultas", __name__)

DIAS_SEMANA = [
    "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"
]


def _agora():
    return datetime.now().isoformat(timespec="seconds")


# ---------------------------------------------------------------------------
# Agendamento
# ---------------------------------------------------------------------------

@consultas_bp.route("/consultas", methods=["POST"])
def agendar_consulta():
    dados = request.get_json(silent=True) or {}

    paciente_id = dados.get("paciente_id")
    medico_id = dados.get("medico_id")
    especialidade_id = dados.get("especialidade_id")
    data_hora = dados.get("data_hora")

    if paciente_id is None or medico_id is None or not data_hora:
        return jsonify({
            "erro": "paciente_id, medico_id e data_hora sao obrigatorios"
        }), 400

    try:
        if not validar_paciente(paciente_id):
            return jsonify({"erro": "Paciente nao encontrado no Cadastro"}), 404
        if not validar_medico(medico_id):
            return jsonify({"erro": "Medico nao encontrado no Cadastro"}), 404
        if especialidade_id is not None and not validar_especialidade(especialidade_id):
            return jsonify({"erro": "Especialidade nao encontrada no Cadastro"}), 404
    except ServicoIndisponivel as erro:
        return jsonify({"erro": str(erro)}), 503

    valor_consulta = obter_valor_vigente()

    nova_consulta = {
        "id": repositorio.proximo_id("consulta"),
        "paciente_id": paciente_id,
        "medico_id": medico_id,
        "especialidade_id": especialidade_id,
        "data_hora": data_hora,
        "estado": EstadoConsulta.AGENDADA,
        "data_hora_inicio": None,
        "data_hora_encerramento": None,
        "descricao_estado_geral": None,
        "valor_consulta": valor_consulta,
        "prescricoes": [],
        "exames_solicitados": [],
    }

    repositorio.consultas.append(nova_consulta)
    return jsonify(nova_consulta), 201


# ---------------------------------------------------------------------------
# Consulta / listagem
# ---------------------------------------------------------------------------

@consultas_bp.route("/consultas", methods=["GET"])
def listar_consultas():
    paciente_id = request.args.get("paciente_id", type=int)
    medico_id = request.args.get("medico_id", type=int)

    resultado = repositorio.consultas
    if paciente_id is not None:
        resultado = [c for c in resultado if c["paciente_id"] == paciente_id]
    if medico_id is not None:
        resultado = [c for c in resultado if c["medico_id"] == medico_id]

    return jsonify(resultado)


@consultas_bp.route("/consultas/<int:id>", methods=["GET"])
def buscar_consulta(id):
    consulta = repositorio.buscar_consulta(id)
    if consulta is None:
        return jsonify({"erro": "Consulta nao encontrada"}), 404
    return jsonify(consulta)


# ---------------------------------------------------------------------------
# Disponibilidade
# ---------------------------------------------------------------------------

@consultas_bp.route("/consultas/disponibilidade", methods=["GET"])
def consultar_disponibilidade():
    medico_id = request.args.get("medico_id", type=int)
    data = request.args.get("data")

    if medico_id is None or not data:
        return jsonify({
            "erro": "medico_id e data (YYYY-MM-DD) sao obrigatorios"
        }), 400

    try:
        dia_semana = DIAS_SEMANA[date.fromisoformat(data).weekday()]
    except ValueError:
        return jsonify({"erro": "data invalida, use o formato YYYY-MM-DD"}), 400

    escalas_do_dia = [
        e for e in repositorio.escalas
        if e["medico_id"] == medico_id
        and e["dia_semana"] == dia_semana
        and e["data_inicio_vigencia"] <= data
        and (e["data_fim_vigencia"] is None or data <= e["data_fim_vigencia"])
    ]

    horarios_ocupados = [
        c["data_hora"] for c in repositorio.consultas
        if c["medico_id"] == medico_id
        and c["estado"] in (EstadoConsulta.AGENDADA, EstadoConsulta.EM_ANDAMENTO)
        and str(c["data_hora"]).startswith(data)
    ]

    return jsonify({
        "medico_id": medico_id,
        "data": data,
        "dia_semana": dia_semana,
        "escalas": escalas_do_dia,
        "horarios_ocupados": horarios_ocupados,
    })


# ---------------------------------------------------------------------------
# Reagendamento
# ---------------------------------------------------------------------------

@consultas_bp.route("/consultas/<int:id>/reagendar", methods=["PUT"])
def reagendar_consulta(id):
    dados = request.get_json(silent=True) or {}
    consulta = repositorio.buscar_consulta(id)
    if consulta is None:
        return jsonify({"erro": "Consulta nao encontrada"}), 404

    if consulta["estado"] != EstadoConsulta.AGENDADA:
        return jsonify({
            "erro": "Apenas consultas no estado AGENDADA podem ser reagendadas"
        }), 409

    consulta["data_hora"] = dados.get("data_hora", consulta["data_hora"])
    consulta["medico_id"] = dados.get("medico_id", consulta["medico_id"])
    return jsonify(consulta)


# ---------------------------------------------------------------------------
# Realizacao da consulta (Iniciar -> ... -> Finalizar)
# ---------------------------------------------------------------------------

@consultas_bp.route("/consultas/<int:id>/iniciar", methods=["PUT"])
def iniciar_consulta(id):
    dados = request.get_json(silent=True) or {}
    consulta = repositorio.buscar_consulta(id)
    if consulta is None:
        return jsonify({"erro": "Consulta nao encontrada"}), 404

    if consulta["estado"] != EstadoConsulta.AGENDADA:
        return jsonify({
            "erro": "Apenas uma consulta AGENDADA pode ser iniciada"
        }), 409

    consulta["estado"] = EstadoConsulta.EM_ANDAMENTO
    consulta["data_hora_inicio"] = dados.get("data_hora_inicio") or _agora()
    return jsonify(consulta)


@consultas_bp.route("/consultas/<int:id>/finalizar", methods=["PUT"])
def finalizar_consulta(id):
    dados = request.get_json(silent=True) or {}
    consulta = repositorio.buscar_consulta(id)
    if consulta is None:
        return jsonify({"erro": "Consulta nao encontrada"}), 404

    if consulta["estado"] != EstadoConsulta.EM_ANDAMENTO:
        return jsonify({
            "erro": "Apenas uma consulta EM_ANDAMENTO pode ser finalizada"
        }), 409

    consulta["descricao_estado_geral"] = dados.get(
        "descricao_estado_geral", consulta["descricao_estado_geral"]
    )
    consulta["estado"] = EstadoConsulta.FINALIZADA
    consulta["data_hora_encerramento"] = dados.get("data_hora_encerramento") or _agora()
    return jsonify(consulta)


@consultas_bp.route("/consultas/<int:id>/prescricoes", methods=["POST"])
def prescrever_medicamento(id):
    dados = request.get_json(silent=True) or {}
    consulta = repositorio.buscar_consulta(id)
    if consulta is None:
        return jsonify({"erro": "Consulta nao encontrada"}), 404

    if consulta["estado"] != EstadoConsulta.EM_ANDAMENTO:
        return jsonify({
            "erro": "So e possivel prescrever durante uma consulta EM_ANDAMENTO"
        }), 409

    prescricao = {
        "medicamento_id": dados.get("medicamento_id"),
        "dose": dados.get("dose"),
        "posologia": dados.get("posologia"),
    }
    consulta["prescricoes"].append(prescricao)
    return jsonify(prescricao), 201


@consultas_bp.route("/consultas/<int:id>/exames-solicitados", methods=["POST"])
def solicitar_exame(id):
    dados = request.get_json(silent=True) or {}
    consulta = repositorio.buscar_consulta(id)
    if consulta is None:
        return jsonify({"erro": "Consulta nao encontrada"}), 404

    if consulta["estado"] != EstadoConsulta.EM_ANDAMENTO:
        return jsonify({
            "erro": "So e possivel solicitar exames durante uma consulta EM_ANDAMENTO"
        }), 409

    exame_solicitado = {
        "id": len(consulta["exames_solicitados"]) + 1,
        "exame_id": dados.get("exame_id"),
        "resultado": None,
        "data_realizacao": None,
    }
    consulta["exames_solicitados"].append(exame_solicitado)
    return jsonify(exame_solicitado), 201


@consultas_bp.route("/consultas/<int:id>/resultados-exames", methods=["POST"])
def registrar_resultado_exame(id):
    dados = request.get_json(silent=True) or {}
    consulta = repositorio.buscar_consulta(id)
    if consulta is None:
        return jsonify({"erro": "Consulta nao encontrada"}), 404

    exame_solicitado_id = dados.get("exame_solicitado_id")
    exame = next(
        (x for x in consulta["exames_solicitados"] if x["id"] == exame_solicitado_id),
        None,
    )
    if exame is None:
        return jsonify({"erro": "Exame solicitado nao encontrado nesta consulta"}), 404

    exame["resultado"] = dados.get("resultado", exame["resultado"])
    exame["data_realizacao"] = dados.get("data_realizacao") or _agora()
    return jsonify(exame)


# ---------------------------------------------------------------------------
# Solicitacao de cancelamento (criada pelo paciente/atendente)
# ---------------------------------------------------------------------------

@consultas_bp.route("/consultas/<int:id>/solicitar-cancelamento", methods=["POST"])
def solicitar_cancelamento(id):
    consulta = repositorio.buscar_consulta(id)
    if consulta is None:
        return jsonify({"erro": "Consulta nao encontrada"}), 404

    if consulta["estado"] != EstadoConsulta.AGENDADA:
        return jsonify({
            "erro": "Apenas consultas no estado AGENDADA podem ser canceladas"
        }), 409

    solicitacao = {
        "id": repositorio.proximo_id("solicitacao"),
        "consulta_id": id,
        "status": "PENDENTE",
    }
    repositorio.solicitacoes.append(solicitacao)
    return jsonify(solicitacao), 201
