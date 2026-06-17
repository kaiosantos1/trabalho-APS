from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

import repositorio
from seguranca import gerar_token

auth_bp = Blueprint("auth", __name__)

PERFIS_VALIDOS = {"diretor", "gerente", "atendente", "medico", "paciente"}

# Usuarios administrativos criados automaticamente na primeira execucao.
USUARIOS_PADRAO = [
    ("diretor", "diretor123", "diretor", "Diretor Geral"),
    ("gerente", "gerente123", "gerente", "Gerente Operacional"),
    ("atendente", "atendente123", "atendente", "Atendente"),
    ("medico", "medico123", "medico", "Medico"),
]


def _buscar_usuario(username):
    return repositorio.buscar_por("usuarios", {"username": username})


def seed_usuarios():
    """Garante a existencia dos usuarios administrativos padrao."""
    for username, senha, perfil, nome in USUARIOS_PADRAO:
        if _buscar_usuario(username) is None:
            repositorio.inserir("usuarios", "usuario", {
                "username": username,
                "senha_hash": generate_password_hash(senha),
                "perfil": perfil,
                "nome": nome,
                "medico_id": None,
                "paciente_id": None,
            })


def _resposta_token(usuario):
    payload = {
        "sub": usuario["username"],
        "perfil": usuario["perfil"],
        "nome": usuario.get("nome"),
        "medico_id": usuario.get("medico_id"),
        "paciente_id": usuario.get("paciente_id"),
    }
    return {
        "token": gerar_token(payload),
        "perfil": usuario["perfil"],
        "nome": usuario.get("nome"),
        "medico_id": usuario.get("medico_id"),
        "paciente_id": usuario.get("paciente_id"),
    }


@auth_bp.route("/auth/login", methods=["POST"])
def login():
    dados = request.get_json(silent=True) or {}
    username = (dados.get("username") or "").strip()
    senha = dados.get("senha") or ""
    perfil = dados.get("perfil")

    usuario = _buscar_usuario(username)
    if usuario is None or not check_password_hash(usuario["senha_hash"], senha):
        return jsonify({"erro": "Usuario ou senha invalidos"}), 401

    if perfil and usuario["perfil"] != perfil:
        return jsonify({"erro": "Este usuario nao possui o perfil selecionado"}), 401

    return jsonify(_resposta_token(usuario))


@auth_bp.route("/auth/registro", methods=["POST"])
def registro():
    """Auto-cadastro de paciente: cria o paciente e o seu usuario de acesso."""
    dados = request.get_json(silent=True) or {}
    username = (dados.get("username") or "").strip()
    senha = dados.get("senha") or ""

    if not username or not senha:
        return jsonify({"erro": "username e senha sao obrigatorios"}), 400
    if _buscar_usuario(username) is not None:
        return jsonify({"erro": "Nome de usuario ja existe"}), 409

    paciente = repositorio.inserir("pacientes", "paciente", {
        "nome": dados.get("nome"),
        "cpf": dados.get("cpf"),
        "data_nascimento": dados.get("data_nascimento"),
        "endereco": dados.get("endereco"),
        "telefones": dados.get("telefones", []),
        "emails": dados.get("emails", []),
        "ativo": True,
    })

    usuario = repositorio.inserir("usuarios", "usuario", {
        "username": username,
        "senha_hash": generate_password_hash(senha),
        "perfil": "paciente",
        "nome": dados.get("nome"),
        "medico_id": None,
        "paciente_id": paciente["id"],
    })

    resposta = _resposta_token(usuario)
    resposta["paciente"] = paciente
    return jsonify(resposta), 201
