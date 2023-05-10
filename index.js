const os = require("os");
const sep = os.platform() === 'linux' ? "/" : "//";
console.log("_SEPERATOR: ");
console.log(sep);
if (sep == "//"){
  process.env.NODE_PATH = "D:/Projects/Node/API/modules";
  require("module").Module._initPaths();
}
console.log(process.env.sqlStr)
global.rootDir = __dirname;
console.log(global.rootDir);

console.log(process.env.NODE_PATH);
const express = require('express');

const path = require('path');
const app = express();
const fs = require("fs");
const url = require('url');
const bodyParser = require('body-parser')
const checkIsAdmin = require("isAdmin.js");
const print = console.log;
const readFile = require("readFile.js");
const addNavbar = require("addNavbar.js");
const addAd = require("addAd.js");




function skip(req,res,next){
  next();
}

function addroute(route, filePath, includesnavbar,isAdmin) {

  route = route;
  console.log(route)
  filePath = path.join(__dirname, filePath);
  console.log(filePath)


  app.get(route,cookieParser(), isAdmin ? checkIsAdmin(Data) : skip,async (req, res) => {

    if (includesnavbar == true) {
      if (includesnavbar){
        
      }
      res.set({ 'content-type': 'text/html charset=utf-8' });
      await addNavbar(req, res);

      const data = await readFile(filePath);
      res.write(data);


      await addAd(req,res);
      res.end();
    }
    else {
      res.sendFile(filePath);
    }

  });
}

function scan(folder, pathname, include_parent_dir,isAdmin) {

  fs.readdir(folder, (err, files) => {

    if (!files) { return; }

    files.forEach(file => {
   
      if (file == "index.html") {

        addroute(pathname, folder + sep + file, true,isAdmin);
        return;
      }
      var filePath = path.join(folder, file)


      fs.stat(filePath, (err, stats) => {
      
        var route = "/" + file;
        route = pathname ? pathname + route : route;
        console.log(file)
        console.log(route)
        if (stats.isDirectory()) {
          scan(filePath, route, true,isAdmin);
        }
        else {

          addroute(route, filePath,false,isAdmin)
        }
      })

    });
  });
}

const pages = ["register","calculator", "home", "dataEntry", "trangchu", "login", "shared", "linhKien"]
for (const page of pages) {
  const testFolder = `./pages/${page}`;
  const route = `/${page}`;

  scan(testFolder, route);
}
scan("./pages/adminPage", "/adminPage", false,true);
app.get("/", (req, res) => {
  res.redirect("/home");
  ;
});

app.get("/home", async (req, res) => {
  res.set({ 'content-type': 'text/html charset=utf-8' });
  await addNavbar(req, res)
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  fs.readFile(path.join(__dirname, "/pages/home/index.html"), "utf-8", async (_, data) => {
    res.write(data);
    res.write(`${day}-${month}-${year}`);

    await addAd(req,res);
    res.end();
  })


})


var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(bodyParser.json());

var Data = {
  "Admin":{
    Pass:"Asd!4545"
  }
}
var pattern = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
function CheckError(req, res, result) {
  const Name = req.body.Name;
  const Pass = req.body.Pass;
  if (!Name || !Pass){ result["Error"] = "Chưa nhập tên / Mật khẩu";
   res.status(401); return;}
  if (pattern.test(Name)){
    
    res.status(401);
    result["Error"] = "Tên không được chứa dấu cách, ký tự đặc biệt"
   
  }
  if (Pass.length <= 6) {
   
    res.status(401);
    result["Error"] = "Mật khẩu phải dài hơn 6 ký tự"


  }
  if (Name.length <= 3) {
    
    res.status(401);
    result["Error"] = "Tên phải dài hơn 3 ký tự"


  }
  if (!Pass || !Name || Pass.length <= 0 || Name.length <= 0) {
 
    res.status(402);
    result["Error"] = "Bạn chưa nhập mật khẩu hoặc tên đăng nhập";

  }
  return !result["Error"]
}

