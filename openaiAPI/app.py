from flask import Flask, request, render_template
from openai import OpenAI

app = Flask(__name__)

def create_openai_client():
    """Initialize and return the OpenAI client."""
    return OpenAI()

def get_code_from_openai(client, user_prompt):
    """Request the OpenAI API to generate a completion based on the user prompt and return the output content."""

    full_prompt = user_prompt + " Please include '--- start code ---' before the code and '--- end code ---' after the code."
    prompt_messages = [
        {"role": "user", "content": full_prompt}
    ]
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=prompt_messages
    )
    return completion.choices[0].message.content

def extract_code_section(output, start_marker, end_marker):
    """Extract the code section from the API response using start and end markers."""
    start_index = output.find(start_marker) + len(start_marker)
    end_index = output.find(end_marker)
    return output[start_index:end_index].strip()

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        user_prompt = request.form['prompt']
        start_code_marker = "--- start code ---"
        end_code_marker = "--- end code ---"

        client = create_openai_client()
        output = get_code_from_openai(client, user_prompt)
        extracted_code = extract_code_section(output, start_code_marker, end_code_marker)

        return render_template('index.html', extracted_code=extracted_code)
    return render_template('index.html', extracted_code=None)

if __name__ == "__main__":
    app.run(debug=True)
