from flask import Flask, request, jsonify
from flask_cors import CORS
import osFeed
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
            {"role": "assistant", "content": "Thank you for providing the job description. Please provide feedback on how well the resume matches the job description and suggest areas for improvement.If you can be simple,short and concise and avoind numbering the points"},
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
