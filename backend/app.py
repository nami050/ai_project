from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

# 🔐 Get API key from environment (or fallback for testing)
GROQ_API_KEY = os.environ.get("GROQ_API_KEY") or "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"

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
    "model": "llama-3.1-8b-instant",
    "messages": [
        {"role": "user", "content": user_message}
    ]
}
        )

        result = response.json()

        # 🔍 Debug print (very helpful)
        print("API RESPONSE:", result)

        # ✅ Handle error response safely
        if "choices" not in result:
            return jsonify({
                "reply": "API Error: " + str(result)
            })

        reply = result["choices"][0]["message"]["content"]

        return jsonify({"reply": reply})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"reply": "Error: " + str(e)})

# ✅ Optional home route (to avoid 404 confusion)
@app.route("/")
def home():
    return "AI Backend Running 🚀"

if __name__ == "__main__":
    app.run(debug=True)