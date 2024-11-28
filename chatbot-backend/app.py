from flask import Flask, request, jsonify
from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch
import os

app = Flask(__name__)

# Set the Hugging Face API token
hf_token = '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'
os.environ['HF_TOKEN'] = hf_token

# Load the model and tokenizer
model_name = "google/flan-t5-large"
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    prompt = data.get('prompt', '')

    # Encode the input prompt
    inputs = tokenizer(prompt, return_tensors="pt")

    # Generate a response from the model
    with torch.no_grad():
        outputs = model.generate(**inputs, max_length=512, num_beams=5, early_stopping=True)

    # Decode the generated text
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)