function Register(req, res, result) {



  Data[req.body.Name] = {
    "Pass": req.body.Pass
  }
}
app.post("/registerAction",urlencodedParser,async(req,res)=>{
  res.setHeader("Content-Type", "application/json");
  console.log(req.body);
  var Pass,Name;
  var result = {}
  Pass = req.body.pass;
  Name = req.body.name;
  if (!Pass || !Name){
    
    result["Error"] = "Đăng ký không thành công";


  }
  if (Data[Name]){

    result["Error"] = `Tài khoản với tên "${Name}" đã tồn tại`;


  }
  if (result["Error"]){
    res.status(401);
    res.end(JSON.stringify(result));
    return;
  }

  Data[req.body.name] = {
    "Pass": req.body.pass
  }
  res.status(200);
  result["Success"] = "Đăng ký thành công. chuẩn bị chuyển hướng trong vài giây...";
  res.end(JSON.stringify(result));
})
app.post("/loginAction", urlencodedParser, async (req, res) => {

  res.setHeader("Content-Type", "application/json")
  var result = {}

  if (CheckError(req, res, result)) {

    if (req.body.Name.length < 1 || req.body.Name && !Data[req.body.Name]) {

      res.status(401);
      result["Error"] = "Tài khoản không tồn tại!";
    }
    else if (req.body.Pass != Data[req.body.Name]["Pass"]) {

   
      res.status(401);
      result["Error"] = "Tài khoản đã tồn tại và bạn nhập sai mật khẩu!";
    }
   
  }






  if (!result["Error"]) {
    result["Success"] = "Xin chào lmao";

    const expire = req.body.Remember == undefined ? 0 : new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 100);
    const tab = { "Pass": req.body.Pass, "Name": req.body.Name };
    res.status(200);

    res.setHeader('Set-Cookie', 'loginSession=' + JSON.stringify(tab) + '; expires=' + expire + '; path=/;', false)
    console.log("Success");

  }
  else {
    console.log(result["Error"])
  }


  res.end(JSON.stringify(result));
  
})
const cookieParser = require("cookie-parser");










app.get("/member", cookieParser(), async function (req, res) {
  res.set({ 'content-type': 'text/html charset=utf-8' });
  await addNavbar(req, res)
  if (req.cookies["loginSession"]) {

    const cookies = JSON.parse(req.cookies["loginSession"]);

    if (cookies.Pass && cookies.Name) {

      filePath = path.join(__dirname, "pages/member/member.html");
      const data = await readFile(filePath);
      res.write(data)
    }
    
    await addAd(req,res);
    res.end( cookies.Name == "Admin" && Data["Admin"].Pass == cookies.Pass ? "<br><br><a href='adminPage'>Bấm vào đây để truy cập trang chỉnh sửa</a>" : "")
  }
  else {

    filePath = path.join(__dirname, "pages/member/notlogin.html");
    const data = await readFile(filePath);
    
    await addAd(req,res);
    res.end(data);
  }
})
async function checkLoginSession(req, res, next) {
  if (!req.cookies["loginSession"]) {
    res.set({ 'content-type': 'text/html charset=utf-8' });
    await addNavbar(req, res);

    res.status(401);
    console.log("utf-8!!");
    res.write("<title>Chưa đăng nhập!</title>");
    res.write("<p>Bạn cần đăng nhập để truy cập trang này!</p>");
    res.write("<a href='/login'>bấm vào đây để đăng nhập</a>")
    await addAd(req,res);
    res.end();
    
    return;
  }
  next();
}
app.post('/submitData', urlencodedParser, cookieParser(), checkLoginSession, function (req, res) {


  res.set({ 'content-type': 'text/html; charset=utf-8' });
  print(req.body)
  res.write(`
  <style>
table, th, td,img {
  border:1px solid black;
}
</style>`);
  res.write(`<!DOCTYPE html> <html>`)
  res.write(`<table style='width:100%'>\n`)
  for (const [key, value] of Object.entries(req.body)) {

    res.write(`<tr><th>${key}</th>\n<td>${value}</td></tr>`)
  }
  res.write('</table>')
  res.end(`</html>`)
})

app.get('/submitData', (req, res) => {
  res.redirect("/dataEntry");
})

app.get("/dataEntry", cookieParser(), checkLoginSession, async (req, res) => {

  res.set({ 'content-type': 'text/html charset=utf-8' });
  const data2 = await readFile(path.join(__dirname, "/pages/shared/navbar.html"));
  res.write(data2);
  filePath = path.join(__dirname, "pages/dataEntry/page.html");





  const data = await readFile(filePath);
  await addAd(req,res);
  res.end(data);
})


const routes = {adminPage:[Data]};
for (const [key, value] of Object.entries(routes)) {
  const file = path.join(__dirname, `/routes/${key}.js`);

  const exported = require(file);
  const values = value ? value : [];
  exported(app,values);

}
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on http://127.0.0.1:${port} !`);
});