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

function addMarker(e) {

    const marker = new L.marker(e.latlng, {
        "icon": myIcon
    }).addTo(map);

    marker.bindPopup(`${e.latlng.toString()}, ${active}`).openPopup();
}

const item = document.getElementsByClassName("item");

for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", (event) => {
        map.on("click", addMarker);
        active = event.srcElement.id;
    });
}


document.getElementById("delete").addEventListener("click", (event) => {
    map.off("click", addMarker);

    map.eachLayer((layer) => {
        layer.on("click", (e) => {
            e.target.remove();
        });
    });
});

document.getElementById("pipe").addEventListener("click", (event) => {
    map.off("click", addMarker);

    map.eachLayer((layer) => {
        layer.on("click", (e) => {
            polyline.addLatLng(e.latlng);
        });
    });
});


function activeObj() {
    const obj = document.getElementsByClassName("obj");

    for (var i = 0; i < obj.length; i++) {
        obj[i].addEventListener("click", function() {
            var current = document.getElementsByClassName("active");
            if (current.length > 0) {
                current[0].className = current[0].className.replace(" active", "");
            }
            this.className += " active";
        });
    }
}
activeObj();
