const fs = require('fs');
const zlib = require('zlib');

function decodePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  let pos = 8;
  let width, height, bitDepth, colorType;
  const idatChunks = [];

  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    pos += 12 + len;

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }

  const allIdat = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(allIdat);
  const bytesPerPixel = colorType === 6 ? 4 : (colorType === 2 ? 3 : 1);
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

      if (filter === 0) {}
      else if (filter === 1) val = (val + a) & 0xff;
      else if (filter === 2) val = (val + b) & 0xff;
      else if (filter === 3) val = (val + Math.floor((a + b) / 2)) & 0xff;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        const pr = (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
        val = (val + pr) & 0xff;
      }
      reconLine[x] = val;
    }
    prevLine = reconLine;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (bytesPerPixel === 4) {
        pixels[idx] = reconLine[x * 4];
        pixels[idx + 1] = reconLine[x * 4 + 1];
        pixels[idx + 2] = reconLine[x * 4 + 2];
        pixels[idx + 3] = reconLine[x * 4 + 3];
      } else if (bytesPerPixel === 3) {
        pixels[idx] = reconLine[x * 3];
        pixels[idx + 1] = reconLine[x * 3 + 1];
        pixels[idx + 2] = reconLine[x * 3 + 2];
        pixels[idx + 3] = 255;
      }
    }
  }

  return { width, height, pixels };
}

const img2 = decodePNG('C:/Users/Guilherme/.gemini/antigravity/brain/fe7b9dfb-dc32-415a-8bd9-5c9eb2298ebc/.user_uploaded/media_1792533129703_5cd2574f.png');
console.log('Decoded Image 2:', img2.width, img2.height);

// Detect blue dot (solid saturated blue)
let bluePixels = [];
// Detect purple arrows (purple lines: high R, low G, high B)
let purplePixels = [];
// Detect green line (bright pure green: R < 50, G > 150, B < 80)
let greenPixels = [];

for (let y = 0; y < img2.height; y++) {
  for (let x = 0; x < img2.width; x++) {
    const idx = (y * img2.width + x) * 4;
    const r = img2.pixels[idx];
    const g = img2.pixels[idx + 1];
    const b = img2.pixels[idx + 2];

    // Blue dot (drawn with a strong blue like #2563eb or #1d4ed8 or #3b82f6)
    if (b > 180 && r < 80 && g < 120) {
      bluePixels.push({ x, y, r, g, b });
    }
    // Purple lines (e.g. #9333ea, #a855f7, #c026d3)
    if (r > 130 && b > 140 && g < 90) {
      purplePixels.push({ x, y, r, g, b });
    }
    // Green line (e.g. #16a34a, #22c55e, #10b981)
    if (g > 140 && r < 70 && b < 80) {
      greenPixels.push({ x, y, r, g, b });
    }
  }
}

console.log('Blue pixels count:', bluePixels.length);
if (bluePixels.length > 0) {
  const avgX = bluePixels.reduce((s, p) => s + p.x, 0) / bluePixels.length;
  const avgY = bluePixels.reduce((s, p) => s + p.y, 0) / bluePixels.length;
  console.log(`Blue dot center: x=${avgX.toFixed(1)}, y=${avgY.toFixed(1)}`);
  console.log('Sample blue pixel:', bluePixels[0]);
}

console.log('Purple pixels count:', purplePixels.length);
if (purplePixels.length > 0) {
  // Let's filter to x < 500 (inside cabine #01 where arrows are)
  const cabinePurple = purplePixels.filter(p => p.x < 500);
  console.log('Cabine purple count:', cabinePurple.length);
  if (cabinePurple.length > 0) {
    const minX = Math.min(...cabinePurple.map(p => p.x));
    const maxX = Math.max(...cabinePurple.map(p => p.x));
    const minY = Math.min(...cabinePurple.map(p => p.y));
    const maxY = Math.max(...cabinePurple.map(p => p.y));
    console.log(`Cabine purple arrows bounds: x=[${minX}, ${maxX}], y=[${minY}, ${maxY}]`);
    console.log('Sample purple pixel:', cabinePurple[0]);
  }
}

console.log('Green pixels count:', greenPixels.length);
if (greenPixels.length > 0) {
  // Exclude stock room wall at x >= 760
  const receptionGreen = greenPixels.filter(p => p.x < 760 && p.x > 350);
  console.log('Reception green count:', receptionGreen.length);
  if (receptionGreen.length > 0) {
    const minX = Math.min(...receptionGreen.map(p => p.x));
    const maxX = Math.max(...receptionGreen.map(p => p.x));
    const minY = Math.min(...receptionGreen.map(p => p.y));
    const maxY = Math.max(...receptionGreen.map(p => p.y));
    console.log(`Reception green line bounds: x=[${minX}, ${maxX}], y=[${minY}, ${maxY}]`);
    console.log('Sample green pixel:', receptionGreen[0]);
  }
}
