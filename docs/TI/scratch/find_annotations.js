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

const img2 = decodePNG('C:/Users/Guilherme/.gemini/antigravity/brain/fe7b9dfb-dc32-415a-8bd9-5c9eb2298ebc/.user_uploaded/media_1792533129703_5cd2574f.png');

// Find user's drawing:
// 1. Blue dot: pure deep blue: r < 50, g < 100, b > 180
// 2. Purple arrows: r > 150, g < 60, b > 150
// 3. Green enclosure line: r < 40, g > 160, b < 60 (excluding the straight stock room border which is at x ~ 770 or 780)

const blueDot = [];
const purpleArrows = [];
const greenLine = [];

for (let y = 0; y < img2.height; y++) {
  for (let x = 0; x < img2.width; x++) {
    const idx = (y * img2.width + x) * 4;
    const r = img2.pixels[idx];
    const g = img2.pixels[idx + 1];
    const b = img2.pixels[idx + 2];

    if (b > 180 && r < 50 && g < 100) {
      blueDot.push({ x, y });
    }
    if (r > 130 && b > 140 && g < 70) {
      purpleArrows.push({ x, y });
    }
    // Exclude stock room border (which is vertical line around x=775)
    if (g > 150 && r < 40 && b < 60 && x < 765) {
      greenLine.push({ x, y });
    }
  }
}

console.log('Blue dot pixels:', blueDot.length);
if (blueDot.length) {
  const avgX = blueDot.reduce((s, p) => s + p.x, 0) / blueDot.length;
  const avgY = blueDot.reduce((s, p) => s + p.y, 0) / blueDot.length;
  console.log(`Blue dot center: x=${avgX.toFixed(1)}, y=${avgY.toFixed(1)}`);
}

console.log('Purple arrows pixels:', purpleArrows.length);
if (purpleArrows.length) {
  const minX = Math.min(...purpleArrows.map(p => p.x));
  const maxX = Math.max(...purpleArrows.map(p => p.x));
  const minY = Math.min(...purpleArrows.map(p => p.y));
  const maxY = Math.max(...purpleArrows.map(p => p.y));
  console.log(`Purple bounds: x=[${minX}, ${maxX}], y=[${minY}, ${maxY}]`);
}

console.log('Green enclosure pixels:', greenLine.length);
if (greenLine.length) {
  const minX = Math.min(...greenLine.map(p => p.x));
  const maxX = Math.max(...greenLine.map(p => p.x));
  const minY = Math.min(...greenLine.map(p => p.y));
  const maxY = Math.max(...greenLine.map(p => p.y));
  console.log(`Green bounds: x=[${minX}, ${maxX}], y=[${minY}, ${maxY}]`);
}
