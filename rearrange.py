import os
import re
import base64

source_file = r"c:\Users\HP\Downloads\womens_day_6.html"
target_dir = r"c:\Users\HP\OneDrive\Desktop\WM\womens_day_card"

if not os.path.exists(target_dir):
    os.makedirs(target_dir)

with open(source_file, "r", encoding="utf-8") as f:
    content = f.read()

# Extract Style
style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL | re.IGNORECASE)
if style_match:
    style_content = style_match.group(1)
    css_dir = os.path.join(target_dir, "css")
    os.makedirs(css_dir, exist_ok=True)
    with open(os.path.join(css_dir, "style.css"), "w", encoding="utf-8") as f:
        f.write(style_content.strip())
    content = content[:style_match.start()] + '<link rel="stylesheet" href="css/style.css">' + content[style_match.end():]

# Extract Script
script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL | re.IGNORECASE)
if script_match:
    script_content = script_match.group(1)
    js_dir = os.path.join(target_dir, "js")
    os.makedirs(js_dir, exist_ok=True)
    with open(os.path.join(js_dir, "script.js"), "w", encoding="utf-8") as f:
        f.write(script_content.strip())
    content = content[:script_match.start()] + '<script src="js/script.js"></script>' + content[script_match.end():]

# Extract base64 images
img_dir = os.path.join(target_dir, "img")
os.makedirs(img_dir, exist_ok=True)

def replace_base64(match):
    global img_counter
    mime_type = match.group(1)
    b64_data = match.group(2)
    ext = "jpg"
    if "png" in mime_type: ext = "png"
    if "gif" in mime_type: ext = "gif"
    
    img_filename = f"image_{img_counter}.{ext}"
    img_path = os.path.join(img_dir, img_filename)
    
    try:
        with open(img_path, "wb") as f:
            f.write(base64.b64decode(b64_data))
    except Exception as e:
        print(f"Error decoding image {img_counter}: {e}")
        
    img_counter += 1
    return f'src="img/{img_filename}"'

img_counter = 1
content = re.sub(r'src="data:image/([^;]+);base64,([^"]+)"', replace_base64, content)

# Write index.html
with open(os.path.join(target_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully rearranged {source_file} into {target_dir}")
