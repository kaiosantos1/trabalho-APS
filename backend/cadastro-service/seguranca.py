import os
from datetime import datetime, timedelta
from functools import wraps

import jwt
from flask import jsonify, request

JWT_SECRET = os.environ.get("JWT_SECRET", "aps-health-dev-secret")
JWT_ALG = "HS256"
TOKEN_HORAS = int(os.environ.get("JWT_HORAS", "12"))
INTERNAL_TOKEN = os.environ.get("INTERNAL_TOKEN", "aps-health-internal")


def gerar_token(payload):
    dados = dict(payload)
    dados["exp"] = datetime.utcnow() + timedelta(hours=TOKEN_HORAS)
    return jwt.encode(dados, JWT_SECRET, algorithm=JWT_ALG)


def _payload_do_request():
    cabecalho = request.headers.get("Authorization", "")
    if not cabecalho.startswith("Bearer "):
        return None
    token = cabecalho[len("Bearer "):].strip()
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.PyJWTError:
        return None


def requer_perfil(*perfis):
    """Protege uma rota exigindo um token JWT valido com um dos perfis informados.

    Chamadas internas entre microsservicos (header X-Internal-Token) sao aceitas
    sem token de usuario, para permitir a comunicacao servico-a-servico.
    """
    def decorador(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if request.headers.get("X-Internal-Token") == INTERNAL_TOKEN:
                return func(*args, **kwargs)

            payload = _payload_do_request()
            if payload is None:
                return jsonify({"erro": "Autenticacao necessaria"}), 401
            if perfis and payload.get("perfil") not in perfis:
                return jsonify({"erro": "Acesso negado para o seu perfil"}), 403

            request.usuario = payload
            return func(*args, **kwargs)
        return wrapper
    return decorador
