/*
====================================================
Q8 script.js
Version 5.5
Original behaviour preserved
Added: Visitor logging only
Improved: Fresh typing on every tap
====================================================
*/

const input = document.getElementById("pw");
const out = document.getElementById("content");

/* ---------- Logging ---------- */

const WORKER_URL =
"https://q8-service.vivek-thakar-nsk.workers.dev";

const APP_VERSION = "5.5";

function visitorId() {

    let id = localStorage.getItem("q8_visitor_id");

    if (!id) {

        id =
            "LOTUS-" +
            Math.random()
            .toString(36)
            .substring(2,10)
            .toUpperCase();

        localStorage.setItem(
            "q8_visitor_id",
            id
        );

    }

    return id;

}

function sessionId() {

    return (
        Date.now().toString(36) +
        Math.random()
        .toString(36)
        .substring(2,8)
        .toUpperCase()
    );

}

function deviceType() {

    const ua =
        navigator.userAgent.toLowerCase();

    if(
        ua.includes("android") ||
        ua.includes("iphone") ||
        ua.includes("ipad") ||
        ua.includes("mobile")
    )
        return "Mobile";

    return "Desktop";

}

async function logVisit() {

    try {

        await fetch(
            WORKER_URL + "/api/v1/log",
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    visitor_id:visitorId(),

                    session_id:sessionId(),

                    page:"index",

                    device_type:deviceType(),

                    app_version:APP_VERSION

                })

            }
        );

    }

    catch(e){}

}

/* ---------- Original code ---------- */

function a(){

    input.value = "";

    input.focus({
        preventScroll:true
    });

}

window.addEventListener("load",()=>{

    document.title="";

    setTimeout(a,120);

    logVisit();

});

document.body.addEventListener(
    "click",
    a
);

document.body.addEventListener(
    "touchstart",
    a,
    {passive:true}
);

input.addEventListener(
    "input",
    async()=>{

        let v =
            input.value.toUpperCase();

        input.value =
            v.slice(-3);

        v = input.value;

        for(const p of CONFIG.passwords){

            if(
                v ===
                p.toUpperCase()
            ){

                const h =
                    await fetch(
                        CONFIG.contentFile
                    ).then(
                        r=>r.text()
                    );

                out.innerHTML=h;

                out.classList.remove(
                    "hidden"
                );

                requestAnimationFrame(
                    ()=>out.classList.add(
                        "show"
                    )
                );

                input.blur();

                return;

            }

        }

    }
);
