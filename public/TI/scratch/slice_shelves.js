const fs = require('fs');
const zlib = require('zlib');

function decodePng(filePath) {
  const buf = fs.readFileSync(filePath);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf[24];
  const colorType = buf[25];

  console.log(filePath, { width, height, bitDepth, colorType });

  let pos = 8;
  const idatChunks = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IDAT') {
      idatChunks.push(buf.slice(pos + 8, pos + 8 + len));
    }
    pos += 12 + len;
  }

  const compressed = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(compressed);

  // Each scanline: 1 filter byte + width * bytesPerPixel
  const bytesPerPixel = colorType === 6 ? 4 : (colorType === 2 ? 3 : 1);
  const stride = 1 + width * bytesPerPixel;
  const pixels = Buffer.alloc(width * height * 4);

  const prevRow = Buffer.alloc(width * bytesPerPixel);
  const currRow = Buffer.alloc(width * bytesPerPixel);

  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * stride];
    const scanline = decompressed.slice(y * stride + 1, (y + 1) * stride);

    for (let x = 0; x < width * bytesPerPixel; x++) {
      const b = x >= bytesPerPixel ? currRow[x - bytesPerPixel] : 0;
      const a = prevRow[x];
      const c = x >= bytesPerPixel ? prevRow[x - bytesPerPixel] : 0;

      let val = scanline[x];
      if (filter === 1) val = (val + b) & 0xff; // Sub
      else if (filter === 2) val = (val + a) & 0xff; // Up
      else if (filter === 3) val = (val + Math.floor((b + a) / 2)) & 0xff; // Average
      else if (filter === 4) { // Paeth
        const p = b + a - c;
        const pa = Math.abs(p - b);
        const pb = Math.abs(p - a);
        const pc = Math.abs(p - c);
        let pr = c;
        if (pa <= pb && pa <= pc) pr = b;
        else if (pb <= pc) pr = a;
        val = (val + pr) & 0xff;
      }
      currRow[x] = val;
    }

    currRow.copy(prevRow);

    for (let x = 0; x < width; x++) {
      const pIdx = (y * width + x) * 4;
      if (colorType === 6) { // RGBA
        pixels[pIdx] = currRow[x * 4];
        pixels[pIdx + 1] = currRow[x * 4 + 1];
        pixels[pIdx + 2] = currRow[x * 4 + 2];
        pixels[pIdx + 3] = currRow[x * 4 + 3];
      } else if (colorType === 2) { // RGB
        pixels[pIdx] = currRow[x * 3];
        pixels[pIdx + 1] = currRow[x * 3 + 1];
        pixels[pIdx + 2] = currRow[x * 3 + 2];
        pixels[pIdx + 3] = 255;
      }
    }
  }

  return { width, height, pixels };
}

// Inspect column alpha / content to identify shelf gaps
function findGaps(png, threshold = 250) {
  const colScores = [];
  for (let x = 0; x < png.width; x++) {
    let nonWhitePixels = 0;
    for (let y = 0; y < png.height; y++) {
      const idx = (y * png.width + x) * 4;
      const r = png.pixels[idx];
      const g = png.pixels[idx + 1];
      const b = png.pixels[idx + 2];
      const a = png.pixels[idx + 3];

      // Treat as empty if transparent or almost pure white / background grid
      const isBg = a < 20 || (r > threshold && g > threshold && b > threshold);
      if (!isBg) nonWhitePixels++;
    }
    colScores.push(nonWhitePixels);
  }

  // Find continuous spans of content
  const spans = [];
  let inSpan = false;
  let start = 0;
  for (let x = 0; x < png.width; x++) {
    if (colScores[x] > 5) {
      if (!inSpan) {
        inSpan = true;
        start = x;
      }
    } else {
      if (inSpan) {
        inSpan = false;
        spans.push({ start, end: x - 1, width: x - start });
      }
    }
  }
  if (inSpan) spans.push({ start, end: png.width - 1, width: png.width - start });
  return { colScores, spans };
}

module.exports = { decodePng, findGaps };

if (require.main === module) {
  const sm = decodePng('assets/shelves_sm_strip.png');
  console.log('SM Spans:', findGaps(sm).spans);

  const lg = decodePng('assets/shelves_lg_strip.png');
  console.log('LG Spans:', findGaps(lg).spans);
}
