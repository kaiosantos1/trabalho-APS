from datetime import date, datetime

from flask import Blueprint, jsonify, request

import repositorio
from estados import EstadoConsulta
from services.integracao import (
    ServicoIndisponivel,
    emitir_cobranca,
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


def _partes_data_hora(data_hora):
    # Aceita "YYYY-MM-DDTHH:MM" ou "YYYY-MM-DDTHH:MM:SS" e devolve (data, "HH:MM").
    data_part, _, hora_part = str(data_hora).partition("T")
    return data_part, hora_part[:5]


def _ja_passou(data_hora):
    # Compara o horario previsto da consulta com o momento atual.
    try:
        return datetime.fromisoformat(str(data_hora)) < datetime.now()
    except ValueError:
        return False


def _hora_dentro_intervalo(hora, inicio, fim):
    # Compara horas no formato "HH:MM". Trata "00:00" como fim do dia (24:00) e
    # escalas que cruzam a meia-noite (ex.: 22:00 ate 02:00).
    if fim == "00:00":
        fim = "24:00"
    if inicio <= fim:
        return inicio <= hora < fim
    # Escala que vira o dia: disponivel se for depois do inicio ou antes do fim.
    return hora >= inicio or hora < fim


def _medico_disponivel(medico_id, data_hora):
    # Verifica se o horario solicitado cai dentro de alguma escala vigente do medico
    # naquele dia da semana (regra de disponibilidade do minimundo).
    data_part, hora = _partes_data_hora(data_hora)
    try:
        dia_semana = DIAS_SEMANA[date.fromisoformat(data_part).weekday()]
    except ValueError:
        return False

    for escala in repositorio.listar("escalas"):
        if escala["medico_id"] != medico_id:
            continue
        if escala["dia_semana"] != dia_semana:
            continue
        if escala["data_inicio_vigencia"] > data_part:
            continue
        if escala["data_fim_vigencia"] is not None and data_part > escala["data_fim_vigencia"]:
            continue
        if _hora_dentro_intervalo(hora, escala["hora_inicial"], escala["hora_final"]):
            return True

    return False


def _horario_ocupado(medico_id, data_hora, ignorar_consulta_id=None):
    # Impede agendar dois pacientes no mesmo medico/horario (consultas ativas).
    for consulta in repositorio.listar("consultas"):
        if ignorar_consulta_id is not None and consulta["id"] == ignorar_consulta_id:
            continue
        if (
            consulta["medico_id"] == medico_id
            and consulta["data_hora"] == data_hora
            and consulta["estado"] in (EstadoConsulta.AGENDADA, EstadoConsulta.EM_ANDAMENTO)
        ):
            return True
    return False


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

    if _ja_passou(data_hora):
        return jsonify({"erro": "Nao e possivel agendar em um horario que ja passou"}), 409

    try:
        if not validar_paciente(paciente_id):
            return jsonify({"erro": "Paciente nao encontrado no Cadastro"}), 404
        if not validar_medico(medico_id):
            return jsonify({"erro": "Medico nao encontrado no Cadastro"}), 404
        if especialidade_id is not None and not validar_especialidade(especialidade_id):
            return jsonify({"erro": "Especialidade nao encontrada no Cadastro"}), 404
    except ServicoIndisponivel as erro:
        return jsonify({"erro": str(erro)}), 503

    if not _medico_disponivel(medico_id, data_hora):
        return jsonify({
            "erro": "Horario indisponivel: o medico nao possui escala que cubra esse dia/horario"
        }), 409

    if _horario_ocupado(medico_id, data_hora):
        return jsonify({
            "erro": "Horario ja ocupado para este medico"
        }), 409

    valor_consulta = obter_valor_vigente()

    nova_consulta = {
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

    nova_consulta = repositorio.inserir("consultas", "consulta", nova_consulta)
    return jsonify(nova_consulta), 201


# ---------------------------------------------------------------------------
# Consulta / listagem
# ---------------------------------------------------------------------------

@consultas_bp.route("/consultas", methods=["GET"])
def listar_consultas():
    paciente_id = request.args.get("paciente_id", type=int)
    medico_id = request.args.get("medico_id", type=int)

    resultado = repositorio.listar("consultas")
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
        e for e in repositorio.listar("escalas")
        if e["medico_id"] == medico_id
        and e["dia_semana"] == dia_semana
        and e["data_inicio_vigencia"] <= data
        and (e["data_fim_vigencia"] is None or data <= e["data_fim_vigencia"])
    ]

    horarios_ocupados = [
        c["data_hora"] for c in repositorio.listar("consultas")
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

    if _ja_passou(consulta["data_hora"]):
        return jsonify({
            "erro": "Nao e possivel reagendar: o horario previsto da consulta ja passou"
        }), 409

    nova_data_hora = dados.get("data_hora", consulta["data_hora"])
    novo_medico_id = dados.get("medico_id", consulta["medico_id"])

    if _ja_passou(nova_data_hora):
        return jsonify({"erro": "O novo horario ja passou"}), 409

    if not _medico_disponivel(novo_medico_id, nova_data_hora):
        return jsonify({
            "erro": "Horario indisponivel: o medico nao possui escala que cubra esse dia/horario"
        }), 409

    if _horario_ocupado(novo_medico_id, nova_data_hora, ignorar_consulta_id=id):
        return jsonify({"erro": "Horario ja ocupado para este medico"}), 409

    consulta["data_hora"] = nova_data_hora
    consulta["medico_id"] = novo_medico_id
    consulta = repositorio.substituir("consultas", id, consulta)
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
    consulta = repositorio.substituir("consultas", id, consulta)
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
    consulta = repositorio.substituir("consultas", id, consulta)

    # Ao finalizar, emite automaticamente a cobranca da consulta no Faturamento.
    # Tolerante a falhas: se o faturamento estiver fora do ar, a consulta segue
    # finalizada e a cobranca podera ser emitida manualmente depois.
    emitir_cobranca({
        "consulta_id": consulta["id"],
        "paciente_id": consulta["paciente_id"],
        "valor": consulta.get("valor_consulta"),
        "data_emissao": date.today().isoformat(),
        "status": "EMITIDA",
    })

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
    repositorio.substituir("consultas", id, consulta)
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
    repositorio.substituir("consultas", id, consulta)
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
    repositorio.substituir("consultas", id, consulta)
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

    if _ja_passou(consulta["data_hora"]):
        return jsonify({
            "erro": "Nao e possivel solicitar cancelamento: o horario previsto ja passou"
        }), 409

    solicitacao = {
        "consulta_id": id,
        "status": "PENDENTE",
    }
    solicitacao = repositorio.inserir("solicitacoes", "solicitacao", solicitacao)
    return jsonify(solicitacao), 201
