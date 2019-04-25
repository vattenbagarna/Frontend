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

    let objects = {};
    let pipes = {};
    //Loop through json data.

    for (let i = 0; i < savedData.length; i++) {
        let objectName = "";
        let pipeName = "";

        switch (savedData[i].type) {
            //if marker add it to the map with its options
            case "marker":
                icon = L.icon(savedData[i].options.icon.options);

                savedData[i].options.icon = icon;
                newObj = new L.Marker(savedData[i].coordinates, savedData[i].options).addTo(map);
                markers.addLayer(newObj);

                row = table.insertRow(-1);

                objectName = savedData[i].attribute[0];

                if (!objects.hasOwnProperty(objectName)) {
                    objects[objectName] = {antal: 1, cell: undefined};
                    for (let x = 0; x < savedData[i].attribute.length; x++) {
                        row.insertCell(x).innerHTML = savedData[i].attribute[x];
                    }
                    let newCell = row.insertCell(savedData[i].attribute.length);

                    objects[objectName].cell = newCell;
                    newCell.innerHTML = "antal " + objects[objectName].antal;

                    //insert cost with inptut thing
                    row.insertCell(savedData[i].attribute.length+1).innerHTML =
                        "Kostnad <input class='costInput' value='1'/>";
                } else {
                    objects[objectName].antal += 1;
                    objects[objectName].cell.innerHTML = "antal " + objects[objectName].antal;
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

                pipeName = savedData[i].options.id;

                if (!pipes.hasOwnProperty(pipeName)) {
                    row = table.insertRow(-1);


                    row.insertCell(0).innerHTML = savedData[i].options.id;
                    let newCell = row.insertCell(1);

                    newCell.innerHTML = savedData[i].getLength.toFixed(2) + " m";
                    row.insertCell(2).innerHTML = savedData[i].tilt;
                    row.insertCell(3).innerHTML = savedData[i].dimension;

                    pipes[pipeName] = {
                        "totalLength": parseInt(savedData[i].getLength.toFixed(2)),
                        "cell": newCell
                    };
                    row.insertCell(4).innerHTML = "Kostnad <input class='costInput' value='1'/>";

                    row.insertCell(5).className = "right";
                } else {
                    pipes[pipeName].totalLength += parseInt(savedData[i].getLength.toFixed(2));
                    pipes[pipeName].cell.innerHTML = pipes[pipeName].totalLength.toFixed(2) + " m";
                }
                break;
        }
    }
    //Create Summary
    //let totalCost = calculateCost();
    let totalCost = 0;

    row = table.insertRow(-1);
    row.insertCell(0).innerHTML = "Totala kostnaden: ";
    let cost = row.insertCell(1);

    cost.setAttribute('id', 'displayCost');
    cost.innerHTML = totalCost+" kr";
    console.log(cost);

    row.insertCell(2).innerHTML = "<button id='UpdateCostButton'>Update</button>";


    //calculateCost();
};



gridlayers();
load();
getBounds();

document.getElementById("UpdateCostButton").addEventListener("click", () => {
    let costInput = document.getElementsByClassName("costInput");
    let totalCost = 0;

    for (let i = 0; i < costInput.length; i++) {
        totalCost += parseInt(costInput[i].value);
    }
    console.log("Total cost: "+totalCost);
    document.getElementById("displayCost").innerHTML = totalCost + " kr";
});
