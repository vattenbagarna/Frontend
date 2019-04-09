/**
    * hideFlow - Hides the input for flow and hides the submit button
    *
    * @returns {void}
    */
function hideFlow() {
    let showFlow = document.getElementById("flow");
    let showSubmit = document.getElementById("submit");

    showSubmit.style.display = "none";
    showFlow.style.display = "none";
}
hideFlow();

/**
    * Displays the outer dimension for the different materials after the outerdimension
    * button has been selected
    *
    * @param {outerdimension} click
    * @returns {void}
    */
document.getElementById("outerdimension").addEventListener("click", () => {
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
    showStyling();
});

/**
    * Displays the inner dimension for the different materials after the innerdimension
    * button has been selected
    *
    * @param {innerdimension} click
    * @returns {void}
    */
document.getElementById("innerdimension").addEventListener("click", () => {
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
    showStyling();
});

/**
    * Displays the dimension in inches for the stainless pipes after the inches
    * button has been selected
    *
    * @param {inches} click
    * @returns {void}
    */
document.getElementById("inches").addEventListener("click", () => {
    if (document.getElementById("material").value === "stainless") {
        stainlessPipe();
        document.getElementById("selectDim").style.display = "block";
    }
    showStyling();
});

/**
    * Displays the associated dimension for the material after the material
    * button has been changed
    *
    * @param {material} change
    * @returns {void}
    */
document.getElementById("material").addEventListener("change", () => {
    if (document.getElementById("material").value === "stainless") {
        document.getElementById("inches").style.display = "block";
        document.getElementById("inches").nextSibling.innerHTML = "Tum";
    }
    if (document.getElementById("material").value === "PEM" ||
        document.getElementById("material").value === "PE") {
        document.getElementById("inches").style.display = "none";
        document.getElementById("inches").nextSibling.innerHTML = "";
    }
    hideStyling();
});

/**
    * PEMPipe - Creates the dimensions for the PEM material
    *
    * @returns {void}
    */
function PEMPipe() {
    let outerDimPEM = ["40 mm", "50 mm", "60 mm"];
    let innerDimPEM = ["35.2 mm", "44 mm", "55.4 mm"];
    let select = document.getElementById("selectDim");

    for (let i = select.childNodes.length - 1; i >= 0; i--) {
        select.removeChild(select.childNodes[i]);
    }

    if (document.getElementById("outerdimension").checked) {
        for (let i = 0; i < select.childNodes.length; i++) {
            select.removeChild(select.childNodes[0]);
        }
        for (let i = 0; i < outerDimPEM.length; i++) {
            let option = document.createElement("option");

            option.innerHTML = outerDimPEM[i];
            select.appendChild(option);
        }
    }
    if (document.getElementById("innerdimension").checked) {
        for (let i = 0; i < innerDimPEM.length; i++) {
            let option = document.createElement("option");

            option.innerHTML = innerDimPEM[i];
            select.appendChild(option);
        }
    }
}

/**
    * PEPipe - Creates the dimensions for the PE material
    *
    * @returns {void}
    */
function PEPipe() {
    let outerDimPE = ["110 mm", "160 mm", "180 mm", "200 mm", "225 mm", "250 mm",
        "315 mm", "400 mm", "450 mm", "500 mm"];
    let innerDimPE = ["96.8 mm", "141 mm", "158.6 mm", "176.2 mm", "198.2 mm",
        "220.4 mm", "277.6 mm", "352.6 mm", "396.6 mm", "440.6 mm"];
    let select = document.getElementById("selectDim");

    for (let i = select.childNodes.length - 1; i >= 0; i--) {
        select.removeChild(select.childNodes[i]);
    }

    if (document.getElementById("outerdimension").checked) {
        for (let i = 0; i < outerDimPE.length; i++) {
            let option = document.createElement("option");

            option.innerHTML = outerDimPE[i];
            select.appendChild(option);
        }
    }
    if (document.getElementById("innerdimension").checked) {
        for (let i = 0; i < innerDimPE.length; i++) {
            let option = document.createElement("option");

            option.innerHTML = innerDimPE[i];
            select.appendChild(option);
        }
    }
}

