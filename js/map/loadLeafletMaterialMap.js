/* global L configuration, API */

let polylines = L.layerGroup();
let markers = L.layerGroup();
let polygons = L.layerGroup();
let newDiv;
let newP;
let boundsArray = [];
let numbersObj = {};
let token = localStorage.getItem('token');
let table = document.getElementById('myMaterialTable');
let icons = [];

// Imports Google maps javascript api key from getKey.js file
import { key } from "./getKey.js";
import { options } from "./options.js";
import { popup } from "./popup.js";

// Initialize the map with center coordinates on BAGA HQ and zoom 18.
export const map = L.map("myMaterialMap", {
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
        marker.off("click");
        marker.options.interactive = false;
    });

    polylines.eachLayer((polyline) => {
        boundsArray.push(polyline._latlngs);
        polyline.options.interactive = false;
        polyline.off("click");
    });

    polygons.eachLayer((polygon) => {
        boundsArray.push(polygon._latlngs);
        polygon.off("click");
    });

    var bounds = new L.LatLngBounds(boundsArray);

    map.fitBounds(bounds);
};

map.on("moveend", () => {
    var i = 1;

    markers.eachLayer((marker) => {
        if (marker.attributes.Kategori != "Förgrening" &&
            marker.attributes.Kategori != "Utsläppspunkt") {
            if (!numbersObj.hasOwnProperty(marker.attributes.Modell)) {
                numbersObj[marker.attributes.Modell] = [i];
            } else {
                numbersObj[marker.attributes.Modell].push(i);
            }

            if (!numbersObj.hasOwnProperty(marker.attributes.Pump)) {
                numbersObj[marker.attributes.Pump] = [i];
            } else {
                numbersObj[marker.attributes.Pump].push(i);
            }

            var pixelPosition = map.latLngToLayerPoint(marker._latlng);

            newDiv = document.createElement("div");
            newP = document.createElement("p");
            newDiv.style.top = (pixelPosition.y + 10) + "px";
            newDiv.style.left = (pixelPosition.x + 15) + "px";
            newDiv.setAttribute("class", "circleNumbers");
            var newContent = document.createTextNode(i);

            i = i + 1;
            newP.appendChild(newContent);
            newDiv.appendChild(newP);

            var currentDiv = document.getElementById("mapDiv");

            //console.log(marker.attributes.Pump);
            document.body.insertBefore(newDiv, currentDiv);
            document.getElementById(marker.attributes.Modell).innerHTML =
                `Nummer på kartan: ${numbersObj[marker.attributes.Modell].join(', ')}`;
            if (marker.attributes.Pump != undefined) {
                document.getElementById(marker.attributes.Pump).innerHTML =
                    `Nummer på kartan: ${numbersObj[marker.attributes.Pump].join(', ')}`;
            }
        }
    });
    map.off("moveend");
});

let id = new URL(window.location.href).searchParams.get('id');

/**
  * load - Load objects(markers, polylines, polygons) to the map using json
  * data
  *
  * @returns {void}
  */
