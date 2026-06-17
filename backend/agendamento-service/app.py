from flask import Flask, jsonify
from flask_cors import CORS

from routes.consultas import consultas_bp
from routes.escalas import escalas_bp
from routes.cancelamentos import cancelamentos_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(consultas_bp)
app.register_blueprint(escalas_bp)
app.register_blueprint(cancelamentos_bp)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Agendamento Service funcionando"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003, debug=False)
