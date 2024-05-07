# CS510-CodeClash
## Team Members:
Palveet Kaur Saluja (psaluja2) and Rudrik Patel (rudrikp2)

## Code generation and execution platform using LLMs
A web-based application that utilizes leading Language Large Models (LLMs) for the task of code generation. This platform provides an interactive environment where users can formulate natural language queries to generate executable code across more than 40 programming languages. Additionally, CodeClash offers functionalities for editing and directly executing code within the platform. It uniquely enables the comparison of outputs from various LLMs, such as GPT-3.5/4 and Gemini facilitating an analytical approach to selecting the most effective code solution.

Demo Link: https://drive.google.com/file/d/1eIYyOh0VoF6glV5r77QLiasvspxrdeot/view

## Instructions:
1. clone the github repository : https://github.com/Palveet/CS510-CodeClash
2. npm install for react libraries
3. pip install - flask, cors, google.generative ai and open ai
4. add API keys for OPENAI and Gemini in /backend/app.py file
5. Make .env file to save RAPIDAPI_HOST and RAPIDAPI_KEY
```
REACT_APP_RAPID_API_HOST = YOUR_HOST_URL
REACT_APP_RAPID_API_KEY = YOUR_SECRET_KEY
REACT_APP_RAPID_API_URL = YOUR_SUBMISSIONS_URL
```
   
7. running react app : npm run start 
8. running flask app : flask --app app --debug run
9. Use the tool: entering a prompt in the text area.
