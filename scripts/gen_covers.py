
import re, os, json
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
seed = open(os.path.join(ROOT, 'src', 'data', 'seed.js'), encoding='utf-8').read()
block = seed.split('export const ANIME = [', 1)[1].split('\nexport const DEMO_ACCOUNTS')[0]

items = []
for chunk in block.split('    id: ')[1:]:
    def grab(key):
        m = re.search(key + r":\s*'([^']*)'", chunk)
        return m.group(1) if m else ''
    items.append(dict(
        title=grab('title'), jp=grab('titleJp'), studio=grab('studio'), accent=grab('accent'),
        year=re.search(r'year:\s*(\d+)', chunk).group(1),
        eps=re.search(r'episodes:\s*(\d+)', chunk).group(1),
        type='剧场版' if '剧场版' in chunk.split('type:')[1][:12] else 'TV',
    ))

INK = (27, 27, 27)
PAPER = (251, 246, 236)
SUN = (255, 216, 77)
BOLD = 'C:/Windows/Fonts/msyhbd.ttc'
REG = 'C:/Windows/Fonts/msyh.ttc'
MONO = 'C:/Windows/Fonts/consola.ttf'

W, H = 600, 840
OUT = os.path.join(ROOT, 'public', 'covers')
os.makedirs(OUT, exist_ok=True)

def hex_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def shade(c, f):
    return tuple(max(0, min(255, int(v * f))) for v in c)

def fit_layout(n, avail):
    sizes = (96, 88, 80, 72, 64, 56, 48, 42, 36)
    # 短标题优先单列，宁可小一点，也别拆成两列
    for size in sizes:
        line = round(size * 1.12) + 10
        if n * line <= avail:
            return size, 1, n, line
    # 长标题：先算一列能放几行，再决定列数（多列右起，列内自上而下）
    for size in sizes:
        line = round(size * 1.12) + 10
        rows_max = avail // line
        if rows_max < 2:
            continue
        cols = -(-n // rows_max)
        if cols > 3:
            continue
        rows = -(-n // cols)
        if rows * line <= avail:
            return size, cols, rows, line
    return 32, 3, -(-n // 3), 46

report = []
for idx, it in enumerate(items, start=1):
    bg = hex_rgb(it['accent'])
    img = Image.new('RGB', (W, H), bg)
    d = ImageDraw.Draw(img)

    dot = shade(bg, 0.9)
    for y in range(0, H, 16):
        for x in range(0, W, 16):
            d.point((x, y), fill=dot)

    img.paste(Image.new('RGB', (W, 300), shade(bg, 0.9)), (0, H - 300))
    d.rectangle([0, 0, W - 1, H - 1], outline=INK, width=10)

    # 顶部信息条
    d.rectangle([22, 22, 182, 62], fill=INK)
    f_meta = ImageFont.truetype(MONO, 24)
    d.text((36, 30), f"{it['year']}  {it['type']}", font=f_meta, fill=SUN)

    eps_txt = '剧场版' if it['type'] == '剧场版' else f"{it['eps']} 话"
    f_eps = ImageFont.truetype(BOLD, 21)
    tw = d.textlength(eps_txt, font=f_eps)
    d.rectangle([W - 22 - tw - 30, 22, W - 22, 62], fill=PAPER, outline=INK, width=3)
    d.text((W - 22 - tw - 15, 31), eps_txt, font=f_eps, fill=INK)

    # 底部信息块
    box_top = H - 300 + 34
    d.rectangle([22, box_top, W - 22, H - 22], fill=PAPER, outline=INK, width=6)

    # 竖排标题：按可用高度自动定字号与列数（多列时右起）
    chars = list(it['title'])
    top, avail = 96, box_top - 96 - 18
    size, cols, rows, line = fit_layout(len(chars), avail)
    f_title = ImageFont.truetype(BOLD, size)
    col_gap = size + 26
    total_w = cols * col_gap
    left = W / 2 + total_w / 2 - col_gap / 2
    start_y = top + max(0, (avail - rows * line) // 2)

    for ci in range(cols):
        chunk = chars[ci * rows:(ci + 1) * rows]
        cx = left - ci * col_gap
        for ri, ch in enumerate(chunk):
            y = start_y + ri * line
            bw, bh = size + 14, round(size * 1.1) + 6
            d.rectangle([cx - bw / 2, y - 2, cx + bw / 2, y + bh], fill=PAPER, outline=INK, width=3)
            bb = d.textbbox((0, 0), ch, font=f_title)
            gw, gh = bb[2] - bb[0], bb[3] - bb[1]
            d.text((cx - gw / 2 - bb[0], y + (bh - gh) / 2 - bb[1]), ch, font=f_title, fill=INK)

    f_jp = ImageFont.truetype(REG, 21)
    f_studio = ImageFont.truetype(BOLD, 26)
    f_tag = ImageFont.truetype(MONO, 17)

    jp = it['jp']
    while d.textlength(jp, font=f_jp) > W - 96 and len(jp) > 4:
        jp = jp[:-2] + '…'
    d.text((44, box_top + 20), jp, font=f_jp, fill=(120, 110, 96))
    d.text((44, box_top + 58), it['studio'], font=f_studio, fill=INK)
    d.line([44, box_top + 102, W - 44, box_top + 102], fill=INK, width=2)
    d.text((44, box_top + 118), 'PLACEHOLDER 占位图 / 课程演示用', font=f_tag, fill=(140, 130, 116))
    d.rectangle([22, H - 48, W - 22, H - 22], fill=INK)

    path = os.path.join(OUT, 'a%03d.jpg' % idx)
    img.save(path, 'JPEG', quality=84, optimize=True, progressive=True)
    report.append(('a%03d' % idx, len(it['title']), size, cols, os.path.getsize(path)))

with open('../cover-report.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, ensure_ascii=False)
print(json.dumps([(r[0], r[2], r[3], r[4]) for r in report], ensure_ascii=False))