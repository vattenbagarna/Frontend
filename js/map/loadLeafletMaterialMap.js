/* global L configuration */

let polylines = L.layerGroup();
let markers = L.layerGroup();
let polygons = L.layerGroup();
let newDiv;
let boundsArray = [];
let token = localStorage.getItem('token');
// Imports Google maps javascript api key from getKey.js file

import { key } from "./getKey.js";
import { options } from "./options.js";
import { popup } from "./popup.js";


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


let id = new URL(window.location.href).searchParams.get('id');

fetch(`${configuration.apiURL}/proj/data/${id}?token=${token}`)
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        if (!json.error) {
            if (json[0].data.length > 0) {
                load(json[0].data);
            }
        } else {
            if (json.info == "token failed to validate") {
                localStorage.removeItem('token');
                document.location.href = "index.html";
            } else {
                console.log(json);
            }
        }
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

    let table = document.getElementById('myMaterialTable');
    let row = table.insertRow(-1);

    let objects = {};
    let pipes = {};

    map.setView(json[0].center, json[0].zoom);

    //Loop through json data.
    for (let i = 1; i < json.length; i++) {
        let objectName = "";
        let pipeName = "";

        switch (json[i].type) {
            //if marker add it to the map with its options
            case "marker":
                icon = L.icon(json[i].options.icon.options);

                newObj = new Marker(json[i].coordinates, json[i].attributes, icon, json[i].id);

                row = table.insertRow(-1);

                if (!objects.hasOwnProperty(objectName)) {
                    objects[objectName] = { antal: 1, cell: undefined };
                    row.insertCell(0).innerHTML =
                        `${json[i].attributes.Modell}`;
                    row.insertCell(1).innerHTML +=
                        `Antal: ${objects[objectName].antal}`;
                    if (json[i].attributes.RSK != undefined) {
                        row.insertCell(2).innerHTML +=
                            `RSK: ${json[i].attributes.RSK}`;
                    } else {
                        row.insertCell(2).innerHTML +=
                            `Artikel nummer: ${json[i].attributes.ArtikelNr}`;
                    }
                    row.insertCell(3).innerHTML +=
                        `<img src="${json[i].attributes.Bild}"/>`;

                    row.insertCell(4).innerHTML = "Kostnad <input class='costInput' value='?'/>";
                    row.insertCell(4).className = "right";
                } else {
                    objects[objectName].antal += 1;
                    objects[objectName].cell.innerHTML = "antal " + objects[objectName].antal;
                }
                break;
                //if polyline
            case "polyline":
                newObj = new Pipe(json[i].coordinates, ["", ""], json[i].pipeType,
                    json[i].connected_with.first);
                newObj.draw(json[i].connected_with.last, null, json[i].dimension, json[i].tilt);

                if (!pipes.hasOwnProperty(pipeName)) {
                    row = table.insertRow(-1);


                    row.insertCell(0).innerHTML = json[i].options.id;
                    let newCell = row.insertCell(1);

                    newCell.innerHTML = json[i].length.toFixed(2) + " m";
                    row.insertCell(2).innerHTML = "lutning: " + json[i].tilt;
                    row.insertCell(3).innerHTML = "dimension: " + json[i].dimension;

                    pipes[pipeName] = {
                        "totalLength": parseInt(json[i].length.toFixed(2)),
                        "cell": newCell
                    };
                    row.insertCell(4).innerHTML = "Kostnad <input class='costInput' value='1'/>";

                    row.insertCell(5).className = "right";
                } else {
                    pipes[pipeName].totalLength += parseInt(json[i].length.toFixed(2));
                    pipes[pipeName].cell.innerHTML = pipes[pipeName].totalLength.toFixed(2) + " m";
                }
                break;
            case "polygon":
                newObj = new House(json[i].coordinates[0], ["", ""]);
                newObj.drawFromLoad(json[i].coordinates, json[i].popup, json[i].nop,
                    json[i].flow, json[i].options);
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
    cost.innerHTML = totalCost + " kr";
    console.log(cost);

    row.insertCell(2).innerHTML = "<button id='UpdateCostButton'>Update</button>";

    gridlayers();
    getBounds();
};

/*document.getElementById("UpdateCostButton").addEventListener("click", () => {
    let costInput = document.getElementsByClassName("costInput");
    let totalCost = 0;

    for (let i = 0; i < costInput.length; i++) {
        totalCost += parseInt(costInput[i].value);
    }
    console.log("Total cost: " + totalCost);
    document.getElementById("displayCost").innerHTML = totalCost + " kr";
});*/


/**
 * Marker - Class for creation of marker and underlying functionality for each object
 *
 */
export class Marker {
    /**
     * constructor - Creates a L.Marker with preconfiged attributes from options.js and popup.js
     * 			   - @see {@link https://leafletjs.com/reference-1.4.0.html#marker}
     * 			   - Adds functionality for drag and when popup is open
     * 			   - Lastly displays the new marker on the map
     *
     * @param {array} latlng     Coordinates (latitude and longitude) for the new marker
     * @param {array} attributes Specific characteristics (values) for the new marker
     * @param {L.Icon} icon		 @see {@link https://leafletjs.com/reference-1.4.0.html#icon}
     * @param {null} [id=null]   Option to specify leaflet_id on creation
     *
     * @returns {void}
     */
    constructor(latlng, attributes, icon, id = null) {
        this.attributes = attributes;

        this.marker = new L.Marker(latlng, options.marker(icon))
            .bindPopup(popup.marker(this.attributes) + popup.changeCoord(latlng));

        this.marker.attributes = this.attributes;
        this.marker.disableDragging = () => { this.marker.dragging.disable(); return this.marker; };
        this.marker.enableDragging = () => { this.marker.dragging.enable(); };

        // Add marker to markers layer
        markers.addLayer(this.marker).addTo(map);

        if (id) {
            this.marker.id = id;
        } else {
            this.marker.id = this.marker._leaflet_id;
        }
    }
}

/**
 * House - Class for creation of house and underlying functionality for each
 */
export class House {
    /**
     * constructor - Creates a L.polygon with preconfigured attributes from options.js and popup.js
     * 			   - @see {@link https://leafletjs.com/reference-1.4.0.html#polygon}
     * 			   - Creates a guideline with a dashed line to help user to line up the next point
     * 			   - Guideline update it's position on mousemove
     * 			   - Calls stopDrawListener() to listen for escape presses to stop drawing
     *
     * @param {array} latlng     Coordinates (latitude and longitude) for the first point
     * 							 to the new house
     * @param {array} attributes Specific characteristics (values) for the new house
     *
     * @returns {void}
     */
    constructor(latlng, attributes) {
        this.completed = false;
        this.attributes = attributes;
        this.polygon = L.polygon([latlng], options.house);
    }

    /**
     * drawFromLoad - Draws polygon from saved data
     *
     * @param {array} latlngs     The rest of the coordinates of the corners on the polygon
     * @param {string} address    The address of the polygon
     * @param {string} definition What type of building is it
     * @param {string} nop        number of people is living there
     * @param {string} flow       water flow per person
     *
     * @returns {void}
     */
    drawFromLoad(latlngs, popup, nop, flow, options) {
        this.polygon.setStyle(options);
        this.polygon.setLatLngs(latlngs);
        this.polygon.bindPopup(popup);
        polygons.addLayer(this.polygon).addTo(map);

        this.polygon.nop = nop;
        this.polygon.flow = flow;
        this.completed = true;
    }
}

/**
 * Pipe - Class for creation of pipe and underlying functionality for each
 */
export class Pipe {
    /**
     * constructor - Saves params values to object
     *
     * @param {array} latlngs   Coordinates (latitude and longitude) for the new polyline
     * 							latlngs -> can be one och more points (latlng)
     * @param {let} attributes Specific characteristics (values) for the new pipe
     * @param {let} type       0 -> pipe, 1 -> stem pipe
     * @param {let} id         Unique number to first connected_with
     *
     * @returns {void}
     */
    constructor(latlngs, attributes, type, id) {
        this.latlngs = latlngs;
        this.attribute = attributes;
        this.type = type;
        this.first = id;
    }

    /**
     * draw - Creates a L.polyline with preconfigured attributes from options.js, popup.js and type
     * 		- @see {@link https://leafletjs.com/reference-1.4.0.html#polyline}
     * 		- Set connected_with values so the object knows what is it connected to
     * 		- Set length for new polyline
     * 		- Displays new polyline on map
     *
     * @param {let} id            		Unique number to last connected_with
     * @param {array} [latlng=null] 	Option to push new point into new polyline
     * @param {null} [dimension=null]	Option to add preconfigured dimension
     * @param {null} [tilt=null]      	Option to add preconfigured tilt
     *
     * @returns {void}
     **/
    draw(id, latlng = null) {
        this.last = id;
        if (latlng != null) { this.latlngs.push(latlng); }

        this.createPolyline();
    }

    /**
     * createPolyline - Creates a new polyline depending on what type is choosen with preconfigured
     * 				  - options, popup, length, dimension and tilt. Lastly add the new created
     * 				  - polyline to map
     *
     * @returns {void}
     */
    createPolyline() {
        if (this.type == 0) {
            this.polyline = new L.polyline(this.latlngs, options.pipe);
        } else if (this.type == 1) {
            this.polyline = new L.polyline(this.latlngs, options.stemPipe);
        }


        this.polyline.connected_with = {
            first: this.first,
            last: this.last
        };
        polylines.addLayer(this.polyline).addTo(map);
        this.polyline.bindPopup(popup.pipe(this.dimension, this.tilt));
        this.polyline.type = this.type;
        this.polyline.dimension = this.dimension;
        this.polyline.tilt = this.tilt;
    }
}
