import os
import requests

CADASTRO_URL = os.environ.get("CADASTRO_URL", "http://localhost:5001")
FATURAMENTO_URL = os.environ.get("FATURAMENTO_URL", "http://localhost:5002")
TIMEOUT = float(os.environ.get("SERVICOS_TIMEOUT", "3"))


class ServicoIndisponivel(Exception):
    """Levantada quando um microsservico dependente nao responde."""

    def __init__(self, servico):
        self.servico = servico
        super().__init__(f"Servico de {servico} indisponivel no momento")


def _existe(url, servico):
    try:
        resposta = requests.get(url, timeout=TIMEOUT)
    except requests.exceptions.RequestException:
        raise ServicoIndisponivel(servico)
    return resposta.status_code == 200


def validar_paciente(paciente_id):
    return _existe(f"{CADASTRO_URL}/pacientes/{paciente_id}", "cadastro")


def validar_medico(medico_id):
    return _existe(f"{CADASTRO_URL}/medicos/{medico_id}", "cadastro")


def validar_especialidade(especialidade_id):
    return _existe(f"{CADASTRO_URL}/especialidades/{especialidade_id}", "cadastro")


def obter_valor_vigente():
    # Sobre tolerancia a falhas: se o faturamento estiver indisponivel ou nao houver
    # valor cadastrado, retorna none e o agendamento prossegue mesmo assim.
    try:
        resposta = requests.get(f"{FATURAMENTO_URL}/valores/vigente", timeout=TIMEOUT)
    except requests.exceptions.RequestException:
        return None

    if resposta.status_code == 200:
        return resposta.json().get("valor")

    return None


def emitir_cobranca(cobranca):
    # Chamada feita ao finalizar a consulta. Tolerante a falhas: se o faturamento
    # estiver indisponivel, retorna None e a finalizacao da consulta prossegue.
    try:
        resposta = requests.post(
            f"{FATURAMENTO_URL}/cobrancas", json=cobranca, timeout=TIMEOUT
        )
    except requests.exceptions.RequestException:
        return None

    if resposta.status_code in (200, 201):
        return resposta.json()

    return None
