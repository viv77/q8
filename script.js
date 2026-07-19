/*
====================================================
Q8
script.js
Version 5.1
====================================================
*/

const APP_VERSION = "5.1";

const WORKER_URL =
"https://q8-service.vivek-thakar-nsk.workers.dev";

/*-----------------------------------------------
Generate Visitor ID (stored permanently)
-----------------------------------------------*/

function getVisitorId() {

    let visitorId = localStorage.getItem("q8_visitor_id");

    if (!visitorId) {

        visitorId =
            "LOTUS-" +
            Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase();

        localStorage.setItem(
            "q8_visitor_id",
            visitorId
        );

    }

    return visitorId;

}

/*-----------------------------------------------
Generate Session ID (new every visit)
-----------------------------------------------*/

function getSessionId() {

    return (
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()
    );

}

/*-----------------------------------------------
Detect Device
-----------------------------------------------*/

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

/*-----------------------------------------------
Current Page
-----------------------------------------------*/

function getPageName() {

    const page = window.location.pathname;

    if (
        page === "/" ||
        page.endsWith("index.html")
    ) {

        return "index";

    }

    return page.split("/").pop();

}

/*-----------------------------------------------
Send Log
-----------------------------------------------*/

async function logVisit() {

    const payload = {

        visitor_id: getVisitorId(),

        session_id: getSessionId(),

        page: getPageName(),

        device_type: getDeviceType(),

        app_version: APP_VERSION

    };

    try {

        const response =
            await fetch(
                WORKER_URL + "/api/v1/log",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                        "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );

        if (!response.ok) {

            console.log(
                "Q8 Log failed."
            );

            return;

        }

        const result =
            await response.json();

        console.log(
            "Q8 Logged:",
            result
        );

    }

    catch (err) {

        console.log(
            "Q8 Worker unavailable."
        );

    }

}

/*-----------------------------------------------
Start
-----------------------------------------------*/

window.addEventListener(
    "load",
    function () {

        logVisit();

    }
);
