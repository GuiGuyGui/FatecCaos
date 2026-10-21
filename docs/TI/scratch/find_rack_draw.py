import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('game.js', 'r', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r"type:\s*['\"]rack['\"]", text):
    start = max(0, m.start() - 100)
    end = min(len(text), m.end() + 250)
    print('--- MATCH AT', m.start(), '---')
    print(text[start:end])

# Also check drawWorld where f.type === 'rack'
for m in re.finditer(r"f\.type === ['\"]rack['\"]", text):
    start = max(0, m.start() - 100)
    end = min(len(text), m.end() + 250)
    print('--- DRAW MATCH AT', m.start(), '---')
    print(text[start:end])
