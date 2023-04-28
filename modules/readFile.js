const fs = require("fs");
async function readFile(filePath) {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return data;
  }

module.exports = readFile;