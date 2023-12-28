from flask import Flask, render_template, request, jsonify
from GeminiAPI import GeminiAPI
import webbrowser
from threading import Timer
import os

API_KEY= ''

with open('key.txt', 'r') as f:
    API_KEY = f.read().strip()
# Create a Flask web application
app = Flask('chatApp', template_folder='.')
app.static_folder = 'static'
api = GeminiAPI(API_KEY)

# Define a route for the home page
@app.route('/')
def home():
    return render_template('home.html')

# Route to process user input and return a chatbot response
@app.route('/process_user_input', methods=['POST'])
def process_user_input():
    data = request.json
    #app.logger.info('Received data:', data)  # Log the received data
    user_input = data.get('message', '')
    response = api.send_prompt(user_input, md=False)
    #app.logger.info(response)
    return jsonify({'response': response})

@app.route('/clear_chat', methods=['POST'])
def clear_chat():
    api.reset_chat()
    return jsonify({'response': ''})

@app.route('/set_custom_instructions', methods=['POST'])
def set_custom_instructions():
    data = request.json
    custom_instructions = data.get('instructions', '')
    api.set_custom_instructions(custom_instructions)
    return jsonify({'response': ''})

@app.route('/use_instruction_from_txt', methods=['POST'])
def use_instruction_from_txt():
    api.use_instruction_from_txt()
    return jsonify({'response': ''})


def main():
    if not os.environ.get("WERKZEUG_RUN_MAIN"):
        webbrowser.open_new('http://127.0.0.1:2000/')

    app.run(host="127.0.0.1", port=2000)

if __name__ == '__main__':
    main()
    # app.run(debug=False, processes=cpu_count())
