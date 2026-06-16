from flask import Flask

from routes.valores import valores_bp

app = Flask(__name__)

app.register_blueprint(valores_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5002)