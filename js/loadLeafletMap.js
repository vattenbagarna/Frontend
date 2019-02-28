/* global document, L */

import {
    key
} from "./getKey.js";

let active = "";
let startPolyline = null;
let polylines = [];

// Initialize the map
const map = L.map("map", {
    "center": [59.334591, 18.063240],
    "editable": true,
    "zoom": 10
});

L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${key}`, {
    "accessToken": key,
    "attribution": "Map data &copy; <a href='https://www.openstreetmap" +
        ".org/'>OpenStreetMap</a> contributors, <a href='https://" +
        "creativecommons.org/" +
        "licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='" +
        "https://www.mapbox.com/'>Mapbox</a>",
    "id": "mapbox.streets",
    "maxZoom": 25
}).addTo(map);

const myIcon = L.icon({
    "iconAnchor": [10, 45],
    "iconSize": [38, 45],
    "iconUrl": "img/pump.png",
    "popupAnchor": [1, -45]
});

const item = document.getElementsByClassName("item");

for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", (event) => {
        map.eachLayer((layer) => {
            layer.off("click", remove);
        });

        map.on("click", addMarker);
        for (let i = 0; i < polylines.length; i++) {
            polylines[i].editingDrag.addHooks();
        }
        active = event.srcElement.id;
    });
}


document.getElementById("pipe").addEventListener("click", () => {
    map.off("click", addMarker);

    for (let i = 0; i < polylines.length; i++) {
        polylines[i].editingDrag.addHooks();
    }

    map.eachLayer((layer) => {
        layer.off("click", remove);
    });

    map.eachLayer((layer) => {
        layer.on("click", redraw);
    });
});

document.getElementById("delete").addEventListener("click", () => {
    map.off("click", addMarker);

    for (let i = 0; i < polylines.length; i++) {
        polylines[i].editingDrag.removeHooks();
    }
    map.eachLayer((layer) => {
        layer.off("click", redraw);
        layer.on("click", remove);
    });
});

/**
 * Adds a marker to the map.
 * @param {object} event event.
 * @returns {void}
 */
function addMarker(event) {
    const marker = new L.Marker(event.latlng, {
        "draggable": "true",
        "icon": myIcon
    }).addTo(map).
    on("drag", movePipe);

    marker.bindPopup(`${event.latlng.toString()}, ${active}`).openPopup();
}

function movePipe(event) {
    let newLatlng;

    for (let i = 0; i < polylines.length; i++) {
        if (event.target._leaflet_id == polylines[i].connected_with.first) {
            newLatlng = polylines[i].getLatLngs();
            newLatlng.shift();
            newLatlng.unshift(event.latlng);

            polylines[i].setLatLngs(newLatlng);
        } else if (event.target._leaflet_id == polylines[i].connected_with.last) {
            newLatlng = polylines[i].getLatLngs();
            newLatlng.pop();
            newLatlng.push(event.latlng);
            polylines[i].setLatLngs(newLatlng);
        }
    }
}

function remove(e) {
    polylines = arrayRemove(polylines, e.target);
    e.target.removeFrom(map);
}

/**
 * Draws polylines.
 * @param {object} event event.
 * @returns {void}
 */
function redraw(event) {
    if (startPolyline != null) {
        const temp = new L.polyline([startPolyline.latlng, event.latlng], {
            "edit_with_drag": true,
            "vertices": {
                "first": false,
                "last": false,
                "middle": true,
                "insert": true,
                "destroy": true
            }
        });

        temp.connected_with = {
            "first": startPolyline.id,
            "last": event.sourceTarget._leaflet_id
        };

        polylines.push(temp);


        // Få längden på polylines fungerar bara när man placerar ut den första gången
        let previousPoint;

        temp.getLatLngs().forEach((latLng) => {
            if (previousPoint) {
                polylines[polylines.length - 1].bindPopup(`Distance from previous point: ${
                    previousPoint.distanceTo(latLng).toFixed(2)
                } meter(s)`).addTo(map).
                openPopup();
            }
            previousPoint = latLng;
        });
        startPolyline = null;
    } else {
        startPolyline = [];
        startPolyline.latlng = event.latlng;
        startPolyline.id = event.sourceTarget._leaflet_id;
    }
}


/**
 * Changes classname on active button.
 * @returns {void}
 */
function activeObj() {
    const obj = document.getElementsByClassName("obj");

    for (let i = 0; i < obj.length; i++) {
        obj[i].addEventListener("click", function activeClassName() {
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


function arrayRemove(arr, value) {

    return arr.filter((ele) => ele != value);

}
