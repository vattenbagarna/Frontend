import {
    key
} from "./getKey.js";

let active = "";

// Initialize the map
const map = L.map("map", {
    "center": [51.505, -0.09],
    "zoom": 10
});

L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${key}`, {
    "attribution": "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    "accessToken": key,
    "maxZoom": 18,
    "id": "mapbox.streets"
}).addTo(map);

const myIcon = L.icon({
    "iconUrl": "img/pump.png",
    "iconSize": [38, 45],
    "iconAnchor": [10, 45],
    "popupAnchor": [1, -45]
});

const polyline = new L.Polyline([]).addTo(map);

function addMarker (e) {
    const marker = L.marker(e.latlng, {
        "icon": myIcon
    }).addTo(map);

    marker.bindPopup(`${e.latlng.toString()}, ${active}`).openPopup();

    marker.on("click", (event) => {
        polyline.addLatLng(event.latlng);
    });
}

const obj = document.getElementsByClassName("obj");

for (var i = 0; i < obj.length; i++) {
    obj[i].addEventListener("click", (event) => {
        active = event.srcElement.id;
    });
}

map.on("click", addMarker);

polyline.on("click", loadPipe);

function loadPipe (e) {
    this.bindPopup("<b>Pipe</b><br><button id=\"removebtn\">remove</button").openPopup();
}


const button = document.getElementsByClassName("obj");

for (var i = 0; i < button.length; i++) {
    button[i].addEventListener("click", (event) => {
        active = event.srcElement.id;
    });
}

function removepipe (element) {
    element.remove();
}
