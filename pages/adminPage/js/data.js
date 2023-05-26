
var currentPath = window.location.pathname;
var parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
var url = window.location.origin + parentPath;
var TempData;
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


async function Delete(id) {
    console.log("Lol");


    const res = await fetch(`${url}/delete`,
        {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                id: id
            })
        }
    );
    const status = await res.status;
    console.log(status);
    if (status == "200") {
        console.log(status);
        await fetchNreload();
    }
}

function reloadPage(TempData) {
    var maingrid = document.querySelector(".maingrid");
    for (element of maingrid.querySelectorAll(".Data")) {
        maingrid.removeChild(element);
    }
    index = 1;
    for (data of TempData) {


        addElement("Number", index.toString(), index);

        for (const [key, value] of Object.entries(data)) {
            addElement(key, value, index)
        }
        const actionBar = placeholder.querySelector(".Action").cloneNode(true);
        actionBar.querySelector(".Edit").setAttribute('onclick', `Edit(${index - 1}); return false;`);

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

async function wait(time) {
    await new Promise(resolve => setTimeout(resolve, time));
}
async function fetchNreload() {

    $("#no-record-bubbles").show();
    const response = await fetch(dataurl);
    TempData = await response.json();
    $("#no-record").toggle(TempData.length <= 0);
    $("#no-record-bubbles").hide();
    $("div.loading_bar_remove").remove();
    reloadPage(TempData);
}
const title_count = $(".titles").length;
function* threadLoadingBars(){
    for (let x = 1; x <= title_count; x++) {
        console.log("Huh");
        var clone = $(".loading-bar:first").clone()
        clone.css("display","block")
        clone.appendTo('.maingrid');
        clone.addClass("loading_bar_remove");
    }

}
(async function () {


    const loadin_bar = $(".loading_bar:first")
    var maingrid = $(".maingrid");
    for (let i = 1; i <= 10; i++) {
        threadLoadingBars().next();
        
    }
    await wait(1500);
    fetchNreload();
})();
