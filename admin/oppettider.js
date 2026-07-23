/*
========================================
CONTAINER 13 – ÖPPETTIDER
========================================

Ordinarie öppettider:

Måndag–Onsdag: Stängt
Torsdag–Fredag: 12.00–17.00
Lördag–Söndag: 11.00–16.00

Skriv null som öppnings- och stängningstid
för dagar då butiken är stängd.
*/


const oppettider = [

    {
        dag: "Söndag",
        oppnar: "11:00",
        stanger: "16:00"
    },

    {
        dag: "Måndag",
        oppnar: null,
        stanger: null
    },

    {
        dag: "Tisdag",
        oppnar: null,
        stanger: null
    },

    {
        dag: "Onsdag",
        oppnar: null,
        stanger: null
    },

    {
        dag: "Torsdag",
        oppnar: "12:00",
        stanger: "17:00"
    },

    {
        dag: "Fredag",
        oppnar: "12:00",
        stanger: "17:00"
    },

    {
        dag: "Lördag",
        oppnar: "11:00",
        stanger: "16:00"
    }

];


/*
Valfritt extra meddelande i statusraden.

Exempel:

const statusmeddelande =
    "Nya möbler har kommit in!";

Lämna tomt när inget extra meddelande
ska visas.
*/

const statusmeddelande = "";



/* ======================================== */
/* TIDSHJÄLP                                */
/* ======================================== */


function tidTillMinuter(tid) {

    if (!tid) {
        return null;
    }

    const delar = tid.split(":");

    const timmar = Number(delar[0]);

    const minuter = Number(delar[1]);

    return timmar * 60 + minuter;
}


function visaTid(tid) {

    if (!tid) {
        return "";
    }

    return tid.replace(":", ".");
}


function hamtaSvenskTid() {

    const delar =
        new Intl.DateTimeFormat(
            "sv-SE",
            {
                timeZone: "Europe/Stockholm",

                weekday: "long",

                hour: "2-digit",

                minute: "2-digit",

                hour12: false
            }
        ).formatToParts(new Date());


    const veckodag = delar.find(
        del => del.type === "weekday"
    )?.value;


    const timme = Number(
        delar.find(
            del => del.type === "hour"
        )?.value
    );


    const minut = Number(
        delar.find(
            del => del.type === "minute"
        )?.value
    );


    const dagar = [

        "Söndag",

        "Måndag",

        "Tisdag",

        "Onsdag",

        "Torsdag",

        "Fredag",

        "Lördag"

    ];


    const dagIndex = dagar.findIndex(

        dag =>
            dag.toLowerCase() ===
            veckodag.toLowerCase()

    );


    return {

        dagIndex: dagIndex,

        minuter:
            timme * 60 + minut

    };
}



/* ======================================== */
/* ÖPPETTIDER PÅ KONTAKTSIDAN               */
/* ======================================== */


function visaOppettider() {

    const behallare =
        document.getElementById(
            "oppettider"
        );


    if (!behallare) {
        return;
    }


    behallare.innerHTML = "";


    /*
    Listan visas från måndag till söndag,
    även om JavaScript internt räknar
    söndag som dag 0.
    */

    const visningsordning = [

        oppettider[1],

        oppettider[2],

        oppettider[3],

        oppettider[4],

        oppettider[5],

        oppettider[6],

        oppettider[0]

    ];


    visningsordning.forEach(

        post => {

            const rad =
                document.createElement(
                    "div"
                );


            rad.className =
                "oppettid-rad";


            const dag =
                document.createElement(
                    "span"
                );


            dag.className =
                "oppettid-dag";


            dag.textContent =
                post.dag;


            const tid =
                document.createElement(
                    "span"
                );


            tid.className =
                "oppettid-tid";


            if (
                post.oppnar &&
                post.stanger
            ) {

                tid.textContent =
                    visaTid(post.oppnar) +
                    "–" +
                    visaTid(post.stanger);

            } else {

                tid.textContent =
                    "Stängt";

            }


            rad.appendChild(dag);

            rad.appendChild(tid);

            behallare.appendChild(rad);

        }

    );

}



