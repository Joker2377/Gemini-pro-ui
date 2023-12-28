# Gemini-pro-ui
A simple interface for gemini-pro api based on python flask and html.
Check out the official documents and implementation:
[python_quickstart](https://ai.google.dev/tutorials/python_quickstart)

## Outline
- Requirements
- Installation
- Running the Application
- Features

## Requirements
- Flask
- GeminiAPI
- Webbrowser
- Threading
- OS

## Installation
1. **Clone Repository**: Get the project files from the repository.
2. **Install Dependencies**:
   - Flask: `pip install Flask`
   - GeminiAPI: Checkout [python_quickstart](https://ai.google.dev/tutorials/python_quickstart)
   - Other modules (`webbrowser`, `threading`, `os`) are part of the Python standard library.

## Running the Application
- Set your API key in `key.txt`. Get your api key at [Get an api key](https://ai.google.dev/tutorials/setup)
- Set your custom instructions in `custom_instructions.txt` if needed.
- Run the script: `python main.py`.

## Features
- Integration with GeminiAPI for chatbot functionality.
- Web browser automation for easy access.
- Default custom instructions.