let load = async (json) => {
    let newObj;


    let objects = {};
    let pumps = {};
    let pipes = {};

    //map.setView(json[0].center, json[0].zoom);
    let iconJson = await API.get(
        `${configuration.apiURL}/obj/categories/icon/all?token=${token}`);

    for (let i = 0; i < iconJson.length; i++) {
        let image = new Image();
        let iconSize;

        image.src = iconJson[i].Bild;
        /**
          * Scale icon image
          */
        let scaleImage = async () => {
            if (iconJson[i].Kategori != 'Förgrening') {
                iconSize = calculateAspectRatioFit(image.naturalWidth,
                    image.naturalHeight, 75, 40);
            } else {
                iconSize = { width: 20, height: 20 };
            }

            let icon = {
                category: iconJson[i].Kategori,
                icon: L.icon({
                    iconAnchor: [iconSize.width / 2, iconSize.height / 2],
                    iconSize: [iconSize.width, iconSize.height],
                    iconUrl: iconJson[i].Bild,
                    popupAnchor: [0, -(iconSize.height / 2)]
                })
            };

            icons.push(icon);
        };

        image.onload = await scaleImage();
    }


    //Loop through json data.
    for (let i = 1; i < json.length; i++) {
        let id = "";
        let listName = "";
        let popup;
        let icon;

        switch (json[i].type) {
            //if marker add it to the map with its options
            case "marker":
                icon = icons.find(element =>
                    element.category == json[i].attributes.Kategori);

                newObj = new Marker(json[i].coordinates, json[i].attributes, icon.icon,
                    json[i].id);

                if (json[i].attributes != undefined &&
                    json[i].attributes.Kategori != "Förgrening" &&
                    json[i].attributes.Kategori != "Utsläppspunkt") {
                    if (!objects.hasOwnProperty(json[i].attributes.Modell)) {
                        let id;

                        if (json[i].attributes.RSK != undefined) {
                            id = `<td>RSK: ${json[i].attributes.RSK}</td>`;
                        } else if (json[i].attributes.ArtikelNr != undefined) {
                            id = `<td>Artikelnummer: ${json[i].attributes.ArtikelNr}</td>`;
                        } else {
                            id = `<td></td>`;
                        }

                        table.innerHTML +=
                            `<td>${json[i].attributes.Modell}</td>
						<td id="${json[i].attributes.Modell}Amount">Antal: 1</td>
						<td>Kategori: ${json[i].attributes.Kategori}</td>
						${id}
						<td id="${json[i].attributes.Modell}"></td>
						<td class="right">
							Kostnad <input type="number" class='number-input' value=''/>
						</td>`;

                        if (json[i].attributes.Pump != undefined &&
                            !pumps.hasOwnProperty(json[i].attributes.Pump)) {
                            table.innerHTML +=
                                `<td>${json[i].attributes.Pump}</td>
    						<td id="${json[i].attributes.Pump}Amount">Antal:
                                ${parseInt(json[i].attributes["Antal pumpar"])}</td>
    						<td>Kategori: Pump</td>
    						<td></td>
    						<td id="${json[i].attributes.Pump}"></td>
    						<td class="right">
    							Kostnad <input type="number" class='number-input' value=''/>
    						</td>`;
                            pumps[json[i].attributes.Pump] = {
                                antal: parseInt(json[i].attributes["Antal pumpar"]) };
                        } else if (json[i].attributes.Pump != undefined) {
                            pumps[json[i].attributes.Pump].antal += parseInt(
                                json[i].attributes["Antal pumpar"]);
                            document.getElementById(`${json[i].attributes.Pump}Amount`).innerHTML =
                                `<td>Antal: ${parseInt(pumps[json[i].attributes.Pump].antal)}</td>`;
                        }
                        objects[json[i].attributes.Modell] = { antal: 1 };
                    } else {
                        objects[json[i].attributes.Modell].antal += 1;
                        document.getElementById(`${json[i].attributes.Modell}Amount`).innerHTML =
                            `<td>Antal: ${objects[json[i].attributes.Modell].antal}</td>`;
                        if (json[i].attributes.Pump != undefined) {
                            pumps[json[i].attributes.Pump].antal += parseInt(
                                json[i].attributes["Antal pumpar"]);
                            document.getElementById(`${json[i].attributes.Pump}Amount`).innerHTML =
                                `<td>Antal: ${parseInt(pumps[json[i].attributes.Pump].antal)}</td>`;
                        }
                    }
                }

                break;
                //if polyline
            case "polyline":
                newObj = new Pipe(json[i].coordinates, ["", ""], json[i].pipeType,
                    json[i].connected_with.first);
                newObj.draw(json[i].connected_with.last,
                    null, json[i].dimension, json[i].tilt);

                id = "Ledning";

                if (json[i].pipeType == 1) { id = "Stamledning"; }

                listName = id+json[i].material+json[i].dimension.outer;
                if (!pipes.hasOwnProperty(listName)) {
                    table.innerHTML +=
                        `<td>${id}</td>
                        <td id="${listName}">${Math.round(json[i].length)} m</td>
                        <td>Material: ${json[i].material}</td>
                        <td>Dimension: ${json[i].dimension.outer}</td>
                        <td></td>
                        <td class="right">
                        Kostnad <input type="number" class='number-input' value=''/>
                        </td>`;

                    pipes[listName] = {"material": json[i].material, "dimension": json[i].dimension,
                        "length": json[i].length, "pipeType": json[i].pipeType};
                } else {
                    pipes[listName].length += json[i].length;
                    document.getElementById(listName).innerHTML =
                        `<td>${Math.round(pipes[listName].length)} m</td>`;
                }

                break;
            case "polygon":
                newObj = new House(json[i].coordinates[0], ["", ""], json[i].color);
                popup = [
                    json[i].address,
                    json[i].definition,
                    json[i].nop,
                    json[i].flow,
                    json[i].color
                ];

                newObj.drawFromLoad(json[i].coordinates, popup);
                break;
        }
    }


    //Create Summary
    let row = table.insertRow(-1);

    row.insertCell(0).innerHTML = "Totala kostnaden: ";
    row.insertCell(1).innerHTML = "";
    row.insertCell(2).innerHTML = "";
    row.insertCell(3).innerHTML = "";
    row.insertCell(4).innerHTML = "";
    let cost = row.insertCell(5);

    cost.id = 'displayCost';
    cost.innerHTML = "0 kr";
    cost.className = "right";

    //let strValue = table.children[0].children[0].children[1].innerHTML;
    //console.log(stringToNumber(strValue));

    let inputs = document.getElementsByClassName('number-input');

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("input", () => {
            let costInput = document.getElementsByClassName("number-input");
            let totalCost = 0;

            for (let i = 0; i < costInput.length; i++) {
                if (costInput[i].value.length > 0) {
                    let strValue = table.children[i].children[0].children[1].innerHTML;
                    let multiplier = stringToNumber(strValue);

                    totalCost += parseInt(costInput[i].value * multiplier);
                }
            }
            document.getElementById("displayCost").innerHTML = totalCost + " kr";
        });
    }

    gridlayers();
    getBounds();
};

