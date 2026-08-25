"""Outline the wordmarks from Zen and regenerate src/wordmarks.ts.

    uv venv .venv && uv pip install --python .venv/bin/python "fonttools[woff]" brotli uharfbuzz
    .venv/bin/python scripts/wordmarks.py

Text becomes PATHS, so a rendered wordmark needs no font present. Cut at wght
606 (the house `medium` preset) and shaped through HarfBuzz, so pair spacing is
the font's own GPOS kerning rather than naive advances.

Deliberately NOT part of `pnpm build`: outlines are static data, and making
every build depend on Python and fontTools to reproduce bytes that never change
is a cost with no payer. Run it when NAMES changes or the face is recut.
"""
import sys, json
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
import uharfbuzz as hb

FONT = __import__("os").environ.get("ZEN_FONT", "../font/packages/zen/dist/fonts/zen-sans/Zen-Variable.woff2")

def outline(text, wght=606):
    # a static cut at the wordmark weight — 606 is the house `medium` preset
    var = TTFont(FONT)
    inst = instancer.instantiateVariableFont(var, {'wght': wght}, inplace=False)
    inst.flavor = None  # harfbuzz cannot read woff2; TTFont keeps the flavour on save
    buf_io = __import__('io').BytesIO(); inst.save(buf_io); raw = buf_io.getvalue()

    face = hb.Face(raw); font = hb.Font(face)
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(font, buf)                      # GPOS kerning applied here

    gs = inst.getGlyphSet()
    order = inst.getGlyphOrder()
    d, x = [], 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        pen = SVGPathPen(gs)
        gs[name].draw(TransformPen(pen, (1, 0, 0, 1, x + pos.x_offset, pos.y_offset)))
        seg = pen.getCommands()
        if seg: d.append(seg)
        x += pos.x_advance
    path = ' '.join(d)

    # tight ink box, so the caller sizes by what is drawn rather than by metrics
    bp = BoundsPen(gs)
    xx = 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        gs[order[info.codepoint]].draw(TransformPen(bp, (1, 0, 0, 1, xx + pos.x_offset, pos.y_offset)))
        xx += pos.x_advance
    x0, y0, x1, y1 = bp.bounds
    return {'d': path, 'box': [x0, y0, x1 - x0, y1 - y0], 'advance': x, 'upem': inst['head'].unitsPerEm}

if __name__ == '__main__':
    print(json.dumps(outline(sys.argv[1] if len(sys.argv) > 1 else 'Hanzo AI')))

NAMES = ['Hanzo', 'Hanzo AI', 'Hanzo ID', 'Hanzo Cloud', 'Hanzo Dev', 'Hanzo App',
         'Hanzo Chat', 'Hanzo Base', 'Hanzo Industries', 'Hanzo Commerce',
         'Hanzo Platform', 'Hanzo Docs', 'Hanzo Studio', 'Lux', 'Zoo', 'Pars']
