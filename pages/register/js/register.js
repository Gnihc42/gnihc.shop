

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



    return data;
}


function validateDate(value) {
    try{
          var date = value.split("-");
         var d = parseInt(date[0], 10),
        m = parseInt(date[1], 10),
        y = parseInt(date[2], 10);
        return new Date(y, m - 1, d);
    }
    catch(err){
        return false;
    }


}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }

const specPattern = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

const regCondicts = [
    {
        element:$('#iname'),
        ValidateFunc:function(value){
            return value.length < 3 || value.length > 20;
        },
        err_mes:'Nhập Tên đăng dài từ 3 đến 20 ký tự'
    },
    {
        element:$('#iname'),
        ValidateFunc:function(value){
            return specPattern.test(value);
        },
        err_mes:'Tên không được chứa ký tự đặc biệt'
    }
    ,{
        element:$('#ipass'),
        ValidateFunc:function(value){
            return value.length < 6 || value.length > 20;
        },
        err_mes:'Mật khẩu phải dài từ 6 đến 20 ký tự'
    },
    {
        element:$('#iprp'),
        ValidateFunc:function(value){
            var pass = $('#ipass').val(); 
            
            return value != pass;
        },
        err_mes:'Nhập lại mật khẩu trùng với mật khẩu trên'
    },
    {
        element:$('#ibirthdate'),
        ValidateFunc:function(value){
            const a = validateDate(value);
      
            return a == "Invalid Date";
        },
        err_mes:'Chọn ngày hợp lệ!'
    },
    {
        element:$('#iemail'),
        ValidateFunc:function(value){
            return !isEmail(value);
        },
        err_mes:'Nhập email hợp lệ!'
    },

];
console.log(regCondicts);

async function Validate(){
    for (e of document.querySelectorAll(".secerror")){
     
        e.classList.remove("secerror");
        try{
            e.parentNode.parentNode.querySelector(".validate").classList.remove("not_hidden");
        }
        catch(err){
        
        }
       

    }
    var success = true;
    for (cds of regCondicts){
        var element = cds.element;
        var value = element.val();
        const boolean = await ValidErr(element,cds.ValidateFunc(value),cds.err_mes);
        if(boolean){

            success = false;
        }
    
    }

    return success;
        

}
async function ValidErr(element,boolean,error){
   
    const validele = element.parent().parent().find(".validate");

    if (boolean){
        validele.text(error);
    
        validele.addClass("not_hidden");
        element.parent().addClass("secerror");
        return true;
    
    }
  

    return false;
    
}


const regisbutton =     $('#register');
async function Register(){
    $('#error').removeClass('success');
    $('#error').removeClass("not_hidden");
    $(".validate").each(function(index,element){
        element.classList.remove("not_hidden");
    });
    const validboolean = await Validate();
    if (!validboolean){    

         return;}

    regisbutton.addClass("hidden");
    $('.loading_dots').removeClass("hidden");
    setTimeout(function(){
        $.ajax({
            url: '/registerAction',
            type: 'post',
            data: serialize(),
            success: function (data) {
            
                $('#error').addClass("not_hidden");
                $('#error').addClass('success');
                $('#error').text(data.Success);

                regisbutton.removeClass("hidden");
                $('.loading_dots').addClass("hidden");
                setTimeout(function(){
                    window.location.replace("/login")
                },1000)
               
            },
            error: function(data){
                console.log(data);
                regisbutton.removeClass("hidden");
                $('.loading_dots').addClass("hidden");
                console.log(JSON.parse(data.responseText).Error);
                $('#error').text(JSON.parse(data.responseText).Error);
                $('#error').addClass("not_hidden");
            }
        }); 


    },
    1500)

}
