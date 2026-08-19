const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function png(w, h, [r, g, b], out) {
  const row = Buffer.concat([Buffer.from([0]), Buffer.alloc(w * 3, 0)]);
  for (let i = 0; i < w * 3; i += 3) {
    row[i + 1] = r;
    row[i + 2] = g;
    row[i + 3] = b;
  }
  const raw = Buffer.concat(Array(h).fill(row));
  const idat = zlib.deflateSync(raw, { level: 9 });
  const crc = (type, data) => {
    const buf = Buffer.concat([Buffer.from(type), data]);
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc(type, data));
    return Buffer.concat([len, Buffer.from(type), data, crcBuf]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const file = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, file);
}

const dir = path.join(__dirname, '..', 'www', 'icons');
png(192, 192, [33, 118, 210], path.join(dir, 'icon-192.png'));
png(512, 512, [33, 118, 210], path.join(dir, 'icon-512.png'));
console.log('Icons created in', dir);
