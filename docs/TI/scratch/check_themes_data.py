import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/all_30_themes.json', 'r', encoding='utf-8') as f:
    themes = json.load(f)

print('Total themes in all_30_themes.json:', len(themes))
for i, t in enumerate(themes):
    var = t['variations'][0]
    mg = t['minigameType']
    part = t['requiredPart']
    title = var['theme']
    q_len = len(var['questions'])
    t_len = len(var['tools'])
    w_len = len(var['wrongs'])
    print(f'{i+1:2d}. [{mg:18s}] part={part:16s} title={title[:30]:30s} Q:{q_len} T:{t_len} W:{w_len}')
