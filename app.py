from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os

from chatbot.groq_llm import get_chatbot_response
from powerbi.embed import POWERBI_IFRAME

load_dotenv()

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html", powerbi_iframe=POWERBI_IFRAME)

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    reply = get_chatbot_response(user_message)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True)