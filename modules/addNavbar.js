
const readFile = require("../modules/readFile.js")
const path = require('path');

async function addNavbar(req, res) {
    res.write(`<link rel="icon" type="image/x-icon"
    href="/shared/icon/ico.png">`)
    


    const data2 = await readFile(path.join(rootDir, "/pages/shared/navbar.html"));
    res.write(data2);
  
  }
  
module.exports = addNavbar;