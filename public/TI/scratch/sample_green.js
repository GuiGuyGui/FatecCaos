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
  const bytesPerPixel = colorType === 6 ? 4 : 3;
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
      pixels[idx] = reconLine[x * bytesPerPixel];
      pixels[idx + 1] = reconLine[x * bytesPerPixel + 1];
      pixels[idx + 2] = reconLine[x * bytesPerPixel + 2];
      pixels[idx + 3] = bytesPerPixel === 4 ? reconLine[x * bytesPerPixel + 3] : 255;
    }
  }
  return { width, height, pixels };
}

const img2 = decodePNG('C:/Users/Guilherme/.gemini/antigravity/brain/fe7b9dfb-dc32-415a-8bd9-5c9eb2298ebc/.user_uploaded/media_1792533129703_5cd2574f.png');

const greenSamples = [];
for (let y = 200; y < 550; y++) {
  for (let x = 400; x < 800; x++) {
    const idx = (y * img2.width + x) * 4;
    const r = img2.pixels[idx];
    const g = img2.pixels[idx + 1];
    const b = img2.pixels[idx + 2];
    if (g > 100 && g > r + 30 && g > b + 30) {
      greenSamples.push({ x, y, r, g, b });
    }
  }
}
console.log('Samples count:', greenSamples.length);
if (greenSamples.length > 0) {
  console.log('Sample 0:', greenSamples[0]);
  console.log('Sample mid:', greenSamples[Math.floor(greenSamples.length / 2)]);
  const xs = greenSamples.map(p => p.x);
  const ys = greenSamples.map(p => p.y);
  console.log(`X range: [${Math.min(...xs)}, ${Math.max(...xs)}], Y range: [${Math.min(...ys)}, ${Math.max(...ys)}]`);
}
