from flask import Flask, request, render_template
import google.generativeai as genai
import os

app = Flask(__name__)

def create_gemini_client():
    """
    Initialize and return the Gemini client.
    """
    return genai.GenerativeModel('gemini-pro')

def get_code_from_gemini(client, user_prompt):
    """
    Request the Gemini API to generate content based on the user prompt and return the output content.
    Concatenates specific instructions to include code markers around the expected code block.
    """
    full_prompt = user_prompt + " Please include '--- start code ---' before the code and '--- end code ---' after the code."
    response = client.generate_content(full_prompt)
    return response.text

def extract_code_section(output, start_marker, end_marker):
    """
    Extract the code section from the API response using start and end markers.
    """
    start_index = output.find(start_marker) + len(start_marker)
    end_index = output.find(end_marker)
    return output[start_index:end_index].strip()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        user_prompt = request.form['prompt']
        start_code_marker = "--- start code ---"
        end_code_marker = "--- end code ---"

        client = create_gemini_client()
        output = get_code_from_gemini(client, user_prompt)
        extracted_code = extract_code_section(output, start_code_marker, end_code_marker)

        return render_template('index.html', extracted_code=extracted_code)
    return render_template('index.html', extracted_code=None)

if __name__ == "__main__":
    app.run(debug=True)
