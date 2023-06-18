

var currentPath = window.location.pathname;
var parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
var url = window.location.origin + parentPath;
var TempData;
const dataurl = `${url}/data`;


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
function addControlElement(key, value, index) {
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

}
function addElement(key, value, index, row) {



    const field = menuGridItem[currentMenu][row];


    if (!placeholder.querySelector("." + field.type)) { console.log("Returned"); return; }
    var clone = placeholder.querySelector("." + field.type).cloneNode(true);
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

}
const placeholder = document.getElementById("placeholder");

var index = 1;


async function Delete(id) {



    const res = await fetch(`${url}/delete?table=${currentMenu != "_default" ? currentMenu : "banhang"}`,
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

    if (status == "200") {

        await fetchNreload();
    }
}
function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}
var urlParams = new URLSearchParams(window.location.search);
var myParam = urlParams.get('page');
const displayText = !!myParam ? myParam : "1";

$("#pageNumber").text(displayText);
var currentDataPage = Number(displayText);
function changePage(int) {
    const urlParams = new URLSearchParams(window.location.search);
    var myParam = urlParams.get('page');
    var index = !!myParam ? myParam : "1";
    index = (Number(index) + int);
    currentDataPage = index;
    index = index.toString();
    if (index <= 0) return;
    const str = insertParam("page", index);
    window.history.pushState({ "html": $('html').html(), "pageTitle": $(document).find("title").text() }, "", str);
    $("#pageNumber").text(index);
    fetchNreload();
}
function addActionElement(index, id) {
    const actionBar = placeholder.querySelector(".Action").cloneNode(true);
    actionBar.querySelector(".Edit").setAttribute('onclick', `Edit(${index - 1}); return false;`);

    actionBar.querySelector(".Delete").setAttribute('onclick', `Delete(${id}); return false;`);
    document.querySelector(".maingrid").appendChild(actionBar);
    const eclass = `data_${index}`;

    actionBar.addEventListener('mouseenter', () => {
        addHighlight(eclass);
    });
    actionBar.addEventListener('mouseleave', () => {
        removeHighlight(eclass);
    });
}
function reloadPage(TempData) {
    var maingrid = document.querySelector(".maingrid");
    for (element of maingrid.querySelectorAll(".Data")) {
        maingrid.removeChild(element);
    }
    var index = 1;

    for (data of TempData) {


        addControlElement("Number", index.toString(), index);
        showid = false;
        for (var field of menuGridItem[currentMenu]) if (field.sqlfieldname == "id") { showid = true; break; }
        var row = 0;
        console.log(data);
        console.log(menuGridItem[currentMenu]);
        for (var [key, value] of Object.entries(data)) {
        
            if (key == "id" && !showid) { console.log("continued"); 
                if (currentMenu=="tintuc"){row++};
                continue; }
            const field = menuGridItem[currentMenu][row];
            console.log(key);
            console.log(field);
            if (!field){continue;}
            if (field.type == "hugetext") { console.log(field); row++; continue; }
            if (field.type == "date") {
                console.log(key);
                console.log(value);
                var dateParts = value.split('T')[0].split('-');
                value = dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
                data[key] = value;

            }

            addElement(key, value, index, row);
            row++;
        }
        addActionElement(index, data["id"]);

        index++;
    }

}

async function wait(time) {
    await new Promise(resolve => setTimeout(resolve, time));
}
async function fetchNreload() {
    var url = dataurl;
    url = url + `?table=${currentMenu != "_default" ? currentMenu : "banhang"}`
    if (currentDataPage != 1) {
        url = url + `&page=${currentDataPage}`;
    }
    var urlParams = new URLSearchParams(window.location.search);
    var searchquer = urlParams.get("search");
    var initsearch = !!searchquer ? searchquer : "";

    url = url + `&search=${initsearch}`;
    $("#no-record-bubbles").show();
    const response = await fetch(url);
    TempData = await response.json();
    $("#no-record").toggle(TempData.length <= 0);
    var norecordmess = "Không có bản ghi nào";
    $("#no-record").text(norecordmess + (!!initsearch && initsearch != "" ? ` với truy vấn tìm kiếm "${initsearch}"` : ""))
    $("#no-record-bubbles").hide();
    $("div.loading_bar_remove").remove();
    reloadPage(TempData);
}
const title_count = $(".titles").length;
function* threadLoadingBars() {
    for (let x = 1; x <= title_count; x++) {

        var clone = $(".loading-bar:first").clone()
        clone.css("display", "block")
        clone.appendTo('.maingrid');
        clone.addClass("loading_bar_remove");
    }

}
function changeTableStyle() {



    const maingrid = $(".maingrid");
    maingrid.empty();
    $("#add_menu_fields").empty();

    const menuKey = currentMenu;


    const fields = menuGridItem[menuKey];

    var barnum = 2;
    for (var field of menuGridItem[menuKey]) {

        if (field.type == "hugetext") { console.log("Continued"); continue; }
        barnum = barnum + 1;
    }
    $('<div>', {

        class: 'titles',
        text: "STT"
    }).appendTo(".maingrid");
    for (var field of fields) {





        if (field.type != "hugetext") {

            $('<div>', {

                class: 'titles',
                text: field.display
            }).appendTo(".maingrid");
        };




        if (field.sqlfieldname == "id") { continue }

        var clone = $(`#placeholder${field.type}`).clone(true);
        clone.attr("placeholder", field.placeholder);
        clone.removeAttr("id");
        clone.appendTo("#add_menu_fields");
        var label = clone.add(clone.children()).filter(".inputlabel");
        const text = field.display + label.html();
        label.html(text);
        label.attr("for", field.sqlfieldname);

        var input = clone.add(clone.children()).filter("input,select");
        input.attr("id", "m_" + field.sqlfieldname);
        input.attr("name", field.sqlfieldname);
        input.attr("placeholder", field.placeholder);
        if (!!field.maxlength) {

            input.attr("maxLength", field.maxlength.toString());

        }






    }

    $('<div>', {

        class: 'titles',

    }).appendTo(".maingrid");
    for (var i = 1; i <= barnum; i++) {
        $('<hr>', {

            width: "100%",

            color: "green"
        }).appendTo(".maingrid");
    }
    maingrid.css("grid-template-columns", menuGridStyle[menuKey]);


}
(async function () {


    $("#search-bar").val(localStorage.getItem(`${currentMenu}_search`));
    insertParam("search", $("#search-bar").val());
    changeTableStyle();
    const loadin_bar = $(".loading_bar:first")
    var maingrid = $(".maingrid");
    for (let i = 1; i <= 10; i++) {
        threadLoadingBars().next();

    }
    await wait(1500);
    fetchNreload();
})();
