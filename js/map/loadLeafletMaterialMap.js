/* global L */

let polylines = L.layerGroup();
let markers = L.layerGroup();
let polygons = L.layerGroup();
let newDiv;
let boundsArray = [];

// Imports Google maps javascript api key from getKey.js file
import { key } from "./getKey.js";
import { Marker, Pipe, House, } from "./classes.js";


// Initialize the map with center coordinates on BAGA HQ and zoom 18.
export const map = L.map("myMaterialMap", {
    "center": [56.208640, 15.632630],
    "editable": true,
    "zoomControl": false,
    "doubleClickZoom": false,
    "boxZoom": false,
    "dragging": false,
    "scrollWheelZoom": false,
    "zoom": 18
});

// Creates script link to Google Maps javascript API with our key
// then append it to head of map.html.
const script = document.createElement("script");

script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
document.head.appendChild(script);

/**
 * gridlayers - Creates the layer button in the top right corner with roadmap
 * 				and satellite alternatives
 *
 * @returns {void}
 */
let gridlayers = () => {
    // Creates Google maps roadmap (standard) grid layer and displays it on the map
    var roadmap = L.gridLayer.googleMutant({
        type: "roadmap"
    }).addTo(map);

    // Creates Google maps satellite grid layer
    var satellite = L.gridLayer.googleMutant({
        type: "satellite"
    });

    // Creates a array with roadmap and satellite inside and then add the array to a
    // new control layer and displays it to the map in the top right corner.
    var baseMaps = {
        "Karta": roadmap,
        "Satellit": satellite
    };

    L.control.layers(baseMaps).addTo(map);
};

/**
 * TBA
 *
 * @returns {void}
 */
let getBounds = () => {
    markers.eachLayer((marker) => {
        boundsArray.push(marker._latlng);
    });

    polylines.eachLayer((polyline) => {
        boundsArray.push(polyline._latlngs);
    });

    polygons.eachLayer((polygon) => {
        boundsArray.push(polygon._latlngs);
    });

    var bounds = new L.LatLngBounds(boundsArray);

    map.fitBounds(bounds);
};

map.on("zoomend", () => {
    var i = 1;

    markers.eachLayer((marker) => {
        var pixelPosition = map.latLngToLayerPoint(marker._latlng);

        newDiv = document.createElement("div" + i);
        newDiv.style.top = (pixelPosition.y + 10) + "px";
        newDiv.style.left = (pixelPosition.x + 15) + "px";
        newDiv.style.position = "absolute";
        newDiv.style.zIndex = 100000;
        var newContent = document.createTextNode(i);

        i = i + 1;
        newDiv.appendChild(newContent);

        var currentDiv = document.getElementById("mapDiv");

        document.body.insertBefore(newDiv, currentDiv);
    });
});

/**
 * load - Load objects(markers, polylines, polygons) to the map using json
 * data
 *
 * @returns {void}
 */
let load = (json) => {
    let icon;
    let newObj;

    map.setView(json[0].center, json[0].zoom);

    //Loop through json data.
    for (let i = 1; i < json.length; i++) {
        switch (json[i].type) {
            //if marker add it to the map with its options
            case "marker":
                icon = L.icon(json[i].options.icon.options);

                newObj = new Marker(json[i].coordinates, json[i].attributes, icon);

                newObj.marker._leaflet_id = json[i].id;
                break;
                //if polyline
            case "polyline":
                newObj = new Pipe(json[i].coordinates, ["", ""], json[i].pipeType,
                    json[i].connected_with[0]);
                newObj.draw(json[i].connected_with[1], null, json[i].dimension, json[i].tilt);
                break;
                //if polygon
            case "polygon":
                newObj = new House(json[i].coordinates[0], ["", ""]);
                newObj.drawFromLoad(json[i].coordinates, json[i].address, json[i].definition,
                    json[i].nop, json[i].flow);
                break;
        }
    }
};


gridlayers();
load();
getBounds();
