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

  query = util.promisify(pool.query).bind(pool);
  var data = await query(`SELECT * FROM sinhvien;`);
  console.log(data);


  console.log(data.rows);
}


function closePool(){
  pool.exit();
  query = null;
}
const allowedTable = [
  "banhang",
  "monhoc",
  "sinhvien",
  "dangkyhoc"
];
async function GetData(Page,Table="banhang") {
  if (!allowedTable.includes(Table))return false,"Forbidden Table";
  try {
    const data = await query(`SELECT * FROM ${Table} ORDER BY id ASC LIMIT 10 OFFSET ${(Page-1)*10};`);
    return true,data.rows;
  }
  catch (err) {
    return false,console.log(err);
  }


}
async function Delete(Id,table="banhang"){
  try {
    var data,err = await query(`DELETE FROM ${table} WHERE Id=${Id};`);
   
    if (!data){return new Error(err)};
    return true;
  }
  catch (err) {
    return false,err;
  }

}
var pattern = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
async function Edit(Id,fields,table="banhang"){
  try {
    var editargs = "";
   
    for (const [key, value] of Object.entries(fields)){
      if (key == "id" || pattern.test(value)){break};

      if(typeof value=="number"){
        editargs = editargs + `${key} = ${value},`;
        continue;
      }

      editargs = editargs + `${key} = '${value}',`

    }
    editargs = editargs.slice(0,-1);  
    console.log(editargs);
    const finalquery = `UPDATE ${table} SET ${editargs} WHERE id = ${Id};`;
    console.log(finalquery);
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

async function Add(fields,table="banhang"){

    var editargs = "(";
    var valueargs = "("
    console.log(fields);
    for (const [key, value] of Object.entries(fields)){
     
      if (key == "id" || pattern.test(!!value ? value : "")){ console.log(key); console.log(value); console.log("Add Returned"); return};
      
      valueargs = valueargs + `${key},`;
      if(key=="amount"){
        editargs = editargs + `${value},`;
        continue;
      }
      editargs = editargs + `'${value}',`;
    }
    editargs = editargs.slice(0,-1) + ")";
    valueargs = valueargs.slice(0,-1) + ")";
    const finalquery = `INSERT INTO ${table}${valueargs} VALUES ${editargs};`;
    console.log(finalquery);
    var data,err = await query(finalquery);
    console.log("Bruh?");
    return [data,err];



}
module.exports = {
  Add:Add,
  GetData: GetData,
  Delete:Delete,
  openPool:openPool,
  closePool:closePool,
  Edit:Edit,
};