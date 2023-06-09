const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
const checkIsAdmin = require("isAdmin.js");
const addNavbar = require("addNavbar.js");
const sql = require("sql.js");
const bodyParser = require('body-parser');



function init(app,passedvalues){
  const Data = passedvalues[0];
    sql.openPool();

    app.get("/adminPage",cookieParser(),checkIsAdmin(Data),async (req,res)=>{
        res.set({ 'content-type': 'application/json charset=utf-8' });
       
      
      
   
        res.redirect("/adminPage/list");
      });

      app.get("/adminPage/data",cookieParser(),checkIsAdmin(Data),async(req,res)=>{
        const page = !!req.query.page ?  Number(req.query.page) : 1;
        const table = !!req.query.table ? req.query.table : "banhang";
        const search = req.query.search;
        res.set({ 'content-type': 'text/plain charset=utf-8' });
        const [success,data] = await sql["GetData"](page,table,search);
        if (!success) { res.status(401); res.end("Error"); return};
        res.end(JSON.stringify(data));  
      });
      app.post("/adminPage/edit",cookieParser(),checkIsAdmin(Data),async(req,res)=>{
        res.set({ 'content-type': 'text/plain charset=utf-8' });
        const table = !!req.query.table ? req.query.table : "banhang";
        const data = await sql["Edit"](req.body.id,req.body.changes,table);
   
        res.end(JSON.stringify(data));
      })
      app.post("/adminPage/add",cookieParser(),checkIsAdmin(Data),async(req,res)=>{
        
        const table = !!req.query.table ? req.query.table : "banhang";
        console.log(req.query.table);
        if (!req.body ){
          res.status(400);
          res.end("Missing body!");
          return;
       
        }
        try{
          var [success,err] = await sql.Add(req.body,table);
          
          if(success != null){

            throw new Error(`Add failed!\n${err}`);
            
          }
          res.status(200);
          res.end("Success!");
        }
        catch(err){
    
          res.status(500);
          console.log(err);
          res.write(err.message);
          res.end("Internal Error!");
        }
        
      })
      app.post("/adminPage/delete",cookieParser(),checkIsAdmin(Data),async(req,res)=>{
        const table = !!req.query.table ? req.query.table : "banhang";
        if (!req.body || !req.body.id){
          res.status(400);
          res.end("Missing id!");
          return;
       
        }
        try{
          var success = await sql.Delete(req.body.id,table);
          console.log(success);
          if(!success){
      
            throw new Error("Delete failed!");
            
          }
          res.status(200);
          res.end("Success!");
        }
        catch (err){
         
          res.status(500);
          res.end("Internal Error!");
        }
        
      })
}
module.exports = init;
  