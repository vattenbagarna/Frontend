/* eslint-disable no-unused-vars */
/* global configuration */

/**
    * showStyling - Displays the boxes
    *
    * @returns {void}
    */
function showStyling() {
    document.getElementById("pressure1").style.display = "block";
    document.getElementById("pressure2").style.display = "block";
    document.getElementById("flow").style.display = "block";
    document.getElementById("flow-wrap").style.display = "flex";
    document.getElementById("submit").style.display = "block";
    document.getElementById("pressure1").previousElementSibling.innerText = "PN 6.3";
    document.getElementById("pressure2").previousElementSibling.innerText = "PN 10";
}

/**
    * hideStyling - Hides the input boxes
    *
    * @returns {void}
    */
function hideStyling() {
    document.getElementById("pressure1").checked = false;
    document.getElementById("pressure2").checked = false;
    // document.getElementById("pumpLabel").innerText = "";
    // document.getElementById("pumps").style.display = "none";
}
hideStyling();

document.getElementById("material").addEventListener("change", () => {
    if (document.getElementById("material").value === "PEM") {
        PEMPipe();
        document.getElementById("selectDim").style.display = "block";
    }
    if (document.getElementById("material").value === "PE") {
        PEPipe();
        document.getElementById("selectDim").style.display = "block";
    }
    if (document.getElementById("material").value === "stainless") {
        stainlessPipe();
        document.getElementById("selectDim").style.display = "block";
    }
});
showStyling();

/**
    * PEMPipe - Creates the dimensions for the PEM material
    *
    * @returns {void}
    */
