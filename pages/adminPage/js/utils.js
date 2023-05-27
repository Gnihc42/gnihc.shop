const insertParam = function(key, value) {

    var url = new URL(window.location.href);
    url.searchParams.set(key, value);
    console.log(url.href);
    // reload page with new params
    window.history.pushState({"html":$('html').html(),"pageTitle":$(document).find("title").text()},"", url.href);
}