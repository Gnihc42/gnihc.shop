const express = require('express');
const router = express.Router();
const url = require('url');
const fs = require('fs');
const { parse } = require('path');
const print = console.log;
const fetch = require("node-fetch")
const not_found = function (res) {
  res.statusCode = 404;
  res.end('Not Found\n');
};
const sql = require("sql.js")
  

const token = 'MTAyNjQxMTQ3NTg4NTEwOTI2OQ.GS5slW.IP_9sXpdLcGHbQqPz8si4Y_zfTVJar4ER4kDeY'; // Replace with your bot's access token

const sendMessage = async (message,channelId) => {
  console.log(channelId)
  const url = `https://discord.com/api/v9/channels/${channelId}/messages`;
  console.log(message);

  console.log(message)
  const payload = {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json',
    },
    body: `{"content":"${message}"}`,
  };

  

  try {
    const response = await fetch(url, payload);
    const data = await response.json();
    console.log('Message sent:', data);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

const sendEmbed = async (name="Anonymous",id,title,message,color = "0xff0400",channelId) => {

  const url = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=420x420&format=Png&isCircular=false`;
  console.log(url);
 
  var res = await fetch(url, {

      "body": null,
      "method": "GET"
      })
  
  const data = await res.json();
  const avatarUrl = data.data[0].imageUrl;
    console.log(avatarUrl);
  const discordurl = `https://discord.com/api/v9/channels/${channelId}/messages`;
  color = parseInt(color);
  const body = JSON.stringify({
    embed:{
              author: {
                  name : name,
                  icon_url: avatarUrl,
              },
              fields: [{
                name:title,
                value: message,
                inline: true
              }],

              color: color,
          }
});
console.log(body);
  const payload = {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json',
    },
    body: body,
  };

  try {
    const response = await fetch(discordurl, payload);
    const data = await response.json();
    console.log('Message sent:', data);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
router.get("/",async function(req,res){
  const parsedUrl = url.parse(req.url, true);
  console.log(parsedUrl.pathname)

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  if (parsedUrl.query.key="awrakejsrkjawtweaGetId" && parsedUrl.query.id){
    res.statusCode = 200;
    const val =  toString(await sql.Get(parsedUrl.query.id))
    res.end(val);
    return;
  }
})

router.post('/',function(req, res) {
    const parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl.pathname)
  
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
 
    if (parsedUrl.query.key == 'XDDDDDDDDDDDDDDDDDDDDDDlomwakjewkejawkejaweawe' && parsedUrl.query.message) { 
      sendMessage(parsedUrl.query.message,'1089052038152859778');
      
    }
    else if(parsedUrl.query.key == 'eaweaweaweawkejwalkjeaAMBOUTOBLOWLOOOL' && parsedUrl.query.message){
      console.log("HM")
      const query = parsedUrl.query;
      sendEmbed(query.name,query.userid,query.title,query.message,query.color,'1091001429231145061');
    }
    else if(parsedUrl.query.key="wajawktjawertjalthn3jqkhrt3ahtr3athakthjkawethUhhhhhhh" && parsedUrl.query.message){

      sendMessage(parsedUrl.query.message,'1094936448551112754')
    }
    else if (parsedUrl.query.key="akjdwakdaejwrkawSetWL" && parsedUrl.query.id){
      sql.Add(parsedUrl.query.id);
    }
    
    else{
      print('lo'); not_found(res); return 
    }
    

    res.statusCode = 200;
    res.end("Sucess");

    return "Success";

})

module.exports = router;