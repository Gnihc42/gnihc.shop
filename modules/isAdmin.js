const readFile = require("readFile.js");
const addNavbar = require("addNavbar.js");
const path = require("path");
const addAd = require("addAd.js");
async function AdminReject(req,res){
  res.set({ 'content-type': 'text/html charset=utf-8' });
  await addNavbar(req,res);

  filePath = path.join(rootDir, "pages/adminPage/denied/index.html");
  const data = await readFile(filePath);
  
  await addAd(req,res);
  res.end(data);
}
function checkIsAdmin(Data) {

      

  return async function(req,res,next){
    if (!req.cookies["loginSession"]) { 
      await AdminReject(req,res) 
      return;
    }
    const cookies = JSON.parse(req.cookies["loginSession"]);
    if(cookies.Name != "Admin" || Data["Admin"].Pass!=cookies.Pass){
   
      await AdminReject(req,res)
      return;
    }
    console.log("XD");
    if (!req.cookies["loginSession"]){await AdminReject(req,res); return;}
    next();
  }
}


module.exports = checkIsAdmin;