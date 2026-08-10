import re
import sys

def fix_trains():
    with open('lib/trains.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    # HEAD has import trainData, branch has INDIAN_TRAINS.
    # Keep HEAD (import trainData)
    content = re.sub(r'<<<<<<< HEAD\n(.*?)\n=======\n.*?\n>>>>>>> [^\n]+\n', r'\1', content, flags=re.DOTALL)
    with open('lib/trains.ts', 'w', encoding='utf-8') as f:
        f.write(content)

def fix_track():
    with open('app/track/page.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
    # Keep BOTH in track/page.tsx
    content = re.sub(r'<<<<<<< HEAD\n(.*?)\n=======\n(.*?)\n>>>>>>> [^\n]+\n', r'\1\n\2', content, flags=re.DOTALL)
    with open('app/track/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

def fix_tickets():
    with open('app/services/tickets/page.tsx', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # We will just write a new file by removing the known bad lines
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith('>>>>>>> 564291ae9f9a455ae74e66b446ab387740c9301e'):
            i += 1
            continue
        if line.startswith('<<<<<<< HEAD'):
            # at line 239, we have <<<<<<< HEAD ... =======
            # skip until =======
            while not lines[i].startswith('======='):
                i += 1
            i += 1 # skip =======
            continue
        if line.startswith('======='):
            i += 1
            continue
        out.append(line)
        i += 1
    
    with open('app/services/tickets/page.tsx', 'w', encoding='utf-8') as f:
        f.writelines(out)

fix_trains()
fix_track()
fix_tickets()
