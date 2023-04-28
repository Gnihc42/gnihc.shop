

const displayElement =  document.getElementById("display");
const methodElement = document.getElementById("method");
const valA_Element = document.getElementById("a");
const valB_Element = document.getElementById("b");

const operator_str = {
    "+": "cộng",
    "-": "trừ",
    "*": "nhân",
    "/": "chia"
}
const mathfunc = {
    "+": function(a,b){return a+b;},
    "-": function(a,b){return a-b;},
    "*": function(a,b){return a*b;},
    "/": function(a,b){return a/b;}
}

const message_Element = document.getElementById("message");
function displayMessage(message,color){
    message_Element.textContent = message;
    message_Element.style.color = !!color ? color : "black";
}

function clearMessage(){
    message_Element.textContent = "";
}
function onClick(){
    clearMessage();
    try
    {
    const str_a = valA_Element.value || "a";
    const str_b = valB_Element.value || "a";

    if (isNaN(parseFloat(str_a)) || isNaN(parseFloat(str_b))) { 
        const err = isNaN(parseFloat(str_a)) ? "Sai số a" : "Sai số b"; 
        displayMessage(err,"red");
        return;
    }

    const a = Number(str_a);
    const b = Number(str_b);
    
    const operator = methodElement.value;

    var result = mathfunc[operator](a,b);
    console.log(result);    
    displayElement.value = result;
    displayMessage("Bạn vừa thực hiện phép tính "+operator_str[operator]);
    }
    catch(err)
    {
        document.getElementById("message").textContent = "bị lỗi rồi :P";
        displayMessage(err,"red");
    }
}

document.getElementById("calc").onclick = onClick;