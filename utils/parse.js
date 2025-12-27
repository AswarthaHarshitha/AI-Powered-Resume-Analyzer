const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function parsePDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (err) {
    throw err;
  }
}

async function parseDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (err) {
    throw err;
  }
}

async function parseFile(path, mimetype) {
  const buffer = fs.readFileSync(path);
  if (mimetype === 'application/pdf') {
    return parsePDF(buffer);
  }
  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimetype === 'application/msword') {
    return parseDOCX(buffer);
  }
  // fallback: treat as text
  return buffer.toString('utf-8');
}

module.exports = { parseFile };
