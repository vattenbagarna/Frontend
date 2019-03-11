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
customControl('format_shapes');
customControl('control_camera');
customControl('linear_scale');
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


for (let i = 0; i < document.getElementsByClassName("item").length; i++) {
    document.getElementsByClassName("item")[i].parentElement.addEventListener(
        "click", () => {
            object.activeObjName =
                document.getElementsByClassName("item")[i].id;
            map.on("click", object.addMarker);
            document.getElementById("map").style.cursor = "pointer";
        });
}

//shit code, skulle behövas skrivas om.
document.getElementById('control_camera').addEventListener('click', () => {
    if (map.hasEventListeners('mousemove', object.showMouseCoord)) {
        map.off('mousemove', object.showMouseCoord);
        object.hideMouseCoord();
        document.getElementById('control_camera').className =
            document.getElementById(
                'control_camera').className.replace(
                " active2", "");
    } else {
        map.on('mousemove', object.showMouseCoord);
        document.getElementById('control_camera').className +=
            " active2";
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

document.getElementById("format_shapes").addEventListener('click', () => {
    object.clearMapsEvents();
    object.editPolylines();
});

document.getElementById("delete").addEventListener("click", () => {
    object.clearMapsEvents();
    map.eachLayer((layer) => {
        layer.on("click", object.remove);
    });
});

document.getElementById("save/load").addEventListener("click", () => {
    object.save();
    object.load();
});

document.getElementById("linear_scale").addEventListener("click", () => {
    object.clearMapsEvents();
    object.totalDistance();
});
