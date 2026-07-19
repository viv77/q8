/*
====================================================
Q8
script.js
Version 5.2
====================================================
*/

const WORKER_URL =
  "https://q8-service.vivek-thakar-nsk.workers.dev";

const APP_VERSION = "5.2";

const input = document.getElementById("pw");
const out = document.getElementById("content");

/*--------------------------------------------------
Focus hidden password box
--------------------------------------------------*/

function focusInput() {
    input.focus({ preventScroll: true });
}

/*--------------------------------------------------
Visitor ID
--------------------------------------------------*/

function getVisitorId() {

    let id = localStorage.getItem("q8_visitor_id");

    if (!id) {

        if (window.crypto && crypto.randomUUID) {

            id = "LOTUS-" + crypto.randomUUID();

        } else {

            id =
                "LOTUS-" +
                Date.now().toString(36) +
                "-" +
                Math.random().toString(36).substring(2, 8);

        }

        localStorage.setItem("q8_visitor_id", id);

    }

    return id;

}

/*--------------------------------------------------
Session ID
--------------------------------------------------*/

function getSessionId() {

    if (window.crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return (
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).substring(2, 8)
    );

}

/*--------------------------------------------------
Device
--------------------------------------------------*/

function getDeviceType() {

    const ua = navigator.userAgent.toLowerCase();

    if (
        ua.includes("android") ||
        ua.includes("iphone") ||
        ua.includes("ipad") ||
        ua.includes("mobile")
    ) {
        return "Mobile";
    }

    return "Desktop";

}

/*--------------------------------------------------
Log Visit
--------------------------------------------------*/

async function logVisit() {

    try {

        await fetch(
            WORKER_URL + "/api/v1/log",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    visitor_id: getVisitorId(),

                    session_id: getSessionId(),

                    page: "index",

                    device_type: getDeviceType(),

                    app_version: APP_VERSION

                })

            }
        );

    }

    catch (err) {

        console.log("Q8 logging skipped.");

    }

}

/*--------------------------------------------------
Startup
--------------------------------------------------*/

window.addEventListener("load", () => {

    document.title = "";

    setTimeout(focusInput, 120);

    logVisit();

});

document.body.addEventListener("click", focusInput);

document.body.addEventListener(
    "touchstart",
    focusInput,
    { passive: true }
);

/*--------------------------------------------------
Password Handling
--------------------------------------------------*/

input.addEventListener("input", async () => {

    let value = input.value.toUpperCase();

    input.value = value.slice(-12);

    for (const password of CONFIG.passwords) {

        if (
            value.endsWith(password.toUpperCase())
        ) {

            const html =
                await fetch(CONFIG.contentFile)
                .then(r => r.text());

            out.innerHTML = html;

            out.classList.remove("hidden");

            requestAnimationFrame(() =>
                out.classList.add("show")
            );

            input.blur();

            return;

        }

    }

});
