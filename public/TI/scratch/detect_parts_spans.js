const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('assets/parts_racks_strip.png');
let pos = 8;
const idats = [];
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  if (type === 'IDAT') idats.push(buf.subarray(pos + 8, pos + 8 + len));
  pos += 12 + len;
}
const decompressed = zlib.inflateSync(Buffer.concat(idats));
const width = 1024;
const height = 149;
const stride = 1 + width * 4;

const colMaxAlpha = new Array(width).fill(0);

let prevLine = Buffer.alloc(width * 4);
for (let y = 0; y < height; y++) {
  const filter = decompressed[y * stride];
  const curr = decompressed.subarray(y * stride + 1, (y + 1) * stride);
  const recon = Buffer.alloc(width * 4);

  for (let x = 0; x < width * 4; x++) {
    const a = x >= 4 ? recon[x - 4] : 0;
    const b = prevLine[x];
    const c = x >= 4 ? prevLine[x - 4] : 0;
    let v = curr[x];
    if (filter === 1) v = (v + a) & 0xff;
    else if (filter === 2) v = (v + b) & 0xff;
    else if (filter === 3) v = (v + Math.floor((a + b) / 2)) & 0xff;
    else if (filter === 4) {
      const p = a + b - c;
      const pa = Math.abs(p - a);
      const pb = Math.abs(p - b);
      const pc = Math.abs(p - c);
      recon[x] = (v + ((pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c))) & 0xff;
    } else recon[x] = v;
  }
  prevLine = recon;

  for (let x = 0; x < width; x++) {
    const alpha = recon[x * 4 + 3];
    if (alpha > colMaxAlpha[x]) colMaxAlpha[x] = alpha;
  }
}

// Find spans where colMaxAlpha > 20
const spans = [];
let inSpan = false;
let start = 0;
for (let x = 0; x < width; x++) {
  if (colMaxAlpha[x] > 20 && !inSpan) {
    inSpan = true;
    start = x;
  } else if (colMaxAlpha[x] <= 20 && inSpan) {
    inSpan = false;
    spans.push({ start, end: x - 1, width: x - start });
  }
}
if (inSpan) spans.push({ start, end: width - 1, width: width - start });

console.log('Parts racks spans count:', spans.length);
spans.forEach((s, i) => console.log(`Rack ${i}: start=${s.start}, end=${s.end}, width=${s.width}`));
