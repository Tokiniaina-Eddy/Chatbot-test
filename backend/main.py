from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPEN_KEY"),
)


SYSTEM_INSTRUCTION = {
    "role": "system",
    "content": os.getenv("INSTRUCT")
}
@app.route("/")
def home():
    return jsonify({"Success":"OK"})

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    

    user_history = data.get("messages", [])
    

    full_messages = [SYSTEM_INSTRUCTION] + user_history
    
    try:
        completion = client.chat.completions.create(
            model=os.getenv("MODEL"),
            messages=full_messages 
        )
        
  
        return jsonify({"response": completion.choices[0].message.content})
        
    except Exception as e:
        print(f"Erreur : {e}")
        return jsonify({"error" : str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
