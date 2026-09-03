import os
import re

MISSIONS_DIR = r"C:\Users\Admin\.gemini\antigravity\scratch\polyquest-app\src\features\missions"

def refactor_pips():
    for root, _, files in os.walk(MISSIONS_DIR):
        for file in files:
            if not file.endswith(".tsx"): continue
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Add FloatingMissionPip import
            if "FloatingMissionPip" not in content and "PipSpeechBubble" in content:
                content = content.replace("import { PipSpeechBubble } from '@/components/pip/PipSpeechBubble';", 
                                          "import { PipSpeechBubble } from '@/components/pip/PipSpeechBubble';\nimport { FloatingMissionPip } from '@/components/pip/FloatingMissionPip';")
            
            # Replace pattern
            pattern = re.compile(
                r'<div className="flex items-center gap-4[^"]*">\s*<Pip mood="([^"]+)"(?: size="[^"]+")? />\s*<PipSpeechBubble\s*message="([^"]+)"\s*isVisible={true}\s*/>\s*</div>',
                re.MULTILINE
            )
            
            new_content = pattern.sub(
                r'<FloatingMissionPip mood="\1" message="\2" isVisible={true} />',
                content
            )

            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Refactored: {file}")

if __name__ == "__main__":
    refactor_pips()
