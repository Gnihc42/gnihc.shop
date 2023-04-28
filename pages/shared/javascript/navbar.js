async function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

var hasSession = getCookie("loginSession") == undefined; 
document.querySelector('a[href="/login"]').text = hasSession ? "Đăng Nhập" : "Tài Khoản";
    
waitForElm(".nav-bar").then((element) => {
    element.style = "";
    console.log('Element is ready');
    elements = element.children;
    const path = new URL(window.location.href).pathname;

    for (i of elements) {
        console.log(i);
        i.setAttribute("class", "");
        if (!i.href)continue;
        var pathname = new URL(i.href).pathname;
        var condiction2 = pathname == "/login" && (path == "/member" && !hasSession);
        if (i.href && pathname == path || condiction2) {
        
            i.setAttribute("class", "selected");
            return;
        }

    }
  
});
