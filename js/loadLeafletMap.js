import {
    key
} from "./getKey.js";

let active = "";
let startPolyline = null;

// Initialize the map
const map = L.map("map", {
    "center": [51.505, -0.09],
    "zoom": 1,
    "editable": true
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
var polyline2 = new L.Polyline([]).addTo(map);


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

function redraw(event) {
    /*polyline.remove();
    polyline2.remove();
    polyline2 = new L.Polyline(polyline._latlngs).addTo(map);
    polyline2.enableEdit();
    */
    if(startPolyline != null) {
        var x = (startPolyline.lat + event.latlng.lat) / 2;
        var y = (startPolyline.lng + event.latlng.lng) / 2;
        var middle = {"lat": x, "lng": y};
        console.log(middle);
        console.log(startPolyline);
        var polyline3 = new L.Polyline([startPolyline, middle ,event.latlng]).addTo(map);
        console.log(event.latlng);
        polyline3.enableEdit();
    }
    startPolyline = event.latlng;
}

document.getElementById("pipe").addEventListener("click", (event) => {
    map.off("click", addMarker);

    map.eachLayer((layer) => {
        layer.on("click", (e) => {
            redraw(e);
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
