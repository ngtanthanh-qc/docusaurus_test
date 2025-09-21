import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

print("Testing translation...")

from googletrans import Translator
translator = Translator()

# Test translation
text = "Hello, this is a test"
result = translator.translate(text, dest='vi')
print(f"Original: {text}")
print(f"Vietnamese: {result.text}")

result = translator.translate(text, dest='zh-cn')
print(f"Chinese: {result.text}")

print("Translation test successful!")
print("You can now run the full auto-translate script.")