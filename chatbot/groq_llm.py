import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_chatbot_response(user_message):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a helpful hospital data assistant."},
            {"role": "user", "content": user_message}
        ],
        temperature=0.4
    )
    return response.choices[0].message.content