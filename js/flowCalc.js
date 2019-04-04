/**
    * hideFlow() - hides the input for flow and hides the submit button
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
    * Calculates the input after the submit button has been clicked
    *
    * @param {submit} click
    * @returns {void}
    */
// document.getElementById("submit").addEventListener("click", () => {
//     let diameter = document.getElementById("length").value;
//     let length = document.getElementById("length").value;
//     let height = document.getElementById("height").value;
//     //let dimension = document.getElementById("dimension").value;
//     let flow = document.getElementById("flow").value;
// });

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
    * PEMPipe() - creates the dimensions for the PEM material
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
    * PEPipe() - creates the dimensions for the PE material
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
    * stainlessPipe() - creates the dimensions for the stainless material
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
    * showStyling() - displays the input boxes
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
    * hideStyling() - hides the input boxes
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
    document.getElementById("flowLabel").style.display = "none";
    document.getElementById("flow").style.display = "none";
    document.getElementById("submit").style.display = "none";
    document.getElementById("flowLabel").innerHTML = "";
    document.getElementById("flow").nextSibling.innerHTML = "";
}