/**
 * fetch - fetch for map data
 *
 * @returns {void}
 */
let fetch = async () => {
    let json = await API.get(`${configuration.apiURL}/proj/data/${id}?token=${token}`);

    if (json[0].data.length > 0) {
        load(json[0].data);
    }
}

fetch();

/**
 * stringToNumber
 *
 * @returns {string} ret
 */
const stringToNumber = (strValue) => {
    let number = strValue.split(" ");
    let ret = "No Number";

    for (let i = 0; i < number.length; i++) {
        if (!isNaN(number[i])) {
            return parseInt(number[i]);
        }
    }

    return ret;
};

/**
 * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth width of source image
 * @param {Number} srcHeight height of source image
 * @param {Number} maxWidth maximum available width
 * @param {Number} maxHeight maximum available height
 * @return {Object} { width, height }
 */
function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
}

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
        this.marker = new L.Marker(latlng, options.marker(icon));

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
    constructor(latlng, attributes, color) {
        this.completed = false;
        this.attributes = attributes;
        this.polygon = L.polygon([latlng], options.house(color));
    }

    /**
     * draw - Adds new point with coordinates and displays polygon on map.
     * 		- Updates guideline start position to new coordinates
     *
     * @param {array} latlng Coordinates (latitude and longitude) for the new point in polygon
     *
     * @returns {void}
     */

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
    drawFromLoad(latlngs, values) {
        this.polygon.setLatLngs(latlngs);
        this.polygon.bindPopup(popup.house(values[0], values[1], values[2], values[3], values[4]));
        polygons.addLayer(this.polygon).addTo(map);

        this.polygon.address = values[0];
        this.polygon.definition = values[1];
        this.polygon.nop = values[2];
        this.polygon.flow = values[3];
        this.polygon.id = this.polygon._leaflet_id;
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
    draw(id, latlng = null, dimension = null, tilt = null) {
        this.last = id;
        if (latlng != null) { this.latlngs.push(latlng); }
        this.dimension = dimension;
        this.tilt = tilt;

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

//SDFS
document.getElementById("printMateriallist").addEventListener('click', () => {
    window.print();
});

document.getElementById("backToMap").addEventListener('click', () => {
    document.location.href = "map.html?id=" + id;
});
