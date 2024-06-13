from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import AzureOpenAI

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ENDPOINT = "https://polite-ground-030dc3103.4.azurestaticapps.net/api/v1"
API_KEY = "681f3465-f9c7-4488-addb-04de5c2217cc"
API_VERSION = "2024-02-01"
MODEL_NAME = "gpt-35-turbo"

client = AzureOpenAI(
    azure_endpoint=ENDPOINT,
    api_key=API_KEY,
    api_version=API_VERSION,
)

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        cv_text = data.get('cv_text')
        jd_text = data.get('jd_text')
        if not cv_text or not jd_text:
            return jsonify({'error': 'Missing cv_text or jd_text'}), 400

        messages = [
            {"role": "user", "content": f"Here is a resume: {cv_text}"},
            {"role": "assistant", "content": "Thank you for providing the resume."},
            {"role": "user", "content": f"Here is the job description: {jd_text}"},
            {"role": "assistant", "content": "Thank you for providing the job description. Please provide feedback on how well the resume matches the job description and suggest areas for improvement."},
        ]

        completion = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=0.7,
            max_tokens=1024,
            n=1,
            stop=None,
            messages=messages,
        )

        feedback = completion.choices[0].message.content
        return jsonify({'feedback': feedback})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
