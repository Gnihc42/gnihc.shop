const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
const checkIsAdmin = require("isAdmin.js");
const addNavbar = require("addNavbar.js");
const sql = require("sql.js");


console.log(sql);

function init(app,passedvalues){
  const Data = passedvalues[0];
    sql.openPool();

    app.get("/adminPage",cookieParser(),checkIsAdmin(Data),async (req,res)=>{
        res.set({ 'content-type': 'application/json charset=utf-8' });
       
      
      
   
        res.redirect("/adminPage/list");
      });

      app.get("/adminPage/data",cookieParser(),checkIsAdmin(Data),async(req,res)=>{
        res.set({ 'content-type': 'text/plain charset=utf-8' });
        const data = await sql["GetData"](1);
   
        res.end(JSON.stringify(data));
      });
      app.post("/adminPage/edit",cookieParser(),checkIsAdmin(Data),async(req,res)=>{
        res.set({ 'content-type': 'text/plain charset=utf-8' });
        const data = await sql["Edit"](req.body.id,req.body.changes);
   
        res.end(JSON.stringify(data));
      })
      app.post("/adminPage/add",cookieParser(),checkIsAdmin(Data),async(req,res)=>{
    
        if (!req.body ){
          res.status(400);
          res.end("Missing body!");
          return;
       
        }
        try{
          var success = await sql.Add(req.body);
        
          if(!success){

            throw new Error("Add failed!");
            
          }
          res.status(200);
          res.end("Success!");
        }
        catch(err){
    
          res.status(500);
          res.end("Internal Error!");
        }
        
      })
      app.post("/adminPage/delete",cookieParser(),checkIsAdmin(Data),async(req,res)=>{
      
        if (!req.body || !req.body.id){
          res.status(400);
          res.end("Missing id!");
          return;
       
        }
        try{
          var success = await sql.Delete(req.body.id);

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
  