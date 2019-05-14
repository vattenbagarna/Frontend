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

// General function to append an element to the root DOM element (appElement)
// elementToAppend is the element you wish to push
// AppendTo is target element, if none is specified it uses the root element
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
* showGlobalProductRequests- Displays the list of products awaiting global requests
*/
const showGlobalProductRequests = async () => {
    let pendingRequests = await API.get(configuration.apiURL +
        "/admin/obj/approve?token=" + token);

    console.log(pendingRequests);
    let mainContent = createElement("div", "main", "main-content");

    // Clear content element before we start appending new content
    adminContent.innerHTML = "";

    if (pendingRequests.error == true) {
        //TODO: display connection error here
        console.log("error");
        return false;
    }

    let requestedTitle = createElement("h2", "", "slim-title");

    requestedTitle.innerText = "Förfrågningar för globala produkter";
    appendElementToApp(requestedTitle, mainContent);

    if (pendingRequests.length == 0) {
        let message = createElement("div", "msg", "message");

        message.innerText = "Inga förfrågningar väntar på utvärdering";
        appendElementToApp(message, mainContent);
        appendElementToApp(mainContent);
        return true;
    }

    //Just to be sure we don't get hit by an edgecase
    if (pendingRequests.length > 0) {
        for (var i = 0; i < pendingRequests.length; i++) {
            let pending = createElement("div", "", "pending-items");
            let image = createElement("img", "", "item-image");
            let wrapText = createElement("div", "", "item-text-wrap");
            let title = createElement("h4", "", "item-title");
            let category = createElement("h6", "", "item-category");

            //TODO: Parse this to display it properly
            //TODO: Add approve button
            console.log(pendingRequests[i]);

            image.src = pendingRequests[i].Bild;
            image.height = 50;
            title.innerText = pendingRequests[i].Modell;
            category.innerText = pendingRequests[i].Kategori;

            appendElementToApp(title, wrapText);
            appendElementToApp(category, wrapText);
            appendElementToApp(image, pending);
            appendElementToApp(wrapText, pending);
            appendElementToApp(pending, mainContent);
        }
        appendElementToApp(mainContent);
    }
};

/**
* Create new user
*/

/**
* navSelector - handles what happens when an element is clicked and what should be displayed
* @param {element} tabElement the html DOM element of the link clicked
*/
const navSelector = (tabElement) => {
    // Remove all other selected tags from navbar
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove("admin-active");
    }
    // Highlight selected button
    tabElement.target.classList.add("admin-active");

    switch (tabElement.target.name) {
        case "global":
            showGlobalProductRequests();
            // console.log("Globala produkter");
            break;
        case "projects":
            console.log("Alla projekt");
            break;
        case "new-user":
            console.log("Ny Användare");
            break;
        default:
            console.log("Error, button not recognised");
            break;
    }
};

// Create clickable nav links
for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", (e) => {
        navSelector(e);
    });
}
