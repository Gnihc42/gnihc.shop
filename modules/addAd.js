const readFile = require("../modules/readFile.js")
const path = require('path');

async function addAd(req,res){

    const data2 = await readFile(path.join(rootDir, "/pages/shared/quangcao.html"));
    res.write(data2);
    return;
  }

module.exports = addAd;
