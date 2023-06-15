const addMenu = document.getElementById("add_menu");
const action_add_menu = document.querySelector(".action_add_menu");

const loading_dots = document.querySelector(".loading_dots");
var menucd = false;

var urlParams = new URLSearchParams(window.location.search);
var table = urlParams.get("table");
var currentMenu = !!table ? table :  "_default";
var activatedli = $(`li[menu='${currentMenu}']`);
try{
    activatedli.addClass("drop_item_activate");
    $(activatedli.parent()[0].parentNode).addClass("drop_activate");

}
catch{

}
lastActivateItem = $(`li[menu='${currentMenu}']`);
const menuGridStyle = {
    "_default": `5fr 15fr 10fr 9fr 9fr 11fr`,
   
    "sinhvien": 
        `5fr 9fr 15fr 9fr 11fr`,
    "monhoc":
        `5fr 10fr 10fr 5fr`,
    "dangkyhoc":
        `5fr 10fr 10fr 5fr`,
    "tacgia":
        `2fr 2fr 10fr 5fr 2fr`,
    "tintuc":
        `2fr 10fr 10fr 5fr 5fr 4fr`,
    "chude":
        `2fr 3fr 10fr 1fr`
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
    ],
    tacgia:[
        {
            display: "Id tác giả",
            placeholder: "Id của tác giả",
            sqlfieldname: "id",
            type: "number"
        },
        {
            display: "Tên tác giả", 
            placeholder: "Tên của tác giả",
            sqlfieldname: "TENTG",
            maxlength: 50,
            type: "text"
        }, 
        {
            display: "Email", 
            placeholder: "Địa chỉ email của tác giả",
            sqlfieldname: "EMAIL",
            maxlength: 50,
            type: "text"
        }
    ],
    tintuc:[
        {
            display: "Nội dung",
            placeholder: "Nội dung của tin tức",
            sqlfieldname: "NOIDUNG",
            maxlength: 6900,
            type: "hugetext"
        },
        {
            display: "Tiêu đề",
            placeholder: "Tiêu đề của tin tức",
            sqlfieldname: "TIEUDE",
            maxlength: 100,
            type: "text"
        },
        {
            display: "Ngày gửi",
            sqlfieldname: "NGAYGUI",
            type: "date"
        },
        {
            display: "Id tác giả",
            sqlfieldname: "TGIA_ID",
            type: "number"
        },
        {
            display: "Id chủ đề",
            placeholder: "Id của chủ đề",
            sqlfieldname: "CHUDE_ID",
            type: "number"
        },
        {
            display: "Link ảnh",
            placeholder: "Link ảnh của tin tức",
            sqlfieldname: "ANH",
            maxlength: 100,
            type: "hugetext"
        },
    ],
    chude:[
        {
            display: "Id chủ đề",
            placeholder: "Id của chủ đề",
            sqlfieldname: "id",
            type: "number"
        },
        {
            display: "Tên chủ đề",
            placeholder: "Tên của chủ đề",
            sqlfieldname: "TENCD",
            maxlength: 50,
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
$(".drop-down").on("click", function(item){
    var dropdown_ele = $(item.target.parentNode);
    var hasclass = dropdown_ele.hasClass("drop_activate");
    console.log(hasclass);
    $(".dropdownList").removeClass("drop_activate");
    console.log(dropdown_ele);
    if (hasclass){return;}
    dropdown_ele.addClass("drop_activate");
  
    if (dropdown_ele.hasClass("drop_activate") && lastActivateItem!=null){
     
        lastActivateItem.addClass("drop_item_activate");
        return;
    }
    lastActivateItem = $(".drop_item_activate");
    $(".drop-items").removeClass("drop_item_activate");
   
});


$("#inputwrapper > a").on("click",function(){
    console.log("Brahl");
    $("#search-bar").val("")
    insertParam("search","");
})
function Search(e){
    
    $("#search-box").toggleClass("drop_activate");
    $("#inputwrapper").addClass("search-bar-hidden");
    $("#inputwrapper").toggleClass("search-bar-not-hidden");

    if (e){
        insertParam("search", $("#search-bar").val());

        window.history.pushState({"html":$('html').html(),"pageTitle":$(document).find("title").text()},"", window.location.href);
        fetchNreload();
    }
}
    

$(".drop-items").on("click", function(item){
    $("#pageNumber").text("1");
    const triggerItem = $(item.target);
    const alreadyActivate = triggerItem.hasClass("drop_item_activate")
    $(".drop-items").removeClass("drop_item_activate");
    const lastsearch = $("#search-bar").val();
    localStorage.setItem(`${currentMenu}_search`,lastsearch);

    currentMenu = alreadyActivate ? "_default" : triggerItem.attr("menu");

    
    
    $("#search-bar").val( localStorage.getItem(`${currentMenu}_search`));
    
   

   
    changeTableStyle();
    const str = updateQueryStringParameter("list","table",currentMenu);
    window.history.pushState({"html":$('html').html(),"pageTitle":$(document).find("title").text()},"", str);
    if (alreadyActivate){
        fetchNreload();
        return;
    }
    triggerItem.toggleClass("drop_item_activate");
    if (!alreadyActivate) lastActivateItem = triggerItem;
    insertParam("search", $("#search-bar").val());
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