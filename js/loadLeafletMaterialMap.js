/* global L */

let polylines = L.layerGroup();
let markers = L.layerGroup();
let polygons = L.layerGroup();
let newDiv;
let boundsArray = [];
// Imports Google maps javascript api key from getKey.js file
import {
    key
} from "./getKey.js";

import {
    jsonData
} from "../json/jsonSave.js";


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

let getBounds = () => {
    markers.eachLayer((marker) => {
        boundsArray.push(marker._latlng);
    });

    polylines.eachLayer((polyline) => {
        boundsArray.push(polyline._latlngs);
    });

    polygons.eachLayer((polygon) => {
        boundsArray.push(polygon._latlngs)
    });

    var bounds = new L.LatLngBounds(boundsArray);
    map.fitBounds(bounds);
}

map.on("zoomend", () => {
    var i = 1;
    markers.eachLayer((marker) => {
        var pixelPosition = map.latLngToLayerPoint(marker._latlng);
        //console.log(pixelPosition);

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

/*
	markers
		- pos
		- type
		- options
		- popup
		- egenskaper
	polylines
		- pos
		- type
		- connected_with
		- options
		- id
		- popup
		- getLength
		- diameter
		- lutning
	polygon
		- pos
		- type
		- options
		- popup
		- address
		- antal personer
		- flöde
*/
/**
 * load - Load objects(markers, polylines, polygons) to the map using json
 * data
 *
 * @returns {void}
 **/
 let load = () => {
	const savedData = jsonData;
	//const jsonLoad = JSON.parse(jsonData)
	let icon;
	let newObj;
	let table = document.getElementById('myMaterialTable');
	let row = table.insertRow(-1);

	//Loop through json data.
	for (let i = 0; i < savedData.length; i++) {
		switch (savedData[i].type) {
			//if marker add it to the map with its options
			case "marker":
				icon = L.icon(savedData[i].options.icon.options);

				savedData[i].options.icon = icon;
				newObj = new L.Marker(savedData[i].coordinates, savedData[i].options).addTo(map);
                markers.addLayer(newObj);

				row = table.insertRow(-1);
				console.log(savedData[i]);
				for (let x = 0; x < savedData[i].attribute.length; x++) {
	  				row.insertCell(x).innerHTML = savedData[i].attribute[x];
				}
				break;
				//if polyline
			case "polyline":
				//get polyline options and add it to an object
				newObj = L.polyline(savedData[i]
					.coordinates, savedData[i].options);
				newObj.connected_with = savedData[i].connected_with;

				//add to map
				polylines.addLayer(newObj).addTo(map);

				row = table.insertRow(-1);
	  			row.insertCell(0).innerHTML = savedData[i].options.id;
				row.insertCell(1).innerHTML = savedData[i].getLength.toFixed(2);
				row.insertCell(2).innerHTML = savedData[i].tilt;
				row.insertCell(3).innerHTML = savedData[i].dimension;

				row.insertCell(4).className = "right";
				break;

			case "polygon":
				newObj = L.polygon(savedData[i].coordinates, savedData[i].options);
				polygons.addLayer(newObj).addTo(map);

				row = table.insertRow(-1);
				row.insertCell(0).innerHTML = savedData[i].definition;
				row.insertCell(1).innerHTML = savedData[i].address;
				row.insertCell(2).innerHTML = savedData[i].nop;
				row.insertCell(3).innerHTML = savedData[i].flow;

				let cell = row.insertCell(4).innerHTML = "";
				break;
		}
	}
}


gridlayers();
load();
getBounds();
