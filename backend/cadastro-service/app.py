from flask import Flask, jsonify
from flask_cors import CORS

from routes.especialidades import especialidades_bp
from routes.medicos import medicos_bp
from routes.pacientes import pacientes_bp
from routes.consultorios import consultorios_bp
from routes.exames import exames_bp
from routes.medicamentos import medicamentos_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(especialidades_bp)
app.register_blueprint(medicos_bp)
app.register_blueprint(pacientes_bp)
app.register_blueprint(consultorios_bp)
app.register_blueprint(exames_bp)
app.register_blueprint(medicamentos_bp)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Cadastro Service funcionando"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)