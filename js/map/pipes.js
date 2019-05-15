// Changes material to the selected one
export let pipe = {
    listen: (elem) => {
        elem.addEventListener("change", () => {
            let data;

            pipe.clear();
            if (elem.value === "PEM") {
                data = pipe.PEM();
            } else if (elem.value === "PE") {
                data = pipe.PE();
            } else if (elem.value === "Rostfria") {
                data = pipe.stainless();
            }
            let newNode = document.createElement('div');

            newNode.innerHTML = "<label>Ytterdiameter</label>";
            newNode.id = "Ytterdiameter";

            let select = document.createElement('select');

            select.className = "dimension";
            let option;

            for (let i = 0; i < data.length; i++) {
                if (data[i].outerdim != null) {
                    option = document.createElement("option");
                    option.text = data[i].outerdim;
                    option.value = `${data[i].innerdim},${data[i].outerdim}`;

                    if (data[i].inches != null) {
                        option.text += ` (${data[i].inches} tum)`;
                    }
                    select.add(option);
                }
            }
            newNode.appendChild(select);
            let referenceNode = elem;

            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        });
        elem.value = "PEM";
        elem.dispatchEvent(new Event('change'));
    },

    /**
     * PEMPipe - Creates the dimensions for the PEM material
     *
     * @returns {void}
     */
    PEM: () => {
        return [{
            "innerdim": "35.2 mm",
            "outerdim": "40 mm"
        }, {
            "innerdim": "44 mm",
            "outerdim": "50 mm"
        }, {
            "innerdim": "55.4 mm",
            "outerdim": "63 mm"
        }, {
            "innerdim": "66 mm",
            "outerdim": "75 mm"
        }, {
            "innerdim": "79.2 mm",
            "outerdim": "90 mm"
        }];
    },

    /**
     * PEPipe - Creates the dimensions for the PE material
     *
     * @returns {void}
     */
    PE: () => {
        return [{
            "innerdim": "96.8 mm",
            "outerdim": "110 mm"
        }, {
            "innerdim": "141 mm",
            "outerdim": "160 mm"
        }, {
            "innerdim": "158.6 mm",
            "outerdim": "180 mm"
        }, {
            "innerdim": "176.2 mm",
            "outerdim": "200 mm"
        }, {
            "innerdim": "198.2 mm",
            "outerdim": "225 mm"
        }, {
            "innerdim": "220.4 mm",
            "outerdim": "250 mm"
        }, {
            "innerdim": "277.6 mm",
            "outerdim": "315 mm"
        }, {
            "innerdim": "352.6 mm",
            "outerdim": "400 mm"
        }, {
            "innerdim": "396.6 mm",
            "outerdim": "450 mm"
        }, {
            "innerdim": "440.6 mm",
            "outerdim": "500 mm"
        }];
    },

    /**
     * stainlessPipe - Creates the dimensions for the stainless material
     *
     * @returns {void}
     */
    stainless: () => {
        return [{
            "innerdim": "38.4 mm",
            "outerdim": "42.4 mm",
            "inches": '1.25 "'
        }, {
            "innerdim": "44.3 mm",
            "outerdim": "48.3 mm",
            "inches": '1.5 "'
        }, {
            "innerdim": "56.3 mm",
            "outerdim": "60.3 mm",
            "inches": '2 "'
        }, {
            "innerdim": "72.1 mm",
            "outerdim": "76.1 mm",
            "inches": '2.5 "'
        }, {
            "innerdim": "80 mm"
        }, {
            "innerdim": "100 mm"
        }, {
            "innerdim": "150 mm"
        }];
    },

    clear: () => {
        if (document.getElementById('Ytterdiameter')) {
            document.getElementById('Ytterdiameter').remove();
        }
    },
};