/**
    * stainlessPipe - Creates the dimensions for the stainless material
    *
    * @returns {void}
    */
function stainlessPipe() {
    let inches = ['1.25 "', '1.5 "', '2 "', '2.5 "'];
    let outerDimStain = ["42.4 mm", "48.3 mm", "60.3 mm", "76.1 mm"];
    let innerDimStain = ["38.4 mm", "44.3 mm", "56.3 mm", "72.1 mm", "80 mm", "100 mm", "150 mm"];
    let select = document.getElementById("selectDim");

    for (let i = select.childNodes.length - 1; i >= 0; i--) {
        select.removeChild(select.childNodes[i]);
    }

    if (document.getElementById("outerdimension").checked) {
        for (let i = 0; i < outerDimStain.length; i++) {
            let option = document.createElement("option");

            option.innerHTML = outerDimStain[i];
            select.appendChild(option);
        }
    }
    if (document.getElementById("innerdimension").checked) {
        for (let i = 0; i < innerDimStain.length; i++) {
            let option = document.createElement("option");

            option.innerHTML = innerDimStain[i];
            select.appendChild(option);
        }
    }
    if (document.getElementById("inches").checked) {
        for (let i = 0; i < inches.length; i++) {
            let option = document.createElement("option");

            option.innerHTML = inches[i];
            select.appendChild(option);
        }
    }
}

/**
    * showStyling - Displays the input boxes
    *
    * @returns {void}
    */
function showStyling() {
    document.getElementById("pressure1").style.display = "block";
    document.getElementById("pressure2").style.display = "block";
    document.getElementById("flow").style.display = "block";
    document.getElementById("submit").style.display = "block";
    document.getElementById("pressure1").nextSibling.innerHTML = "PN 6.3";
    document.getElementById("pressure2").nextSibling.innerHTML = "PN 10";
    document.getElementById("flowLabel").style.marginTop = "20px";
    document.getElementById("flowLabel").innerHTML = "Flödeskapacitet";
    document.getElementById("flow").style.marginRight = "10px";
    document.getElementById("flow").nextSibling.innerHTML = "l/s";
    document.getElementById("submit").nextSibling.innerHTML = "Punkförsluster";
}

/**
    * hideStyling - Hides the input boxes
    *
    * @returns {void}
    */
function hideStyling() {
    let select = document.getElementById("selectDim");

    select.style.display = "none";
    document.getElementById("innerdimension").style.display = "block";
    document.getElementById("outerdimension").style.display = "block";
    document.getElementById("innerdimension").nextSibling.innerHTML = "Innediameter";
    document.getElementById("outerdimension").nextSibling.innerHTML = "Ytterdiameter";
    document.getElementById("pressure1").style.display = "none";
    document.getElementById("pressure2").style.display = "none";
    document.getElementById("pressure1").nextSibling.innerHTML = "";
    document.getElementById("pressure2").nextSibling.innerHTML = "";
    document.getElementById("pressure1").checked = false;
    document.getElementById("pressure2").checked = false;
    document.getElementById("innerdimension").checked = false;
    document.getElementById("outerdimension").checked = false;
    document.getElementById("flow").style.display = "none";
    document.getElementById("submit").style.display = "none";
    document.getElementById("flowLabel").innerHTML = "";
    document.getElementById("flow").nextSibling.innerHTML = "";
}

