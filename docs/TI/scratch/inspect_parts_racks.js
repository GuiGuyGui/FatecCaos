const fs = require('fs');
const zlib = require('zlib');

function decodePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  let pos = 8;
  let width, height;
  const idatChunks = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    pos += 12 + len;
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
    } else if (type === 'IDAT') idatChunks.push(data);
    else if (type === 'IEND') break;
  }
  const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));
  const bytesPerPixel = 4;
  const stride = 1 + width * bytesPerPixel;
  const pixels = Buffer.alloc(width * height * 4);
  let prevLine = Buffer.alloc(width * bytesPerPixel);
  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * stride];
    const currLine = decompressed.subarray(y * stride + 1, (y + 1) * stride);
    const reconLine = Buffer.alloc(width * bytesPerPixel);
    for (let x = 0; x < width * bytesPerPixel; x++) {
      const a = x >= bytesPerPixel ? reconLine[x - bytesPerPixel] : 0;
      const b = prevLine[x];
      const c = x >= bytesPerPixel ? prevLine[x - bytesPerPixel] : 0;
      let val = currLine[x];
      if (filter === 1) val = (val + a) & 0xff;
      else if (filter === 2) val = (val + b) & 0xff;
      else if (filter === 3) val = (val + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        reconLine[x] = (val + ((pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c))) & 0xff;
      } else reconLine[x] = val;
    }
    prevLine = reconLine;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      pixels[idx] = reconLine[x * 4];
      pixels[idx + 1] = reconLine[x * 4 + 1];
      pixels[idx + 2] = reconLine[x * 4 + 2];
      pixels[idx + 3] = reconLine[x * 4 + 3];
    }
  }
  return { width, height, pixels };
}

const img3 = decodePNG('assets/parts_racks_strip.png');
console.log('Image 3 (parts racks):', img3.width, img3.height);

// Detect rack boundaries along X axis
const colHasContent = [];
for (let x = 0; x < img3.width; x++) {
  let has = false;
  for (let y = 0; y < img3.height; y++) {
    const idx = (y * img3.width + x) * 4;
    const a = img3.pixels[idx + 3];
    if (a > 30) { has = true; break; }
  }
  colHasContent.push(has);
}

// Group contiguous content spans
const spans = [];
let inSpan = false;
let start = 0;
for (let x = 0; x < img3.width; x++) {
  if (colHasContent[x] && !inSpan) {
    inSpan = true;
    start = x;
  } else if (!colHasContent[x] && inSpan) {
    inSpan = false;
    spans.push({ start, end: x - 1, width: x - start });
  }
}
if (inSpan) spans.push({ start, end: img3.width - 1, width: img3.width - start });

console.log('Detected racks in Image 3:', spans.length);
spans.forEach((s, i) => console.log(`Rack ${i}: x=[${s.start}, ${s.end}], width=${s.width}`));
