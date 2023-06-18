
(async function main() {
    const url = "http://localhost:3000/api?key=akjdwakdaejwrkawSetWL&id=1000"
   var err,res = await fetch(url, {


  "method": "POST"
});
console.log(res);
})();