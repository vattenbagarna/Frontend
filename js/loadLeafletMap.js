/* global document, L */

import {
    key
} from "./getKey.js";

let active = "";
let startPolyline = null;
let polyline = [];

// Initialize the map
const map = L.map("map", {
    "center": [59.334591, 18.063240],
    "editable": true,
    "zoom": 10
});

L.tileLayer(
    `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${key}`,
    {
        "accessToken": key,
        "attribution": "Map data &copy; <a href='https://www.openstreetmap" +
            ".org/'>OpenStreetMap</a> contributors, <a href='https://" +
            "creativecommons.org/" +
            "licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='" +
            "https://www.mapbox.com/'>Mapbox</a>",
        "id": "mapbox.streets",
        "maxZoom": 20
    }
).addTo(map);

const myIcon = L.icon({
    "iconAnchor": [10, 45],
    "iconSize": [38, 45],
    "iconUrl": "img/pump.png",
    "popupAnchor": [1, -45]
});

/**
 * Adds a marker to the map.
 * @param {object} event event.
 * @returns {void}
 */
function addMarker (event) {
    const marker = new L.Marker(event.latlng, {
        "icon": myIcon
    }).addTo(map);

    marker.bindPopup(`${event.latlng.toString()}, ${active}`).openPopup();
}

/**
 * Removes specified item from array
 * @param {array} arr arr
 * @param {object} value value
 * @returns {array} new array
 */
function arrayRemove (arr, value) {

    return arr.filter((ele) => ele !== value);

}

/**
 * Removes items from the map.
 * @param {object} event event
 * @returns {void}
 */
function remove (event) {
    polyline = arrayRemove(polyline, event.target);
    event.target.removeFrom(map);
}

/**
 * Draws polylines.
 * @param {object} event event.
 * @returns {void}
 */
function redraw (event) {
    if (startPolyline !== null) {
        const temp = new L.Polyline([startPolyline, event.latlng], {
            "edit_with_drag": true,
            "vertices": {
                "destroy": true,
                "first": false,
                "insert": true,
                "last": false,
                "middle": true
            }
        });

        polyline.push(temp);
        polyline[polyline.length - 1].addTo(map);

        startPolyline = null;
    } else {
        startPolyline = event.latlng;
    }
}

const item = document.getElementsByClassName("item");

for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", (event) => {
        map.eachLayer((layer) => {
            layer.off("click", remove);
        });

        map.on("click", addMarker);
        for (let i = 0; i < polyline.length; i++) {
            polyline[i].editingDrag.addHooks();
        }
        active = event.srcElement.id;
    });
}


document.getElementById("delete").addEventListener("click", () => {
    map.off("click", addMarker);

    for (let i = 0; i < polyline.length; i++) {
        polyline[i].editingDrag.removeHooks();
    }
    map.eachLayer((layer) => {
        layer.off("click", redraw);
        layer.on("click", remove);
    });
});

document.getElementById("pipe").addEventListener("click", () => {
    map.off("click", addMarker);

    for (let i = 0; i < polyline.length; i++) {
        polyline[i].editingDrag.addHooks();
    }

    map.eachLayer((layer) => {
        layer.off("click", remove);
    });

    map.eachLayer((layer) => {
        layer.on("click", redraw);
    });
});


/**
 * Changes classname on active button.
 * @returns {void}
 */
function activeObj () {
    const obj = document.getElementsByClassName("obj");

    for (let i = 0; i < obj.length; i++) {
        obj[i].addEventListener("click", function activeClassName () {
            const current = document.getElementsByClassName("active");

            if (current.length > 0) {
                current[0].className =
                    current[0].className.replace(" active", "");
            }
            this.className += " active";
        });
    }
}
activeObj();
