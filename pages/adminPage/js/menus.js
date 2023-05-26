const addMenu = document.getElementById("add_menu");
const action_add_menu = document.querySelector(".action_add_menu");

const loading_dots = document.querySelector(".loading_dots");
var menucd = false;

var urlParams = new URLSearchParams(window.location.search);
var table = urlParams.get("table");
var currentMenu = !!table ? table :  "_default";
lastActivateItem = $(`li[menu='${currentMenu}']`);
const menuGridStyle = {
    "_default": `5fr 15fr 10fr 9fr 9fr 11fr`,
   
    "sinhvien": 
        `5fr 9fr 15fr 9fr 11fr`,
    "monhoc":
        `5fr 10fr 10fr 5fr`,
    "dangkyhoc":
        `5fr 10fr 10fr 5fr`
}

const menuGridItem = {
   _default: [
        {
            
            display: "Tên sản phẩm",
            placeholder: "Tên của sản phẩm",
            sqlfieldname: "name",
            type: "text"
            
        },
        {
            
            display: "Nhà sản xuất",
            placeholder: "Kingston, Samsung, AMD, Intel",
            sqlfieldname: "manu",
            type: "text"
        },
        {
            display: "Phân loại",
            placeholder: "Tên của sản phẩm",
            sqlfieldname: "type",
            type: "option"
        },
        {
            
            placeholder: "Số lượng tồn kho",
            display : "Số lượng",
            sqlfieldname: "amount",
            type:"number"
        }
        
    ],
    sinhvien:[
        {
            display: "Mã số sinh viên", 
            placeholder: "Mã số của sinh viên",
            sqlfieldname: "mssv",
            maxlength: 7,
            type: "text"
        },
        {
            display: "Họ và Tên",
            placeholder: "Họ và Tên của sinh viên",
            sqlfieldname: "hoten",
            maxlength: 50,
            type: "text"
        },
        {
            display: "Ngày Sinh",
            sqlfieldname: "ngaysinh",
            type: "date"
        }
    ],
    monhoc:[
        {
            display: "Mã Môn Học", 
            placeholder: "Mã của Môn Học",
            sqlfieldname: "mamh",
            maxlength: 10,
            type: "text"
        }, 
        {
            display: "Tên Môn Học", 
            placeholder: "Tên của Môn Học",
            sqlfieldname: "tenmh",
            maxlength: 50,
            type: "text"
        }, 
    ],
    dangkyhoc:[
        {
            display: "Mã Sinh Viên", 
            placeholder: "Mã của sinh viên đăng ký",
            sqlfieldname: "idsv",
            maxlength: 7,
            type: "text"
        }, 
        {
            display: "Mã Môn Học", 
            placeholder: "Tên của Môn Học mà sinh viên đăng ký",
            sqlfieldname: "idmh",
            maxlength: 10,
            type: "text"
        }, 
    ]

}
function OpenMenu() {
    $(".inputerr").removeClass("not_hidden");
    if (menucd) { return; }
    setTimeout(function () {
        menucd = false
    }, 300);

    menucd = true;
    addMenu.reset();
    for (element of document.querySelectorAll(".inputlabel")) {
 
        element.classList.remove("error");


    }
    addMenu.classList.remove("hidden");
    addMenu.classList.add("blur_anim");
}
function closeaddMenu() {
    addMenu.classList.add("hidden");
    editingId = null;
   
}
function errRm() {
    for (element of document.querySelectorAll(".inputlabel")) {
        element.classList.remove("error");
        const inp = element.querySelector("input");
        if (!inp) {
            continue;
        }
        inp.classList.remove("error");
    }
    document.querySelector("select").classList.remove("error");
}
const amountPattern = "e";
async function errMark(data) {
    var obj = {};
    const menuKey = currentMenu;
  
    $(".inputerr").removeClass("not_hidden");
    for (const [index,val] of data.entries()) {
        if (menuGridItem[menuKey][index].type == "number"){
            obj[val.name] = Number(val.value);
            continue;
        }
        obj[val.name] = val.value;
    }
    var haserror = false;
    for (const [index,element] of document.getElementById("add_menu_fields").querySelectorAll(".inputlabel").entries()) {
        const forval = element.getAttribute("for");
        var span;
        span = !!element.getElementsByTagName("span")[0] ? element.getElementsByTagName("span")[0] : element.parentNode.getElementsByTagName("span")[0];

        span.classList.remove("not_hidden");
        console.log(index);
        if (obj[forval].toString().length >= 1) { continue; }
       
        haserror = true;
        element.classList.add("error");
        span.classList.add("not_hidden");
        console.log(menuGridItem[currentMenu][index]);
    
        span.textContent  = menuGridItem[currentMenu][index].display + " không được bỏ trống";
        
    }
    console.log(haserror);
    return [haserror,obj];
}
var currentPath = window.location.pathname;
var parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
var url = window.location.origin + parentPath;
console.log(url);
var editingId = null;
function Edit(id) {

    
    addMenu.classList.remove("hidden");
    addMenu.classList.add("blur_anim");
 
    for (const [key,value] of Object.entries(TempData[id])){
      
        $(`#m_${key}`).val(value);
        if(key=="id")
        editingId=value;
    }
    
   
}
var lastActivateItem;
const dropdown_ele = $("#dropdown");
function drop_down_click(){

    dropdown_ele.toggleClass("drop_activate");
  
    if (dropdown_ele.hasClass("drop_activate") && lastActivateItem!=null){
     
        lastActivateItem.addClass("drop_item_activate");
        return;
    }
    lastActivateItem = $(".drop_item_activate");
    $(".drop-items").removeClass("drop_item_activate");
   
    
}

$(".drop-items").on("click", function(item){
    const triggerItem = $(item.target);
    const alreadyActivate = triggerItem.hasClass("drop_item_activate")
    $(".drop-items").removeClass("drop_item_activate");
    currentMenu = alreadyActivate ? "_default" : triggerItem.attr("menu");
    changeTableStyle();
    const str = updateQueryStringParameter("list","table",currentMenu);
    window.history.pushState({"html":$('html').html(),"pageTitle":$(document).find("title").text()},"", str);
    if (alreadyActivate){
        fetchNreload();
        return;
    }
    triggerItem.toggleClass("drop_item_activate");
    
    fetchNreload();
 });

function loadMenu(){
    
}
async function save() {
    errRm();
    const serialData = $('#add_menu').serializeArray();

    var [bool,objdata] = await errMark(serialData);
  
    if (bool) return;
    action_add_menu.classList.add("hidden");    
    $(".loading_dots").removeClass("hidden");
   
    const addorsave = editingId != null ? "edit" : "add";
    if (editingId != null)

    objdata = {
        id:editingId,
        changes:objdata,
 
    };

    setTimeout(async function(){
    const res = await fetch(`${url}/${addorsave}`+`?table=${currentMenu}`,
        {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(objdata)
        }
    );
    const status = await res.status;
    if (status == "200") {
        closeaddMenu();
        console.log("reloading");
        await fetchNreload();
    }

  
    action_add_menu.classList.remove("hidden");
    $(".loading_dots").addClass("hidden");
  
},1000)

}