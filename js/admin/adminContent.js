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
    let pendingRequests = await API.get(configuration.apiURL + "/admin/obj/approve?token=" + token);
    let mainContent = createElement("div", "main", "main-content");

    // Clear content element before we start appending new content
    adminContent.innerHTML = "";

    if (pendingRequests.error == true) {
        //TODO: display connection error here
        console.log("error");
        return false;
    }

    if (pendingRequests.length == 0) {
        let requestedTitle = createElement("h2", "", "slim-title");
        let message = createElement("div", "msg", "message");

        requestedTitle.innerText = "Förfrågningar för globala produkter";
        message.innerText = "Inga förfrågningar väntar på utvärdering";
        appendElementToApp(requestedTitle, mainContent);
        appendElementToApp(message, mainContent);
        appendElementToApp(mainContent);
        return true;
    }

    //Just to be sure we don't get hit by an edgecase
    if (pendingRequests.length > 0) {
        for (var i = 0; i < pendingRequests.length; i++) {
            let pending = createElement("div", "", "pending");

            //TODO: Parse this to display it properly
            //TODO: Add approve button
            pending.innerText = pendingRequests[i];
        }
    }
};

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
            console.log("Globala produkter");
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
