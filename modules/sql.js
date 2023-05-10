const { Pool } = require('pg');
const { PassThrough } = require('stream');
const util = require('util');
var pool,query;

const print = console.log;

async function openPool(dbname = "postgres"){
  const connectStr = `postgres://postgres:${process.env.Psqlpassword}@${process.env.Psqlhost}:5432/${dbname}`;
  pool = new Pool({

    connectionString: connectStr,
   
  });
  console.log(connectStr);
  query = util.promisify(pool.query).bind(pool);
  console.log(await query(`SELECT * FROM banhang ORDER BY id ASC LIMIT 10 OFFSET 0;`));
}


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
      editargs = editargs + `${key} = '${value}',`
    }
    editargs = editargs.slice(0,-1);  
    console.log(editargs);
    const finalquery = `UPDATE banhang SET ${editargs} WHERE id = ${Id};`;
    const data = await query(finalquery);
    console.log(data);
    console.log("Edit Success!");
    return true;
  }
  catch (err) {
    console.log(err);
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
  Edit:Edit,
};