/**
    * enterPressed - Do the calculations when enter is pressed
    *
    * @param {object} enter
    * @param {event} event
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
  let press1 = 6;
  let press2 = 4;
  //let h1 = 0;
  //let h2 = 0;
  let rho = 1000;
  let mu = 0.015;

  if (document.getElementById("inches").checked) {
      selectedDim = convertInches(selectedDim);
  }

  let lostP = Math.round(calcP(wantedFlow, selectedDim, mu, length));
  let rFlow = calcQPump(selectedDim, mu, length, press1, press2, height);
  let velocity = Math.round(calcV(wantedFlow, selectedDim));
  let convertFlow = rFlow.toFixed(2);
  let totalP = totalPressure(lostP, height);

  document.getElementById("flowSpeed").value = velocity;
  document.getElementById("pressureLoss").value = lostP;
  document.getElementById("capacity").value = convertFlow;
  document.getElementById("totalPressure").value = totalP;

}

/* ***************************** Math  Functions ************************************* */
/**
    * convertInches - Converts inches to mm
    *
    * @param {number} selectedDim
    * @returns {number} selectedDim
    */
function convertInches(selectedDim) {
  selectedDim = selectedDim * 25.4;

  return selectedDim;
}
/**
  * Calculate lost pressure.
  *
  * @param {number} Flowcapacity
  * @param {number} Innerdimension
  * @param {number} MU (friction)
  * @param {number} Pipelength
  *
  * @return {number} lost pressure
  *
  */
