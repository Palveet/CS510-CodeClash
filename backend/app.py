from flask import Flask, request, render_template
from openai import OpenAI
from flask_cors import CORS, cross_origin
import google.generativeai as genai
import os


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def create_openai_client():
    api_key = "" #add your key here for chatgpt
    print(api_key)
    return OpenAI(api_key=api_key)
    # return OpenAI()

def create_gemini_client():
    GOOGLE_API_KEY='' #add your key here for gemini
    genai.configure(api_key=GOOGLE_API_KEY)
    return genai.GenerativeModel('gemini-pro')

def get_code_from_openai(client, user_prompt):

    full_prompt = user_prompt + " Please include '--- start code ---' before the code and '--- end code ---' after the code."
    prompt_messages = [
        {"role": "user", "content": full_prompt}
    ]
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=prompt_messages
    )
    return completion.choices[0].message.content

def get_code_from_gemini(client, user_prompt):
    
    full_prompt = user_prompt + " Please include '--- start code ---' before the code and '--- end code ---' after the code."
    response = client.generate_content(full_prompt)
    return response.text

def extract_code_section(output, start_marker, end_marker):
    
    start_index = output.find(start_marker) + len(start_marker)
    end_index = output.find(end_marker)
    return output[start_index:end_index].strip()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        user_prompt = request.json['prompt']
        codes = []
        start_code_marker = "--- start code ---"
        end_code_marker = "--- end code ---"
        client = create_openai_client()
        output = get_code_from_openai(client, user_prompt)
        extracted_code = extract_code_section(output, start_code_marker, end_code_marker)
        codes.append(extracted_code)
        client = create_gemini_client()
        output = get_code_from_gemini(client, user_prompt)
        extracted_code = extract_code_section(output, start_code_marker, end_code_marker)
        codes.append(extracted_code)
        return codes

if __name__ == "__main__":
    app.run(debug=True)
