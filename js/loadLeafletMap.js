import {
    key
} from "./getKey.js";

let active = "";
let startPolyline = null;

// Initialize the map
const map = L.map("map", {
    "center": [51.505, -0.09],
    "zoom": 5,
    "editable": true
});

L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${key}`, {
    "attribution": "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    "accessToken": key,
    "maxZoom": 25,
    "id": "mapbox.streets"
}).addTo(map);

const myIcon = L.icon({
    "iconUrl": "img/pump.png",
    "iconSize": [38, 45],
    "iconAnchor": [10, 45],
    "popupAnchor": [1, -45]
});

let polyline = [];


function addMarker(e) {

    const marker = new L.marker(e.latlng, {
        "icon": myIcon
    }).addTo(map);

    marker.bindPopup(`${e.latlng.toString()}, ${active}`).openPopup();
}

const item = document.getElementsByClassName("item");

for (let i = 0; i < item.length; i++) {
    item[i].addEventListener("click", (event) => {
        map.eachLayer((layer) => {
            layer.off("click", remove);
        });

        map.on("click", addMarker);
        for (var i = 0; i < polyline.length; i++) {
            polyline[i].editingDrag.addHooks();
        }
        active = event.srcElement.id;
    });
}


document.getElementById("delete").addEventListener("click", (event) => {
    map.off("click", addMarker);

    for (var i = 0; i < polyline.length; i++) {
        polyline[i].editingDrag.removeHooks();
    }
    map.eachLayer((layer) => {
        layer.off("click", redraw);
        layer.on("click", remove);
    });
});

function remove(e) {
    polyline = arrayRemove(polyline, e.target);
    e.target.removeFrom(map);
}

function redraw(event) {
    if (startPolyline != null) {
        let temp = new L.Polyline([startPolyline, event.latlng], {
            edit_with_drag: true,
            vertices: {
                first: false,
                last: false,
                middle: true,
                insert: true,
                destroy: true
            }
        });

        polyline.push(temp);
        polyline[polyline.length - 1].addTo(map);
    }
    startPolyline = event.latlng;
}

document.getElementById("pipe").addEventListener("click", (event) => {
    map.off("click", addMarker);

    for (var i = 0; i < polyline.length; i++) {
        polyline[i].editingDrag.addHooks();
    }

    map.eachLayer((layer) => {
        layer.off("click", remove);
    });

    map.eachLayer((layer) => {
        layer.on("click", redraw);
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


function arrayRemove(arr, value) {

    return arr.filter(function(ele) {
        return ele != value;
    });

}
