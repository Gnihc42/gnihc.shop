process.env.NODE_PATH = "/gnihc.shop/modules";
require("module").Module._initPaths();

console.log(process.env.NODE_PATH);
require("/isAdmin.js")