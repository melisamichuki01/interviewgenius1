from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import AzureOpenAI

app = Flask(__name__)
CORS(app)

ENDPOINT = "https://polite-ground-030dc3103.4.azurestaticapps.net/api/v1"
API_KEY = "681f3465-f9c7-4488-addb-04de5c2217cc"  # Replace with your actual API key
API_VERSION = "2024-02-01"
MODEL_NAME = "gpt-35-turbo"

client = AzureOpenAI(
    azure_endpoint=ENDPOINT,
    api_key=API_KEY,
    api_version=API_VERSION,
)

@app.route('/start_interview', methods=['GET'])
def start_interview():
    initial_message = "Interview has started.Say Hi to start."
    return jsonify({'message': 'Interview started. Say Hi to start.', 'question': initial_message})

@app.route('/ask_question', methods=['POST'])
def ask_question():
    try:
        data = request.get_json()
        user_answer = data.get('user_answer')

        if user_answer is None:
            return jsonify({'error': 'Missing user_answer'}), 400

        messages = [
            {"role": "system", "content": "You are an interviewer asking questions to a candidate for a project/product manager position. Generate the next question based on the candidate's last answer."},
            {"role": "user", "content": f"Candidate's answer: {user_answer}"}
        ]

        completion = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=0.7,
            max_tokens=100,
            n=1,
            stop=None,
            messages=messages,
        )

        next_question = completion.choices[0].message.content.strip()

        return jsonify({'message': 'Question received.', 'next_question': next_question})
    except Exception as e:
        print(f"Error in /ask_question: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/get_feedback', methods=['POST'])
def get_feedback():
    try:
        data = request.get_json()
        user_answers = data.get('user_answers')

        if not user_answers:
            return jsonify({'error': 'Missing user answers'}), 400

        messages = [
            {"role": "system", "content": "You are a professional interviewer providing feedback on a job interview."},
        ]
        for idx, answer in enumerate(user_answers):
            messages.append({"role": "user", "content": f"Question {idx + 1}: {answer}"})
            messages.append({"role": "assistant", "content": answer})

        completion = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=0.7,
            max_tokens=1024,
            n=1,
            stop=None,
            messages=messages,
        )

        feedback = completion.choices[0].message.content.strip()
        return jsonify({'feedback': feedback})
    except Exception as e:
        print(f"Error in /get_feedback: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
