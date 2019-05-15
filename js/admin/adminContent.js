/*global configuration API */

"use strict";

const adminContent = document.getElementById("adminContent");
const navLinks = document.getElementsByClassName('nav-link');
const token = localStorage.getItem("token");

/**
* createElement - Function to quickly create elements with id and class attributes
* @param {string} idAttribute id for the element
* @param {string} classAttribute class for the element
* @return {element} Returns html element
*/
const createElement = (type, idAttribute = "", classAttribute = "") => {
    let newElement = document.createElement(type);

    if (idAttribute != "") {
        newElement.id = idAttribute;
    }
    if (classAttribute != "") {
        newElement.className = classAttribute;
    }
    return newElement;
};

/**
* appendElementToApp - Function to append new elements to either default or custom element.
* @param {element} elementToAppend - Element that gets apended
* @param {element} appendTo - element where the new elements will be appended to.
* Has a default value of adminContent.
*/
const appendElementToApp = (elementToAppend, appendTo = adminContent) => {
    appendTo.appendChild(elementToAppend);
};

/**
* displayInstructions - Default screen on the admin page and it displays information
* about the different menu options
*/
const displayInstructions = () => {
    // TODO: Add default info here
    console.log("info");
};

/**
* showGlobalProductRequests- Displays the list of products awaiting global requests
*/
const showGlobalProductRequests = async () => {
    let pendingRequests = await API.get(configuration.apiURL +
        "/admin/obj/approve?token=" + token);
    let allGlobalItems = await API.get(configuration.apiURL +
        "/admin/obj/all?token=" + token);

    let mainContent = createElement("div", "main", "main-content");

    // Clear content element before we start appending new content
    adminContent.innerHTML = "";

    if (pendingRequests.error == true) {
        //TODO: display connection error here
        console.log("error!");
        console.log(pendingRequests.error);
    }

    let requestedTitle = createElement("h2", "", "slim-title");

    requestedTitle.innerText = "Förfrågningar för globala produkter";
    appendElementToApp(requestedTitle, mainContent);

    if (pendingRequests.length == 0) {
        let message = createElement("div", "msg", "message");

        message.innerText = "Inga förfrågningar väntar på utvärdering";
        appendElementToApp(message, mainContent);
        appendElementToApp(mainContent);
    }

    //Just to be sure we don't get hit by an edgecase
    if (pendingRequests.length > 0) {
        for (var i = 0; i < pendingRequests.length; i++) {
            let pending = createElement("div", "", "pending-items");
            let image = createElement("img", "", "item-image");
            let wrapText = createElement("div", "", "item-text-wrap");
            let title = createElement("h4", "", "item-title");
            let category = createElement("h6", "", "item-category");
            let approve = createElement("a", "", "small-link item-approve");
            let deny = createElement("a", "", "small-link item-deny");

            image.src = pendingRequests[i].Bild;
            image.height = 50;
            title.innerText = pendingRequests[i].Modell;
            category.innerText = pendingRequests[i].Kategori;
            approve.innerText = "Godkänn";
            let tmpId = pendingRequests[i]._id;

            approve.addEventListener("click", async (event, id=tmpId) => {
                await API.post(configuration.apiURL +
                    "/admin/obj/approve/" +
                     id +
                    "/1?token=" +
                    token);
                showGlobalProductRequests();
            });
            deny.innerText = "Neka";
            deny.addEventListener("click", async (event, id=tmpId) => {
                await API.post(configuration.apiURL +
                    "/admin/obj/approve/" +
                    id +
                    "/0?token=" +
                    token);
                showGlobalProductRequests();
            });

            appendElementToApp(title, wrapText);
            appendElementToApp(category, wrapText);
            appendElementToApp(image, pending);
            appendElementToApp(wrapText, pending);
            appendElementToApp(approve, pending);
            appendElementToApp(deny, pending);
            appendElementToApp(pending, mainContent);
        }
        appendElementToApp(mainContent);
    }

    // If we have more than 0 global products, sort them into active and inactive
    // lists, then add them to the DOM.
    if (allGlobalItems.length > 0) {
        let activeProducts = [];
        let inactiveProducts = [];

        for (i = 0; i < allGlobalItems.length; i++) {
            if (allGlobalItems[i].isDisabled == 0 || allGlobalItems[i].isDisabled == undefined) {
                // Product is active
                activeProducts.push(allGlobalItems[i]);
            } else {
                //Product is NOT active
                inactiveProducts.push(allGlobalItems[i]);
            }
        }

        //Create a title for active global products
        let objTitle = createElement("h2", "", "slim-title");

        objTitle.innerText = "Aktiva globala produkter";
        appendElementToApp(objTitle, mainContent);
        // If we have active global products, show them
        if (activeProducts.length > 0) {
            for (i = 0; i < activeProducts.length; i++) {
                let tmpId = activeProducts[i]._id;
                let tmpObj = createElement("div", "", "pending-items");
                let tmpImage = createElement("img", "", "item-image");
                let tmpName = createElement("div", "", "item-name");
                let tmpCategory = createElement("div", "", "item-category");
                let tmpDisable = createElement("a", "", "small-link item-disable");

                tmpImage.src = activeProducts[i].Bild;
                tmpImage.height = 50;
                tmpName.innerText = activeProducts[i].Modell;
                tmpCategory.innerText = activeProducts[i].Kategori;
                tmpDisable.innerText = "Inaktivera produkt";
                tmpDisable.addEventListener("click", async (event, id=tmpId) => {
                    await API.post(configuration.apiURL +
                        "/admin/obj/disable/" +
                         id +
                        "/1?token=" +
                        token, "application/x-www-form-urlencoded");
                    showGlobalProductRequests();
                });

                appendElementToApp(tmpImage, tmpObj);
                appendElementToApp(tmpName, tmpObj);
                appendElementToApp(tmpCategory, tmpObj);
                appendElementToApp(tmpDisable, tmpObj);
                appendElementToApp(tmpObj, mainContent);
            }
        } else {
            //No products are active
            let noProducts = createElement("div", "msg", "message");

            noProducts.innerText = "Inga aktiva globala produkter";
            appendElementToApp(noProducts, mainContent);
        }

        //Create a title for active global products
        let inactiveTitle = createElement("h2", "", "slim-title");

        inactiveTitle.innerText = "Inaktiva globala produkter";
        appendElementToApp(inactiveTitle, mainContent);
        // If we have inactive global products, show them
        if (inactiveProducts.length > 0) {
            for (i = 0; i < inactiveProducts.length; i++) {
                let tmpId = inactiveProducts[i]._id;
                let tmpObj = createElement("div", "", "pending-items");
                let tmpImage = createElement("img", "", "item-image");
                let tmpName = createElement("div", "", "item-name");
                let tmpCategory = createElement("div", "", "item-category");
                let tmpEnable = createElement("a", "", "small-link item-disable");
                let tmpDelete = createElement("a", "", "small-link item-disable");

                tmpImage.src = inactiveProducts[i].Bild;
                tmpImage.height = 50;
                tmpName.innerText = inactiveProducts[i].Modell;
                tmpCategory.innerText = inactiveProducts[i].Kategori;
                tmpEnable.innerText = "Aktivera produkt";
                tmpEnable.addEventListener("click", async (event, id=tmpId) => {
                    await API.post(configuration.apiURL +
                        "/admin/obj/disable/" +
                         id +
                        "/0?token=" +
                        token, "application/x-www-form-urlencoded");
                    showGlobalProductRequests();
                });
                tmpDelete.innerText = "Radera permanent";
                tmpDelete.addEventListener("click", async (event, id=tmpId) => {
                    await API.post(configuration.apiURL +
                        "/admin/obj/delete/" +
                         id +
                        "/?token=" +
                        token, "application/x-www-form-urlencoded");
                    showGlobalProductRequests();
                });

                appendElementToApp(tmpImage, tmpObj);
                appendElementToApp(tmpName, tmpObj);
                appendElementToApp(tmpCategory, tmpObj);
                appendElementToApp(tmpEnable, tmpObj);
                appendElementToApp(tmpDelete, tmpObj);
                appendElementToApp(tmpObj, mainContent);
            }
        } else {
            //No products are active
            let noProducts = createElement("div", "msg", "message");

            noProducts.innerText = "Inga aktiva globala produkter";
            appendElementToApp(noProducts, mainContent);
        }
    }
};

/**
* navSelector - handles what happens when an element is clicked and what should be displayed
* @param {element} tabElement the html DOM element of the link clicked
*/
const navSelector = (tabElement) => {
    // Remove all other selected tags from navbar
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove("admin-active");
    }
    // Highlight selected button
    tabElement.target.classList.add("admin-active");

    switch (tabElement.target.name) {
        case "global":
            showGlobalProductRequests();
            break;
        case "projects":
            console.log("Alla projekt");
            break;
        case "new-user":
            console.log("Ny Användare");
            break;
        case "default":
        default:
            displayInstructions();
            break;
    }
};

// Create clickable nav links
for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", (e) => {
        navSelector(e);
    });
}

navSelector({target: {name: "default", classList: {add: () => {}}}});
