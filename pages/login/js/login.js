function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

var hasSession = getCookie("loginSession") != undefined; 

console.log(hasSession);
if (hasSession){
    window.location.replace("/member");

}

function serialize(){
            
    var data = $('#myform').serialize();
    console.log(data);
    data["Remember"] = $('#check').prop('checked').toString();
    console.log(data);
    console.log($('#check').prop('checked'));
    return data;
}
function SubForm() {
    console.log("Click");
    document.getElementById("error").style="visibility: hidden; ";
    $.ajax({
        url: '/loginAction',
        type: 'post',
        data: serialize(),
        success: function (data) {

            window.location.replace("/member")
        },
        error: function(data){
            console.log(data);
            data = JSON.parse(data.responseText);
            document.getElementById("error").style="";
            console.log(data);
            document.getElementById("error").innerHTML = data.Error;
        }
    });
}