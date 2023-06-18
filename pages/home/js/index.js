const insertParam = function (key, value) {

    var url = new URL(window.location.href);
    url.searchParams.set(key, value);

    // reload page with new params
    window.history.pushState({ "html": $('html').html(), "pageTitle": $(document).find("title").text() }, "", url.href);
}
async function ReloadTinTuc(ele) {
    
    const chudeid = !!ele && !!ele.attr("chudeid") ? ele.attr("chudeid") : "";
    const response = await fetch(`http://127.0.0.1:3000/adminPage/data?table=tintuc&search=${chudeid}`);
    TempData = await response.json();
    $("#tintuc_grid").empty();
    for (tintuc of TempData){
        
        var clone = $("#tintucplaceholder").clone();
        clone.removeAttr("id");
        clone.css("display", "block")
        clone.removeClass("placeholder");

        clone.addClass("tintuc");
    ;

        clone.appendTo('#tintuc_grid');
        clone.css("background-image",`url('${tintuc.anh}')`)
        
        clone.find("span").text(tintuc.tieude);
       console.log(clone);
    }
}

function chudeclick(e) {
    var query = $('.chudeitem').not(e.target);
    const item = $(e.target);

    query.removeClass("item_selected");
    item.toggleClass("item_selected");


    if (!item.hasClass("item_selected")) {

        $(".chudeitem[default]").addClass("item_selected");
    }
    const chude = $(".item_selected").text().trim();

    ReloadTinTuc($(".item_selected"));
    insertParam("chude", chude);

}
async function ReloadChuDe() {
    const response = await fetch("http://127.0.0.1:3000/adminPage/data?table=chude");
    TempData = await response.json();
    console.log(TempData);
    for (chude of TempData) {
        console.log(chude);
        var clone = $("#chudeplaceholder").clone();
        clone.removeAttr("id");
        clone.css("display", "block")
        clone.appendTo('#chudelist');
        clone.addClass("chudeitem");
        clone.text(chude.tencd);
        var hrElement = $('<hr>').css('width', '100%');
        clone.append(hrElement);
        clone.attr("chudeid",chude.id);
        clone.on("click", function (e) {
            chudeclick(e);
        })
    }

}
ReloadChuDe();

$('.chudeitem').on("click", function (e) {
    chudeclick(e);
});
ReloadTinTuc();