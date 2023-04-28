
var currentPath = window.location.pathname;
var parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
var url = window.location.origin + parentPath;

const dataurl = `${url}/data`;
console.log(dataurl);

var actualId = {};


function addHighlight(cname) {
    for (e of document.querySelectorAll(`.${cname}`)) {
        e.classList.add("gridHighlight");
    }
}
function removeHighlight(cname) {
    for (e of document.querySelectorAll(`.${cname}`)) {
        e.classList.remove("gridHighlight");
    }
}
function addElement(key, value, index) {
    if (!placeholder.querySelector("." + key)) { return; }
    var clone = placeholder.querySelector("." + key).cloneNode(true);
    var eclass = `data_${index}`;
    clone.textContent = value;
    clone.classList.add(eclass)
    document.querySelector(".maingrid").appendChild(clone);

    clone.addEventListener('mouseenter', () => {
        addHighlight(eclass);
    });
    clone.addEventListener('mouseleave', () => {
        removeHighlight(eclass);
    });
    console.log(key, value);
}
const placeholder = document.getElementById("placeholder");

var index = 1;

function Edit(id) {
    console.log("LMAO");
    console.log(id);
}
async function Delete(id) {
    console.log("Lol");


    const res = await fetch(`${url}/delete`,
    {
        headers:{
            "Content-Type": "application/json"
        },  
        method:"POST",
        body:JSON.stringify({
            id:id
        })
    }
    );
    const status = await res.status;
    console.log(status);
    if (status == "200"){
        console.log(status);
        await fetchNreload();
    }
}

function reloadPage(TempData){
    var maingrid = document.querySelector(".maingrid");
    for (element of maingrid.querySelectorAll(".Data")){
        maingrid.removeChild(element);
    }
    index = 1;
    for (data of TempData) {


        addElement("Number", index.toString(), index);

        for (const [key, value] of Object.entries(data)) {
            addElement(key, value, index)
        }
        const actionBar = placeholder.querySelector(".Action").cloneNode(true);
        actionBar.querySelector(".Edit").setAttribute('onclick', `Edit(${data["id"]}); return false;`);
        
        actionBar.querySelector(".Delete").setAttribute('onclick', `Delete(${data["id"]}); return false;`);
        document.querySelector(".maingrid").appendChild(actionBar);
        const eclass = `data_${index}`;
        console.log(eclass);
        actionBar.addEventListener('mouseenter', () => {
            addHighlight(eclass);
        });
        actionBar.addEventListener('mouseleave', () => {
            removeHighlight(eclass);
        });

        index++;
    }
    console.log(TempData);
}

async function fetchNreload(){
    const response = await fetch(dataurl);
    const TempData = await response.json();
    console.log(TempData)
    reloadPage(TempData);
}
(async function () {
    fetchNreload();
})();
