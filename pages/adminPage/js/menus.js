const addMenu = document.getElementById("add_menu");
const action_add_menu = document.querySelector(".action_add_menu");

const loading_dots = document.querySelector(".loading_dots");
var menucd = false;
function OpenMenu() {

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
function errMark(data) {
    var obj = {};
    for (val of data) {

        obj[val.name] = val.value;
    }
    var haserror = false;
    for (element of document.querySelectorAll(".inputlabel")) {
        const forval = element.getAttribute("for");
        
        if (obj[forval].length >= 1 || forval == "amount" && amountPattern.test(obj[forval])) { continue; }

        haserror = true;
        element.classList.add("error");


    }
    console.log(haserror);
    return haserror,obj;
}
var currentPath = window.location.pathname;
var parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
var url = window.location.origin + parentPath;
console.log(url);
async function save() {

    const data = $('#add_menu').serializeArray();
    var bool,objdata = errMark(data);

    if (bool) return;
    action_add_menu.classList.add("hidden");
    loading_dots.classList.remove("hidden");
    console.log(addMenu);
    setTimeout(async function(){
    const res = await fetch(`${url}/add`,
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

    console.log(objdata);
    action_add_menu.classList.remove("hidden");
    loading_dots.classList.add("hidden");
    errRm();
},1000)

}