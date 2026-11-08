# sbs.py live.jpg ours.jpg out.jpg scale  -> one image: live (left) | ours (right), labelled, capped height.
import sys
from PIL import Image, ImageDraw
a, b = Image.open(sys.argv[1]).convert('RGB'), Image.open(sys.argv[2]).convert('RGB')
s = float(sys.argv[4])
a = a.resize((int(a.width * s), int(a.height * s))); b = b.resize((int(b.width * s), int(b.height * s)))
H = min(max(a.height, b.height), 16000); gap = 24; top = 34
o = Image.new('RGB', (a.width + b.width + gap, H + top), (128, 128, 128))
o.paste(a.crop((0, 0, a.width, min(a.height, H))), (0, top)); o.paste(b.crop((0, 0, b.width, min(b.height, H))), (a.width + gap, top))
d = ImageDraw.Draw(o); d.text((8, 10), 'LIVE hanzo.ai (dark)', fill=(255, 255, 0)); d.text((a.width + gap + 8, 10), 'OURS (dark)', fill=(255, 255, 0))
o.save(sys.argv[3], quality=62, optimize=True)