function calcP(q, di, mu, l) {
    let inDi = di; // mm
    let pLength = l; // m
    let avgQ = q/1000; // l/s
    let inMu = mu; // mm
    let rho = 1000; // kg/m3
    let viscosity = 1e-6; // m2/s

    let top = 2 * pLength * rho * avgQ * avgQ;
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
  * Calculate capacity for pump pipes
  *
  * @param {number} Innerdiameter
  * @param {number} MU
  * @param {number} Rörledningens längd
  * @param {number} Tryck vid inlopp
  * @param {number} Tryck vid utlopp
  * @param {number} Inloppshöjd
  * @param {number} Utloppshöjd
  *
  * @return {number} capacity
  *
  */
function calcQPump(di, mu, l, press1, press2, height) {
    let Di = di / 1000;
    let inMu = mu; // mm
    let length = l; // m
    //let height = h1 - h2;

    let viscosity = 1e-6; // m2/s
    let rho = 1000; // kg/m3

    let deltap = (press1 - press2 + 0.0981 * (height) * rho / 1000) * 100000;

    let top = -Math.PI / 2 * Math.pow(Di, 2.5);
    let top2 = Math.sqrt(2 * deltap / (length * rho));
    let inside = inMu / 1000 / (3.7 * Di);
    let rightInside = (Math.pow(Di, 1.5) * Math.sqrt(2 * deltap / (length * rho)));
    let avgQ = top * top2 * log10(inside + 2.51 * viscosity/ rightInside);

    return avgQ*1000;
}

/**
    * totalPressure - Calculates total pressure
    *
    * @param {number} lostP
    * @param {number} height
    * @returns {number} total
    */
function totalPressure(lostP, height) {
    let total = lostP + height;

    return total;
}

// /**
//   * Calculate diameter for pump pipes
//   *
//   * @param {number} Önskad flödeskapacitet
//   * @param {number} Innerdiameter
//   * @param {number} Råhetstal
//   * @param {number} Rörledningens längd
//   * @param {number} Tryck vid inlopp
//   * @param {number} Tryck vid utlopp
//   * @param {number} Inloppshöjd
//   * @param {number} Utloppshöjd
//   *
//   * @return {number} innerdiameter
//   *
//   */
// function calcDPump(q, di, mu, l, p1, p2, h1, h2) {
//     let avgQ = q/1000; // l/s
//     let inDi = di; // mm
//     let inMu = mu; // mm
//
//     let viscosity = 1e-6; // m2/s
//     let rho = 1000; // kg/m3
//
//     let height = h1 - h2;
//     let length = l; // m
//
//     let deltap;
//     let oldD = 1;
//     let newD;
//     let error;
//
//     let deltap = (p1 - p2 + 0.0981 * (height) * rho / 1000) * 100000;
//
//     for (let i = 0; i < 20; i++) {
//         let pow = -Math.pow(2, -2 / 5);
//         let smallmu = inMu / 1000 / (3.7 * oldD);
//         let lSqrt = Math.sqrt(2 * deltap * Math.pow(oldD, 5) / (length * rho));
//         let long10 = smallmu + 2.51 * oldD * viscosity / lSqrt;
//         let some = (deltap * Math.PI * log10(long10));
//         let inpow1 = length * rho * square(avgQ) * Math.pow(deltap, 4);
//         let inpow2 = Math.pow(-2 * Math.PI * log10(long10), 3);
//
//         newD = pow / some * Math.pow(inpow1 * inpow2, 1 / 5);
//
//         error = newD / oldD - 1;
//         oldD = newD;
//         if (Math.abs(error) < 1e-10) {
//             break;
//         }
//     }
//     inDi = newD * 1000;
//
//     return inDi;
// }

/**
  * Calculate capacity for gravity pipes
  *
  * @param {number} Innerdiameter
  * @param {number} Råhetstal
  * @param {number} Fall %o
  *
  * @return {number} capacity
  *
  */
function calcQGravity(di, mu, slope) {
    let Di = di / 1000;
    let inMu = mu; // mm
    let height = slope;
    let length = 1000;

    let viscosity = 1e-6; // m2/s
    let rho = 1000; // kg/m3

    let p1 = 0;
    let p2 = 0;

    let deltap = (p1 - p2 + 0.0981 * (height) * rho / 1000) * 100000;

    let top = -Math.PI / 2 * Math.pow(Di, 2.5);
    let top2 = Math.sqrt(2 * deltap / (length * rho));
    let inside = inMu / 1000 / (3.7 * Di);
    let rightInside = (Math.pow(Di, 1.5) * Math.sqrt(2 * deltap / (length * rho)));
    let avgQ = top * top2 * log10(inside + 2.51 * viscosity/ rightInside);

    return avgQ*1000;
}

/**
  * Calculate diameter for gravity pipes
  *
  * @param {number} Önskad flödeskapacitet
  * @param {number} Råhetstal
  * @param {number} Fall %o
  *
  * @return {number} innerdiameter
  *
  */
function calcDGravity(q, mu, slope) {
    let avgQ = q/1000; // l/s
    let height = slope;
    let inMu = mu;
    let length = 1000;

    let viscosity = 1e-6; // m2/s
    let rho = 1000; // kg/m3

    let deltap;
    let oldD = 1;
    let newD;
    let error;

    let p1 = 0;
    let p2 = 0;

    deltap = (p1 - p2 + 0.0981 * (height) * rho / 1000) * 100000;


    for (let i = 0; i < 20; i++) {
        let pow = -Math.pow(2, -2 / 5);
        let smallmu = inMu / 1000 / (3.7 * oldD);
        let lSqrt = Math.sqrt(2 * deltap * Math.pow(oldD, 5) / (length * rho));
        let long10 = smallmu + 2.51 * oldD * viscosity / lSqrt;
        let some = (deltap * Math.PI * log10(long10));
        let inpow1 = length * rho * square(avgQ) * Math.pow(deltap, 4);
        let inpow2 = Math.pow(-2 * Math.PI * log10(long10), 3);

        newD = pow / some * Math.pow(inpow1 * inpow2, 1 / 5);
        error = newD / oldD - 1;
        oldD = newD;
        if (Math.abs(error) < 1e-10) {
            break;
        }
    }
    let inDi = newD * 1000;

    return inDi;
}

/**
  * Calculate velocity
  *
  * @param {number} Önskad flödeskapacitet
  * @param {number} innerdiameter
  *
  * @return {number} velocity
  *
  */
function calcV(q, di) {
    q /= 1000; // l/s
    return 4 * 1000000 * q / (di * di * Math.PI);
}

/**
  * X squared
  *
  * @param {number} Value to square
  *
  * @return {number} result of value squared
  *
  */
function square(x) {
    return Math.pow(x, 2);
}

/**
  * X log10
  *
  * @param {number} Value to log10
  *
  * @return {number} result of value log10
  *
  */
function log10(x) {
    return Math.LOG10E * Math.log(x);
}
