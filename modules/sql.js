const { Pool } = require('pg');
const { PassThrough } = require('stream');
const util = require('util');
var pool, query;

const print = console.log;

async function openPool(dbname = "postgres") {
  const connectStr = `postgres://postgres:${process.env.Psqlpassword}@${process.env.Psqlhost}:5432/${dbname}`;
  pool = new Pool({

    connectionString: connectStr,
    database: 'postgres',
  });

  query = util.promisify(pool.query).bind(pool);

}


function closePool() {
  pool.exit();
  query = null;
}
const allowedTable = [
  "banhang",
  "monhoc",
  "sinhvien",
  "dangkyhoc"
];
async function GetData(Page=1, Table = "banhang",searchfor) {
  if (!allowedTable.includes(Table)) return false, "Forbidden Table";
 
  if (Page < 1) return false, "Negative page is not allowed";
 
  try {
    var get_query = `SELECT * FROM ${Table} `;
    console.log(searchfor);
    if (!!searchfor){
      var columns = await query(`SELECT column_name
      FROM information_schema.columns
      WHERE table_name = '${Table}';`);
    
      console.log(columns.rows);
      var str = " WHERE"
      for (field of columns.rows){
        if (field.column_name=="id")continue;
     
        str = str + " CAST(" + field.column_name + ` AS VARCHAR) LIKE '%${searchfor}%' OR`;
      }
      str = str + " false ";
      get_query = get_query + str;
     
    }
    get_query = get_query + `ORDER BY id ASC LIMIT 10 OFFSET ${(Page - 1) * 10};`;
    console.log(get_query);
    const data = await query(get_query);
    return true, data.rows;
  }
  catch (err) {
    return false, console.log(err);
  }


}
async function Delete(Id, table = "banhang") {
  try {
    const finalquery = `DELETE FROM ${table} WHERE Id=${Id};`;
    var data, err = await query(finalquery);
    console.log(finalquery);
    if (!data) { return new Error(err) };
    return true;
  }
  catch (err) {
    return false, err;
  }

}
var pattern = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
async function Edit(Id, fields, table = "banhang") {
  try {
    var editargs = "";

    for (const [key, value] of Object.entries(fields)) {
      if (key == "id" || pattern.test(value)) { break };

      if (typeof value == "number") {
        editargs = editargs + `${key} = ${value},`;
        continue;
      }

      editargs = editargs + `${key} = '${value}',`

    }
    editargs = editargs.slice(0, -1);
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
    return false, err;
  }

}

async function Add(fields, table = "banhang") {

  var editargs = "(";
  var valueargs = "("
  console.log(fields);
  for (const [key, value] of Object.entries(fields)) {

    if (key == "id" || pattern.test(!!value ? value : "")) { console.log(key); console.log(value); console.log("Add Returned"); return };

    valueargs = valueargs + `${key},`;
    if (key == "amount") {
      editargs = editargs + `${value},`;
      continue;
    }
    editargs = editargs + `'${value}',`;
  }
  editargs = editargs.slice(0, -1) + ")";
  valueargs = valueargs.slice(0, -1) + ")";
  const finalquery = `INSERT INTO ${table}${valueargs} VALUES ${editargs};`;
  console.log(finalquery);
  var data, err = await query(finalquery);
  console.log("Bruh?");
  return [data, err];



}

module.exports = {
  Add: Add,
  GetData: GetData,
  Delete: Delete,
  openPool: openPool,
  closePool: closePool,
  Edit: Edit,
};