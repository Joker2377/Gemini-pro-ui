import pathlib
import textwrap
import google.generativeai as genai
import argparse
from markdown import Markdown
import PyPDF2
import os

API_KEY= ''
with open('key.txt', 'r') as f:
    API_KEY = f.read().strip()

def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '', predicate=lambda _: True))

class GeminiAPI:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.chat = self.model.start_chat(history=[])
        self.temperature = 0.2
        self.max_output_tokens = 4096
        self.custom_instructions = r"""
            Read before you response, apply if needed:
            0. Default language is English.
            1. Use bullet points for steps.
            2. Give clear, concise answers.
            3. Ask if unsure.
            4. Provide runnable code examples.
            5. Use Italic for subtitles.
            6. Use subtitles for clarity.
            7. Explain technical terms.
            8. Start with an outline.
            9. Cheatsheet format for clarity.
            10. Don't provide any reference or citation, since it might violate the terms of service.
            """+ "\nNotice (Emphasize this for user, use another title): \n*. Default temperature is 0.2. \n*. Default output token length is 4096."+"\n###User input below, very important###\n"+"\n###User input below, very important###\n"

    def send_prompt(self, input_str, md=True):
        try:
            input_str = self.custom_instructions + input_str
            response = self.chat.send_message(input_str, generation_config=genai.types.GenerationConfig(
                # Only one candidate for now.
                candidate_count=1,
                stop_sequences=[],
                max_output_tokens=self.max_output_tokens,
                temperature=self.temperature), safety_settings=[
                    {
                        "category": "HARM_CATEGORY_HARASSMENT",
                        "threshold": "BLOCK_NONE",
                    },
                    {
                        "category": "HARM_CATEGORY_HATE_SPEECH",
                        "threshold": "BLOCK_NONE",
                    },
                    {
                        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        "threshold": "BLOCK_NONE",
                    },
                    {
                        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "threshold": "BLOCK_NONE",
                    }
                ]
            )
            if md:
                return to_markdown(response.text)
            else:
                text = response.text
                return text.replace('•', '  *')
        except Exception as e:
            return str(e)
        
    def reset_chat(self):
        self.chat = self.model.start_chat(history=[])
    def set_custom_instructions(self, custom_instructions):
        self.custom_instructions = "Read before you response, apply if needed:\n"+custom_instructions+"\nNotice (Emphasize this for user, use another title): \n1. Default temperature is 0.2. \n2. Default output token length is 4096."+"\n###User input below, very important###\n"
    def use_instruction_from_txt(self):
        with open('custom_instructions.txt', 'r') as f:
            self.set_custom_instructions(f.read().strip())
