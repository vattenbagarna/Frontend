/* global L */
import {
    object
} from "./src.js";

import {
    key
} from "./getKey.js";

// Initialize the map
export const map = L.map("map", {
    "center": [59.334591, 18.063240],
    "editable": true,
    "zoom": 10,
    "renderer": L.canvas()
});

object.activeObj();
object.search();

const script = document.createElement("script");

script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
document.head.appendChild(script);

var roadmap = L.gridLayer.googleMutant({
    type: "roadmap",
    renderer: L.canvas()
}).addTo(map);

var satellite = L.gridLayer.googleMutant({
    type: "satellite"
});

var baseMaps = {
    "Karta": roadmap,
    "Satellit": satellite
};

L.control.layers(baseMaps).addTo(map);

for (let i = 0; i < document.getElementsByClassName("item").length; i++) {
    document.getElementsByClassName("item")[i].addEventListener("click", () => {
        map.on("click", object.addMarker);
        map.on('mousemove', object.showMouseCoord);

        document.getElementById("map").style.cursor = "pointer";
    });
}

document.getElementById("house").addEventListener('click', () => {
    map.on('click', object.addHouse);
    map.on('mousemove', object.showMouseCoord);
    document.getElementById("map").style.cursor = "pointer";

    document.addEventListener("keydown", function(event) {
        if (event.keyCode == 27) {
            object.stopEdit();
        }
    });
});

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