/* ======================================== */
/* HITTA NÄSTA ÖPPNA TID                    */
/* ======================================== */


function hamtaNastaOppning(

    aktuellDagIndex,

    aktuellaMinuter

) {

    const idag =
        oppettider[aktuellDagIndex];


    /*
    Om butiken öppnar senare idag
    returneras dagens öppningstid.
    */

    if (
        idag.oppnar &&
        aktuellaMinuter <
            tidTillMinuter(idag.oppnar)
    ) {

        return {

            dag: idag.dag,

            oppnar: idag.oppnar,

            stanger: idag.stanger,

            idag: true

        };

    }


    /*
    Sök framåt efter nästa öppna dag.
    */

    for (
        let steg = 1;
        steg <= 7;
        steg++
    ) {

        const index =

            (aktuellDagIndex + steg) % 7;


        const dag =
            oppettider[index];


        if (
            dag.oppnar &&
            dag.stanger
        ) {

            return {

                dag: dag.dag,

                oppnar: dag.oppnar,

                stanger: dag.stanger,

                idag: false

            };

        }

    }


    return null;
}



/* ======================================== */
/* STATUSRAD UNDER MENYN                    */
/* ======================================== */


function skapaStatusrad() {

    const nav =
        document.querySelector("nav");


    if (!nav) {
        return;
    }


    if (
        document.querySelector(
            ".oppet-status"
        )
    ) {
        return;
    }


    const svenskTid =
        hamtaSvenskTid();


    const dagIndex =
        svenskTid.dagIndex;


    const aktuellaMinuter =
        svenskTid.minuter;


    if (dagIndex < 0) {
        return;
    }


    const idag =
        oppettider[dagIndex];


    const oppnar =
        tidTillMinuter(
            idag.oppnar
        );


    const stanger =
        tidTillMinuter(
            idag.stanger
        );


    const arOppen =

        oppnar !== null &&

        stanger !== null &&

        aktuellaMinuter >= oppnar &&

        aktuellaMinuter < stanger;


    let text = "";


    if (arOppen) {

        text =

            "Öppet idag till " +

            visaTid(idag.stanger);

    } else {

        const nastaOppning =

            hamtaNastaOppning(

                dagIndex,

                aktuellaMinuter

            );


        if (
            nastaOppning &&
            nastaOppning.idag
        ) {

            text =

                "Stängt just nu – öppnar idag " +

                visaTid(
                    nastaOppning.oppnar
                );

        } else if (nastaOppning) {

            text =

                "Stängt just nu – öppnar " +

                nastaOppning.dag.toLowerCase() +

                " " +

                visaTid(
                    nastaOppning.oppnar
                );

        } else {

            text =
                "Stängt just nu";

        }

    }


    if (
        statusmeddelande.trim() !== ""
    ) {

        text +=

            " • " +

            statusmeddelande.trim();

    }


    const statusrad =

        document.createElement(
            "div"
        );


    statusrad.className =

        "oppet-status " +

        (
            arOppen
                ? "ar-oppen"
                : "ar-stangd"
        );


    statusrad.setAttribute(

        "role",

        "status"

    );


    statusrad.setAttribute(

        "aria-live",

        "polite"

    );


    const innehall =

        document.createElement(
            "div"
        );


    innehall.className =

        "oppet-status-innehall";


    const prick =

        document.createElement(
            "span"
        );


    prick.className =

        "oppet-status-prick";


    prick.setAttribute(

        "aria-hidden",

        "true"

    );


    const statusText =

        document.createElement(
            "span"
        );


    statusText.className =

        "oppet-status-text";


    statusText.textContent =
        text;


    innehall.appendChild(prick);

    innehall.appendChild(
        statusText
    );


    statusrad.appendChild(
        innehall
    );


    nav.insertAdjacentElement(

        "afterend",

        statusrad

    );

}



/* ======================================== */
/* STARTA FUNKTIONERNA                      */
/* ======================================== */


document.addEventListener(

    "DOMContentLoaded",

    function () {

        visaOppettider();

        skapaStatusrad();

    }

);