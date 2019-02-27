/* global document, L */

import {
    key
} from "./getKey.js";

let active = "";
let startPolyline = null;

// Initialize the map
const map = L.map("map", {
    "center": [51.505, -0.09],
    "editable": true,
    "zoom": 1
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
        "maxZoom": 18
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

const item = document.getElementsByClassName("item");

for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", (event) => {
        map.on("click", addMarker);
        active = event.srcElement.id;
    });
}


document.getElementById("delete").addEventListener("click", () => {
    map.off("click", addMarker);

    map.eachLayer((layer) => {
        layer.on("click", (event) => {
            event.target.remove();
        });
    });
});

/**
 * Draws polylines.
 * @param {object} event event.
 * @returns {void}
 */
function redraw (event) {
    if (startPolyline !== null) {
        const latMid = (startPolyline.lat + event.latlng.lat) / 2;
        const lngMid = (startPolyline.lng + event.latlng.lng) / 2;
        const middle = {
            "lat": latMid,
            "lng": lngMid
        };
        const polyline3 =
        new L.Polyline([startPolyline, middle, event.latlng]).addTo(map);

        polyline3.enableEdit();
    }
    startPolyline = event.latlng;
}

document.getElementById("pipe").addEventListener("click", () => {
    map.off("click", addMarker);

    map.eachLayer((layer) => {
        layer.on("click", (event) => {
            redraw(event);
        });
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
