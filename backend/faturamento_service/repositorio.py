import os

from pymongo import MongoClient, ReturnDocument


MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.environ.get("MONGO_DB", "aps_health_faturamento")
MAX_POOL_SIZE = int(os.environ.get("MONGO_MAX_POOL_SIZE", "20"))
MIN_POOL_SIZE = int(os.environ.get("MONGO_MIN_POOL_SIZE", "0"))
MAX_IDLE_TIME_MS = int(os.environ.get("MONGO_MAX_IDLE_TIME_MS", "300000"))
CONNECT_TIMEOUT_MS = int(os.environ.get("MONGO_CONNECT_TIMEOUT_MS", "5000"))
SOCKET_TIMEOUT_MS = int(os.environ.get("MONGO_SOCKET_TIMEOUT_MS", "30000"))
SERVER_SELECTION_TIMEOUT_MS = int(os.environ.get("MONGO_SERVER_SELECTION_TIMEOUT_MS", "5000"))

client = MongoClient(
    MONGO_URI,
    maxPoolSize=MAX_POOL_SIZE,
    minPoolSize=MIN_POOL_SIZE,
    maxIdleTimeMS=MAX_IDLE_TIME_MS,
    connectTimeoutMS=CONNECT_TIMEOUT_MS,
    socketTimeoutMS=SOCKET_TIMEOUT_MS,
    serverSelectionTimeoutMS=SERVER_SELECTION_TIMEOUT_MS,
)
db = client[MONGO_DB]


def _colecao(nome):
    return db[nome]


def _counters():
    return db["counters"]


def proximo_id(entidade):
    documento = _counters().find_one_and_update(
        {"_id": entidade},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return int(documento["seq"])


def listar(nome):
    return list(_colecao(nome).find({}, {"_id": 0}).sort("id", 1))


def buscar(nome, identificador):
    return _colecao(nome).find_one({"id": int(identificador)}, {"_id": 0})


def inserir(nome, entidade, documento):
    registro = dict(documento)
    registro["id"] = proximo_id(entidade)
    _colecao(nome).insert_one(registro)
    return registro


def atualizar(nome, identificador, atualizacoes):
    identificador = int(identificador)
    documento = _colecao(nome).find_one({"id": identificador})
    if documento is None:
        return None

    documento.pop("_id", None)
    for campo, valor in atualizacoes.items():
        documento[campo] = valor

    _colecao(nome).replace_one({"id": identificador}, documento)
    documento.pop("_id", None)
    return documento