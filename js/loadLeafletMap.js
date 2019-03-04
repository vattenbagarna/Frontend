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

L.tileLayer(
    `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${key}`, {
        "accessToken": key,
        "attribution": "Map data &copy; <a href='https://www.openstreetmap" +
            ".org/'>OpenStreetMap</a> contributors, <a href='https://" +
            "creativecommons.org/" +
            "licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='" +
            "https://www.mapbox.com/'>Mapbox</a>",
        "id": "mapbox.streets",
        "maxZoom": 25
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
