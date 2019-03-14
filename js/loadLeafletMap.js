/* global L */
import {
    object
} from "./src.js";

import {
    key
} from "./getKey.js";

// Initialize the map
export const map = L.map("map", {
    "center": [56.208640, 15.632630],
    "editable": true,
    "zoom": 18
});

const script = document.createElement("script");

script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
document.head.appendChild(script);

var roadmap = L.gridLayer.googleMutant({
    type: "roadmap"
}).addTo(map);

var satellite = L.gridLayer.googleMutant({
    type: "satellite"
});

var baseMaps = {
    "Karta": roadmap,
    "Satellit": satellite
};

function customControl(iconName) {
    var myCustomControl = L.Control.extend({
        options: {
            position: 'topleft'
        },
        onAdd: () => {
            var container = L.DomUtil.create('div',
                'leaflet-bar leaflet-control leaflet-control-custom'
            );

            L.DomEvent.disableClickPropagation(container);
            container.id = iconName;
            let icon = L.DomUtil.create('i');

            icon.className = 'material-icons';
            icon.innerHTML = iconName;
            container.appendChild(icon);

            return container;
        }
    });

    map.addControl(new myCustomControl());
}

L.control.layers(baseMaps).addTo(map);
customControl('timeline');
customControl('control_camera');
customControl('bar_chart');
customControl('delete');
object.search();
object.activeObj();

let acc = document.getElementsByClassName("accordion");

for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("activeAccordion");
        var panel = this.nextElementSibling;

        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}

//inte det snyggaste kanske
let onStart = () => {
    for (let i = 0; i < document.getElementsByClassName("pumpstationer").length; i++) {
        let elements = document.getElementsByClassName("pumpstationer");

        elements[i].parentElement.addEventListener("click", () => {
            object.activeObjName = elements[i].id;
            object.activeIcon = L.icon({
                iconAnchor: [36.5, 19.5],
                iconSize: [73, 39],
                iconUrl: `img/symbol_elementbrunn.png`,
                popupAnchor: [0, -19.5]
            });
            map.on("click", object.addMarker);
            document.getElementById("map").style.cursor = "pointer";
        });
    }

    for (let i = 0; i < document.getElementsByClassName("slamavskiljare").length; i++) {
        let elements = document.getElementsByClassName("slamavskiljare");

        elements[i].parentElement.addEventListener("click", () => {
            object.activeObjName = elements[i].id;
            object.activeIcon = L.icon({
                iconAnchor: [19.5, 19.5],
                iconSize: [39, 39],
                iconUrl: `img/symbol_slamavskiljare.png`,
                popupAnchor: [0, -19.5]
            });
            map.on("click", object.addMarker);
            document.getElementById("map").style.cursor = "pointer";
        });
    }


    for (let i = 0; i < document.getElementsByClassName("kompaktbädd").length; i++) {
        let elements = document.getElementsByClassName("kompaktbädd");

        elements[i].parentElement.addEventListener("click", () => {
            object.activeObjName = elements[i].id;
            object.activeIcon = L.icon({
                iconAnchor: [36.5, 19.5],
                iconSize: [73, 39],
                iconUrl: `img/symbol_utjämningsbrunn.png`,
                popupAnchor: [0, -19.5]
            });
            map.on("click", object.addMarker);
            document.getElementById("map").style.cursor = "pointer";
        });
    }

    for (let i = 0; i < document.getElementsByClassName("fettavskiljare").length; i++) {
        let elements = document.getElementsByClassName("fettavskiljare");

        elements[i].parentElement.addEventListener("click", () => {
            object.activeObjName = elements[i].id;
            object.activeIcon = L.icon({
                iconAnchor: [19.5, 19.5],
                iconSize: [39, 39],
                iconUrl: `img/symbol_fettavskiljare.png`,
                popupAnchor: [0, -19.5]
            });
            map.on("click", object.addMarker);
            document.getElementById("map").style.cursor = "pointer";
        });
    }

    for (let i = 0; i < document.getElementsByClassName("oljeavskiljare").length; i++) {
        let elements = document.getElementsByClassName("oljeavskiljare");

        elements[i].parentElement.addEventListener("click", () => {
            object.activeObjName = elements[i].id;
            object.activeIcon = L.icon({
                "iconAnchor": [19.5, 19.5],
                "iconSize": [39, 39],
                "iconUrl": `img/symbol_oljeavskiljare.png`,
                "popupAnchor": [0, -19.5]
            });
            map.on("click", object.addMarker);
            document.getElementById("map").style.cursor = "pointer";
        });
    }
};

onStart();

//shit code, skulle behövas skrivas om.
document.getElementById('control_camera').addEventListener('click', (event) => {
    if (map.hasEventListeners('mousemove', object.showMouseCoord)) {
        map.off('mousemove', object.showMouseCoord);

        event.srcElement.parentElement.className =
            event.srcElement.parentElement.className.replace(
                " active2", "");

        object.hideMouseCoord();
    } else {
        map.on('mousemove', object.showMouseCoord);

        event.srcElement.parentElement.className += " active2";
    }
});

document.getElementById("house").addEventListener('click', () => {
    map.on('click', object.addHouse);
    document.getElementById("map").style.cursor = "pointer";

    document.addEventListener("keydown", (event) => {
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

document.getElementById("timeline").addEventListener('click', (event) => {
    object.clearMapsEvents();
    object.activeCustomControl(event);
    object.editPolylines();
});

document.getElementById("delete").addEventListener("click", (event) => {
    object.clearMapsEvents();
    object.activeCustomControl(event);
    map.eachLayer((layer) => {
        layer.on("click", object.remove);
    });
});

document.getElementById("save/load").addEventListener("click", () => {
    object.save();
    object.load();
});

document.getElementById("bar_chart").addEventListener("click", (event) => {
    object.clearMapsEvents();
    object.activeCustomControl(event);
    object.totalDistance();
});
