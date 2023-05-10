const { Pool } = require('pg');
const { PassThrough } = require('stream');
const util = require('util');
var pool,query;

const print = console.log;
const connectStr = `postgres://postgres:VoTogju1eHJp9gs@gnihcshopdb.fly.dev:5432`;
console.log(connectStr);
async function openPool(dbname = "postgres"){
  
  pool = new Pool({

    connectionString: connectStr,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  query = util.promisify(pool.query).bind(pool);
  console.log(await query(`SELECT * FROM banhang ORDER BY id ASC LIMIT 10 OFFSET 0;`));
}

openPool();
function closePool(){
  pool.exit();
  query = null;
}
async function GetData(Page) {
  try {
    const data = await query(`SELECT * FROM banhang ORDER BY id ASC LIMIT 10 OFFSET ${Page-1};`);
    return true,data.rows;
  }
  catch (err) {
    return false,console.log(err);
  }


}
async function Delete(Id){
  try {
    const data = await query(`DELETE FROM banhang WHERE Id=${Id};`);
    return true;
  }
  catch (err) {
    return false,err;
  }

}
var pattern = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
async function Edit(Id,fields){
  try {
    var editargs = "";
    for (const [key, value] of Object.entries(fields)){
      if (key == "id" || pattern.test(value)){return};
      editargs = editargs + `${key} = ${value},`
    }
    editargs = editargs.slice(0,-1);
    const finalquery = `UPDATE banhang SET ${editargs} WHERE id = ${Id};`;
    const data = await query(finalquery);
    return true;
  }
  catch (err) {
    return false,err;
  }

}

async function Add(fields){

    var editargs = "(";
    var valueargs = "("
   
    for (const [key, value] of Object.entries(fields)){
     
      if (key == "id" || pattern.test(value)){return};
      
      valueargs = valueargs + `${key},`;
      if(key=="amount"){
        editargs = editargs + `${value},`;
        continue;
      }
      editargs = editargs + `'${value}',`;
    }
    editargs = editargs.slice(0,-1) + ")";
    valueargs = valueargs.slice(0,-1) + ")";
    const finalquery = `INSERT INTO banhang${valueargs} VALUES ${editargs};`;

    var data = await query(finalquery);
  
    return true;



}
module.exports = {
  Add:Add,
  GetData: GetData,
  Delete:Delete,
  openPool:openPool,
  closePool:closePool,
};