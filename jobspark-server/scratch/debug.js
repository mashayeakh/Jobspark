import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'dist', 'server.js');
if (!fs.existsSync(filePath)) {
  console.log("dist/server.js does not exist!");
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const searchStr = 'Failed to parse AI response into JSON format';
let index = content.indexOf(searchStr);

while (index !== -1) {
  console.log(`--- Match at index ${index} ---`);
  const start = Math.max(0, index - 200);
  const end = Math.min(content.length, index + searchStr.length + 300);
  console.log(content.substring(start, end));
  index = content.indexOf(searchStr, index + 1);
}