function PEMPipe() {
    let dimPEM = [{
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
    let select = document.getElementById("selectDim");

    for (let i = select.childNodes.length - 1; i >= 0; i--) {
        select.removeChild(select.childNodes[i]);
    }

    for (let i = 0; i < dimPEM.length; i++) {
        let option = document.createElement("option");

        option.text = dimPEM[i].outerdim;
        select.add(option);
    }

    // if (document.getElementById("outerdimension").checked) {
    //     for (let i = 0; i < dimPEM.length; i++) {
    //         let option = document.createElement("option");
    //
    //         option.text = dimPEM[i].outerdim;
    //         select.add(option);
    //     }
    // }
    // if (document.getElementById("innerdimension").checked) {
    //     for (let i = 0; i < dimPEM.length; i++) {
    //         let option = document.createElement("option");
    //
    //         option.text = dimPEM[i].innerdim;
    //         select.add(option);
    //     }
    // }
}

/**
    * PEPipe - Creates the dimensions for the PE material
    *
    * @returns {void}
    */
function PEPipe() {
    let dimPE = [{
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
    let select = document.getElementById("selectDim");

    for (let i = select.childNodes.length - 1; i >= 0; i--) {
        select.removeChild(select.childNodes[i]);
    }

    for (let i = 0; i < dimPE.length; i++) {
        let option = document.createElement("option");

        option.text = dimPE[i].outerdim;
        select.add(option);
    }
    // if (document.getElementById("outerdimension").checked) {
    //     for (let i = 0; i < dimPE.length; i++) {
    //         let option = document.createElement("option");
    //
    //         option.text = dimPE[i].outerdim;
    //         select.add(option);
    //     }
    // }
    // if (document.getElementById("innerdimension").checked) {
    //     for (let i = 0; i < dimPE.length; i++) {
    //         let option = document.createElement("option");
    //
    //         option.text = dimPE[i].innerdim;
    //         select.add(option);
    //     }
    // }
}

/**
    * stainlessPipe - Creates the dimensions for the stainless material
    *
    * @returns {void}
    */
function stainlessPipe() {
    let dimStainless = [{
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
    let select = document.getElementById("selectDim");

    for (let i = select.childNodes.length - 1; i >= 0; i--) {
        select.removeChild(select.childNodes[i]);
    }

    for (let i = 0; i < dimStainless.length; i++) {
        if (dimStainless[i].outerdim != undefined) {
            let option = document.createElement("option");

            option.text = dimStainless[i].outerdim;
            select.add(option);
        }
    }
    for (let i = 0; i < dimStainless.length; i++) {
        if (dimStainless[i].inches != undefined) {
            let option = document.createElement("option");

            option.text = dimStainless[i].inches;
            select.add(option);
        }
    }
    // if (document.getElementById("outerdimension").checked) {
    //     for (let i = 0; i < dimStainless.length; i++) {
    //         if (dimStainless[i].outerdim != undefined) {
    //             let option = document.createElement("option");
    //
    //             option.text = dimStainless[i].outerdim;
    //             select.add(option);
    //         }
    //     }
    // }
    // if (document.getElementById("innerdimension").checked) {
    //     for (let i = 0; i < dimStainless.length; i++) {
    //         let option = document.createElement("option");
    //
    //         option.text = dimStainless[i].innerdim;
    //         select.add(option);
    //     }
    // }
    // if (document.getElementById("inches").checked) {
    //     for (let i = 0; i < dimStainless.length; i++) {
    //         if (dimStainless[i].inches != undefined) {
    //             let option = document.createElement("option");
    //
    //             option.text = dimStainless[i].inches;
    //             select.add(option);
    //         }
    //     }
    // }
}

/**
    * enterPressed - Do the calculations when enter is pressed
    *
    * @param {key} enter
    * @param {event} event
    *
    * @returns {void}
    */
function enterPressed(enter, event) {
    if (event.keyCode == 13) {
        calcAll();
        enter.blur();
    }
}

/**
    * calcAll - Calculates everything
    *
    * @returns {void}
    */
function calcAll() {
    let height = parseFloat(document.getElementById("height").value);
    let length = parseFloat(document.getElementById("length").value);
    let selectedDim = parseFloat(document.getElementById("selectDim").value);
    let wantedFlow = parseFloat(document.getElementById("flow").value);
    let selectedUnit = document.getElementById("selectUnit").value;
    let mu = 0.015;

    selectedDim = changeDim(selectedDim);

    switch (selectedUnit) {
        case "lps":
            wantedFlow /= 1000;
            break;
        case "lpm":
            wantedFlow /= 1000*60;
            break;
        case "m3ph":
            wantedFlow /= 3600;
            break;
        default:
            break;
    }

    let lostPress = calcPressure(wantedFlow, selectedDim, mu, length);

    lostPress *= 9.81;
    let roundPress = lostPress.toFixed(2);
    //let rFlow = calcQPump(selectedDim, mu, length, height);
    //let roundFlow = rFlow.toFixed(2);
    let velocity = calcVelocity(wantedFlow, selectedDim);
    let roundVel = velocity.toFixed(2);
    let totalPress = totalPressure(lostPress, height);
    let roundTotal = totalPress.toFixed(2);

    document.getElementById("flowSpeed").innerText = roundVel;
    document.getElementById("staticPressure").innerText = height;
    document.getElementById("pressureLoss").innerText = roundPress;
    document.getElementById("totalPressure").innerText = roundTotal;
    //document.getElementById("capacity").innerText = roundFlow;

    resetPumps();
    getPumps(selectedDim);
}

/**
    * getPumps - Fetches all the pumps from the database
    *
    * @param {number} Dimension
    *
    * @returns {void}
    */
function getPumps(selectedDim) {
    fetch(configuration.apiURL + "/obj/type/Pump?token=" + localStorage.getItem("token"), {
        method: 'GET'
    })
        .then(function (response) {
            return response.json();
        }).then(function(json) {
            recommendPump(json, selectedDim);
        });
}

/**
    * recommendPump - Recommends pumps according to calculations
    *
    * @param {object} Pumps
    * @param {number} Dimension
    *
    * @returns {void}
    */
function recommendPump(pumps, dimension) {
    let wantedFlow = parseFloat(document.getElementById("flow").value);
    let inputHeight = parseFloat(document.getElementById("height").value);
    let select = document.getElementById("pumps");
    let margin = 0.5;

    for (let i = 0; i < pumps.length; i++) {
        for (let k = 0; k < pumps[i].Pumpkurva.length; k++) {
            if (pumps[i].Pumpkurva[k].y == inputHeight) {
                let mps = calcVelocity(pumps[i].Pumpkurva[k].x, dimension);

                if (mps >= wantedFlow - margin && mps <= wantedFlow + margin) {
                    let option = document.createElement("option");

                    option.text = pumps[i].Modell;
                    select.add(option);
                    break;
                }
            }
        }
    }

    //document.getElementById("pumpLabel").innerText = "Pumpförslag";
    //document.getElementById("pumps").style.display = "block";
}

/**
    * resetPumps - Resets the pump suggestions
    *
    * @returns {void}
    */
function resetPumps() {
    let select = document.getElementById("pumps");

    for (let i = select.childNodes.length - 1; i >= 0; i--) {
        select.removeChild(select.childNodes[i]);
    }
}

/**
    * changeDim - Changes the outer dimension to inner dimension
    *
    *  @param {number} Chosen dimension
    *
    * @returns {number}
    */
function changeDim(chosen) {
    chosen = "";

    if (document.getElementById("material").value == "PEM") {
        chosen += "P";
    } else if (document.getElementById("material").value == "PE") {
        chosen += "PE";
    } else {
        chosen += "L";
    }
    if (document.getElementById("material").value == "stainless") {
        chosen += "IN";
    } else {
        chosen += "O";
    }
    chosen += parseFloat(document.getElementById("selectDim").value);

    let innerdim =
        {
            "PO40": 35.2,
            "PO50": 44,
            "PO60": 55.4,
            "PEO110": 96.8,
            "PEO160": 141,
            "PEO180": 158.6,
            "PEO200": 176.2,
            "PEO225": 198.2,
            "PEO250": 220.4,
            "PEO315": 227.6,
            "PEO400": 352.6,
            "PEO450": 396.6,
            "PEO500": 440.6,
            "LO42.4": 38.4,
            "LIN1.25": 38.4,
            "LO48.3": 44.3,
            "LIN1.5": 44.3,
            "LO60.3": 56.3,
            "LIN2": 56.3,
            "LO76.1": 72.1,
            "LIN2.5": 72.1
        };

    return innerdim[chosen];
}

/************************ Math functions ************************************/

/**
  * calcPressure - Calculates lost pressure
  *
  * @param {number} Flowcapacity
  * @param {number} Innerdimension
  * @param {number} MU (friction)
  * @param {number} Pipelength
  *
  * @return {number} Lost pressure
  *
  */
function calcPressure(q, di, mu, l) {
    let inDi = di; // mm
    let pLength = l; // m
    let inMu = mu; // mm
    let rho = 1000; // kg/m3
    let viscosity = 1e-6; // m2/s

    let top = 2 * pLength * rho * q * q;
    let bot = (Math.PI * Math.PI * Math.pow(inDi / 1000, 5));
    let a =  top/bot;

    let b = inMu / (3.7 * inDi);

    top = 2.51 * viscosity;
    bot = (Math.sqrt(2 / (pLength * rho)) * Math.pow(inDi / 1000, 1.5));
    let c = top/bot;

    let oldP = 100000;
    let newP;
    let error;

    for (let i = 0; i < 20; i++) {
        newP = a / square(log10(b + c * Math.pow(oldP, -0.5)));
        error = newP / oldP - 1;
        oldP = newP;
        if (Math.abs(error) < 1e-10) {
            break;
        }
    }
    return newP / 100000;
}

/**
  * calcQPump - Calculates capacity for pump pipes
  *
  * @param {number} Innerdimension
  * @param {number} MU
  * @param {number} Pipelength
  * @param {number} Inpressure
  * @param {number} Height
  * @param {number} Outpressure
  *
  * @return {number} Capacity
  *
  */
function calcQPump(di, mu, l, height) {
    let dim = di / 1000;
    let inMu = mu; // mm
    let length = l; // m
    let viscosity = 1e-6; // m2/s
    let rho = 1000; // kg/m3

    let deltap = (0.0981 * (height) * rho / 1000) * 100000;

    let top = -Math.PI / 2 * Math.pow(dim, 2.5);
    let top2 = Math.sqrt(2 * deltap / (length * rho));
    let inside = inMu / 1000 / (3.7 * dim);
    let rightInside = (Math.pow(dim, 1.5) * Math.sqrt(2 * deltap / (length * rho)));
    let avgQ = top * top2 * log10(inside + 2.51 * viscosity/ rightInside);

    return avgQ*1000;
}

/**
    * totalPressure - Calculates total pressure
    *
    * @param {number} Lost pressure
    * @param {number} Height
    *
    * @returns {number} Total
    */
function totalPressure(lostPress, height) {
    let total = lostPress + height;

    return total;
}

/**
  * estPumpValue - Estimates the amount of fluid capacity a given pump can
  * give within a previosly unknown interval.
  *
  * @param {number} Y value
  * @param {number} The pumpcurve to calculate on
  *
  * @returns {number} X value
  */
function estPumpValue(yValue, pumpCurve) {
    let min1 = 100;
    let min2 = 100;

    for (let i = 0; i < pumpCurve.length; i++) {
        let temp = Math.abs(yValue - pumpCurve[i].Pumpkurva.y);

        if (temp < min1) {
            min1 = temp;
        } else if (temp < min2) {
            min2 = temp;
        }
    }
}

/**
  * calcVelocity - Calculates velocity
  *
  * @param {number} Wanted flow
  * @param {number} Innerdimension
  *
  * @return {number} Velocity
  *
  */
function calcVelocity(q, di) {
    return 4 * 1000000 * q / (di * di * Math.PI);
}

/**
  * square - Calculates X squared
  *
  * @param {number} Value to square
  *
  * @return {number} Result of value squared
  *
  */
function square(x) {
    return Math.pow(x, 2);
}

/**
  * log10 - Calculates X log10
  *
  * @param {number} Value to log10
  *
  * @return {number} Result of value log10
  *
  */
function log10(x) {
    return Math.LOG10E * Math.log(x);
}
