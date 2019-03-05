/* global L */
import {
    object
} from "./src.js";

import {
    key
} from "./getKey.js";


object.activeObj();

// Initialize the map
export const map = L.map("map", {
    "center": [59.334591, 18.063240],
    "editable": true,
    "zoom": 10
});

object.search();

const scri = document.createElement("script");

scri.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
document.head.appendChild(scri).addEventListener("load", map);

var roads = L.gridLayer.googleMutant({
    type: 'satellite'	// valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
}).addTo(map);

for (let i = 0; i < document.getElementsByClassName("item").length; i++) {
    document.getElementsByClassName("item")[i].addEventListener("click", () => {
        map.on("click", object.addMarker);
    });
}

document.getElementById("pipe").addEventListener("click", () => {
    map.eachLayer((layer) => {
        layer.on("click", object.redraw);
    });
});

document.getElementById("editPolylines").addEventListener('click', () => {
    object.editPolylines();
});

document.getElementById("delete").addEventListener("click", () => {
    map.eachLayer((layer) => {
        layer.on("click", object.remove);
    });
});

document.getElementById("save/load").addEventListener("click", () => {
    object.save();
    object.load();
});

document.getElementById("totalDistance").addEventListener("click", () => {
    object.totalDistance();
});
