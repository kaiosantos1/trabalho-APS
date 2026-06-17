from flask import Flask, jsonify
from flask_cors import CORS

from routes.valores import valores_bp
from routes.pagamentos import pagamentos_bp
from routes.cobrancas import cobrancas_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(valores_bp)
app.register_blueprint(pagamentos_bp)
app.register_blueprint(cobrancas_bp)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Faturamento Service funcionando"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=False)
