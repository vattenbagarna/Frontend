/*global L API*/
import { map, projectInfo } from "./loadLeafletMap.js";

import { popup } from "./popup.js";

import { options } from "./options.js";

import { polylines, markers, polygons, add, getLength, clearHouse } from "./add.js";

import { edit } from "./edit.js";

import { show, mouseCoord } from "./show.js";

import { elevationKey } from "./getKey.js";

import { pipe } from "./pipes.js";

export let guideline = null;

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
            .on("dragend", this.dragEnd)
            .on("drag", edit.moveMarker)
            .on('popupopen', this.updateCoords);

        this.getElevation(latlng);
        this.marker.attributes = this.attributes;
        this.marker.updateElevation = (event) => { this.getElevation(event); };
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

    /**
     * updateCoords - Updates markers coordinates from user input and updates popup content with
     * 			 	- the new coordinates
     *
     * @param {object} event
     *
     * @returns {void}
     */
    updateCoords(event) {
        // Get button after popup is open
        let buttons = document.getElementsByClassName('sendCoords');

        // Add event listener on click on button
        buttons[buttons.length - 1].addEventListener('click', () => {
            // Get new values after click
            let latLng = L.latLng(
                parseFloat(document.getElementById('latitud').value),
                parseFloat(document.getElementById('longitud').value)
            );

            // Close active popup
            event.target.closePopup();
            // Insert new values to active marker
            event.target.setLatLng(latLng);
            // Move center to map to new values (coordinates)
            map.panTo(latLng);

            //get each polyline
            polylines.eachLayer((polyline) => {
                //check if polylines are connected to a marker, by first point and last point.
                if (event.target.id === polyline.connected_with.first) {
                    //if polyline is connected with marker change lat lng to match marker
                    let newLatlng = polyline.getLatLngs();

                    newLatlng.shift();
                    newLatlng.unshift(latLng);

                    polyline.setLatLngs(newLatlng);
                    polyline.decorator.setPaths(newLatlng);
                } else if (event.target.id === polyline.connected_with.last) {
                    let newLatlng = polyline.getLatLngs();

                    newLatlng.pop();
                    newLatlng.push(latLng);

                    polyline.setLatLngs(newLatlng);
                    polyline.decorator.setPaths(newLatlng);
                }
            });
            // Update popup content with new values
            event.target.setPopupContent(popup.marker(this.attributes) + popup.changeCoord(latLng));
        });
    }

    /**
     * dragEnd - Update elevation values for marker and connected polylines when user stop dragging
     *
     * @param {type} event
     *
     * @returns {void}
     */
    dragEnd(event) {
        event.target.updateElevation(event);
        //get each polyline
        polylines.eachLayer(async (polyline) => {
            //check if polylines are connected to a marker, by first point and last point.
            if (event.target.id === polyline.connected_with.first) {
                //update elevation for polyline
                polyline.elevation = await polyline.updateElevation(polyline._latlngs);
            } else if (event.target.id === polyline.connected_with.last) {
                //update elevation for polyline
                polyline.elevation = await polyline.updateElevation(polyline._latlngs);
            }
        });
    }

    /**
     * getElevation - Gets elevation on a location using Google elevation API.
     *
     * @param {event} event
     *
     * @returns {void}
     **/
    async getElevation(event) {
        let latlngString = "";
        let latlngObj = {};

        if ("target" in event) {
            latlngString = event.target._latlng.lat + "," + event.target._latlng.lng;
            latlngObj = { lat: event.target._latlng.lat, lng: event.target._latlng.lng };
        } else {
            latlngString = event.lat + "," + event.lng;
            latlngObj = { lat: event.lat, lng: event.lng };
        }
        let url = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com" +
            "/maps/api/elevation/json?locations=" + latlngString + "&key=" + elevationKey;

        let response = await API.get(url);

        if ("target" in event) {
            event.target.elevation = response.results[0].elevation.toFixed(2);
            this.attributes["M ö.h"] = event.target.elevation;
            event.target.bindPopup(
                popup.marker(this.attributes) +
                popup.changeCoord(latlngObj));
        } else {
            this.marker.elevation = response.results[0].elevation.toFixed(2);
            this.attributes["M ö.h"] = this.marker.elevation;
            this.marker.bindPopup(popup.marker(this.attributes) +
                popup.changeCoord(latlngObj));
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

        guideline = L.polyline([latlng, latlng], {
            dashArray: '5, 10'
        }).addTo(map);

        map.on('mousemove', this.updateGuideLine);
        this.stopDrawListener();
    }

    /**
     * draw - Adds new point with coordinates and displays polygon on map.
     * 		- Updates guideline start position to new coordinates
     *
     * @param {array} latlng Coordinates (latitude and longitude) for the new point in polygon
     *
     * @returns {void}
     */
    draw(latlng) {
        this.polygon.addLatLng(latlng);
        polygons.addLayer(this.polygon).addTo(map);

        let coord = guideline.getLatLngs();

        this.polygon.id = this.polygon._leaflet_id;

        coord.shift();
        coord.unshift(latlng);
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

        map.off('mousemove', this.updateGuideLine);
        this.polygon.on('popupopen', this.updateValues);
        guideline.remove();
    }

    /**
     * updateGuideLine - update the guideline coordinates to mouse coordinates
     * 				   - from mousemove.
     *
     * @param {object} event
     * @returns {void}
     *
     **/
    updateGuideLine(event) {
        let coord = guideline.getLatLngs();

        coord.pop();
        coord.push(event.latlng);
        guideline.setLatLngs(coord);
    }

    /**
     * stopDrawListener - When user clicks the 'esc' button
     * 					- hides guideline and stops adding points to house object on click and
     * 					- adds popup content for house with address.
     * 					- Click event listener runs once
     * @returns {void}
     */
    stopDrawListener() {
        // start function when user on keyup
        document.addEventListener("keyup", (event) => {
            // If user keyup is key 'esc'
            if (event.keyCode == 27) {
                if (guideline != null && this.polygon != null && this.completed == false) {
                    this.completed = true;
                    let addr;

                    L.esri.Geocoding.reverseGeocode()
                        .latlng(this.polygon._latlngs[0][0])
                        .run((error, result) => {
                            addr = result.address.Match_addr;

                            this.polygon.bindPopup(popup.house(
                                addr,
                                "Hus",
                                projectInfo.default.peoplePerHouse,
                                projectInfo.default.litrePerPerson,
                                "#3388ff",
                            ));

                            this.polygon.address = addr;
                        });

                    this.polygon.definition = "Hus";
                    this.polygon.nop = projectInfo.default.peoplePerHouse;
                    this.polygon.flow = projectInfo.default.litrePerPerson;
                    this.polygon.on('popupopen', this.updateValues);
                    map.off('mousemove', this.updateGuideLine);
                    guideline.remove();
                    clearHouse();
                }
            }
        }), { once: true };
    }

    /**
     * updateValues - Updates house values from user input and updates popup content with
     * 			 	- the new values
     *
     * @param {object} event
     *
     * @returns {void}
     */
    updateValues(event) {
        // Get button after popup is open
        let buttons = document.getElementsByClassName('updateValuesInHouse');

        // Add event listener on click on button
        buttons[buttons.length - 1].addEventListener('click', () => {
            // Get new values after click
            let addr = document.getElementById('address').innerHTML;
            let type = document.getElementById('houseType').value;
            let newColor = document.getElementById('houseColor').value;
            let nop = document.getElementById('per').value;
            let flow = document.getElementById('cons').value;

            // Close active popup
            event.target.closePopup();

            event.target.setStyle({
                color: newColor,
                fillColor: newColor,
                fillOpacity: 0.5,
                weight: 1.5
            });

            event.target.nop = nop;
            event.target.flow = flow;
            event.target.definition = type;

            // Update popup content with new values
            event.target.setPopupContent(popup.house(addr, type, nop, flow, newColor));
        }), { once: true };
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
     * @param {null} [dim=null]			Option to add preconfigured dimension
     * @param {null} [tilt=null]      	Option to add preconfigured tilt
     *
     * @returns {void}
     **/
    async draw(id, latlng = null, elevation = null, material = null, dim = null, tilt = null) {
        this.last = id;
        if (latlng != null) { this.latlngs.push(latlng); }

        if (material == null && dim == null && tilt == null) {
            show.openModal(document.getElementById('pipeModal'));
            let elem = document.getElementsByClassName("material")[0];

            pipe.listen(elem);

            this.elevation = await this.getElevation(this.latlngs);

            document.getElementById('tilt').value = (this.elevation.highest - this.elevation.first)
                .toFixed(1);
            document.getElementById('elevation').style.display = 'block';
            document.getElementById('loading').style.display = 'none';

            document.getElementById('pipeModal').children[0].children[0].onclick = () => {
                document.getElementById("pipeModal").style.display = "none";
                document.getElementById("elevation").style.display = "none";
                document.getElementById('loading').style.display = 'block';
            };

            document.getElementById("pipeSpecifications").onclick = () => {
                document.getElementById("pipeModal").style.display = "none";
                document.getElementById("elevation").style.display = "none";
                document.getElementById('loading').style.display = 'block';
                this.material = document.getElementsByClassName('material')[0].value;
                let value = document.getElementsByClassName("dimension")[0].value;

                value = value.split(",");
                this.dimension = {
                    inner: value[0],
                    outer: value[1],
                };
                this.tilt = document.getElementById("tilt").value;

                this.createPolyline();
            };
        } else {
            this.elevation = elevation;
            this.material = material;
            this.dimension = dim;
            this.tilt = tilt;

            this.createPolyline();
        }
    }

    /**
     * createPolyline - Creates a new polyline depending on what type is choosen with preconfigured
     * 				  - options, popup, length, dimension and tilt. Lastly add the new created
     * 				  - polyline to map
     *
     * @returns {void}
     */
    async createPolyline() {
        if (this.type == 0) {
            this.polyline = new L.polyline(this.latlngs, options.pipe);
            this.polyline.decorator = L.polylineDecorator(this.polyline, {
                patterns: [{
                    offset: '28%',
                    repeat: '25%',
                    symbol: L.Symbol.arrowHead({
                        pixelSize: 15,
                        polygon: false,
                        pathOptions: {
                            stroke: true,
                            color: '#004377'
                        }
                    })
                }]
            }).addTo(map);
        } else if (this.type == 1) {
            this.polyline = new L.polyline(this.latlngs, options.stemPipe);
            this.polyline.decorator = L.polylineDecorator(this.polyline, {
                patterns: [{
                    offset: '28%',
                    repeat: '25%',
                    symbol: L.Symbol.arrowHead({
                        pixelSize: 15,
                        polygon: false,
                        pathOptions: {
                            stroke: true,
                            color: '#004377'
                        }
                    })
                }]
            }).addTo(map);
        }


        this.polyline.connected_with = {
            first: this.first,
            last: this.last
        };
        polylines.addLayer(this.polyline).addTo(map);
        this.polyline.bindPopup(popup.pipe(this.tilt));
        this.polyline.length = getLength(this.latlngs);
        this.polyline.elevation = this.elevation;
        this.polyline.updateElevation = async (latlngs) => {
            let elevation = await this.getElevation(latlngs);

            this.polyline.bindPopup(popup.pipe((elevation.highest - elevation.first).toFixed(1)));
            return elevation;
        };
        this.polyline.type = this.type;
        this.polyline.material = this.material;
        this.polyline.dimension = this.dimension;
        this.polyline.tilt = this.tilt;
        this.polyline.on('click', add.pipe);
        this.polyline.on('popupopen', this.updateValues);
        this.polyline.on('remove', () => this.polyline.decorator.remove());
        this.polyline.editingDrag.removeHooks();
        if (mouseCoord != null) {
            map.on('mousemove', show.mouseCoordOnMap);
        }
    }

    /**
     * updateValues - Updates pipe values from user input and updates popup content with
     * 			 	- the new values
     *
     * @param {object} event
     *
     * @returns {void}
     */
    updateValues(event) {
        // Get button after popup is open
        let buttons = document.getElementById('pipeSpecifications');
        let elem = document.getElementsByClassName("materialPopup");

        elem = elem[elem.length - 1];
        pipe.listen(elem);
        elem.value = event.target.material;
        elem.dispatchEvent(new Event('change'));

        let elem2 = document.getElementsByClassName("dimension");

        elem2 = elem2[elem2.length - 1];

        let option = document.createElement("option");

        option.text = event.target.dimension.outer;
        option.value = `${event.target.dimension.inner},${event.target.dimension.outer}`;
        elem2.add(option, 0);
        elem2.options[0].selected = "selected";


        // Add event listener on click on button
        buttons.addEventListener('click', () => {
            // Get new value after click
            let tilt = document.getElementById('tilt').value;
            let material = document.getElementsByClassName("materialPopup");
            let dimension = document.getElementsByClassName("dimension");

            material = material[material.length - 1];
            dimension = dimension[dimension.length - 1];
            dimension = dimension.value.split(",");
            event.target.dimension = {
                inner: dimension[0],
                outer: dimension[1],
            };


            event.target.tilt = tilt;
            event.target.material = material.value;

            // Close active popup
            event.target.closePopup();

            // Update popup content with new values
            event.target.setPopupContent(popup.pipe(tilt));
        }), { once: true };
    }

    /**
     * getElevation - Gets elevation along a path using Google elevation API.
     *
     * @returns {object} elevationObj
     **/
    async getElevation(latlngs) {
        let latlngsArray = [];
        let elevationObj = {};
        let samples = 0;

        for (var i = 0; i < latlngs.length; i++) {
            latlngsArray.push(latlngs[i].lat + "," + latlngs[i].lng);
        }
        latlngsArray = latlngsArray.join('|');
        if (Math.round(getLength(latlngs) / 2) > 500) {
            samples = 500;
        } else {
            samples = Math.round(getLength(latlngs) / 2);
        }

        let url = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com" +
            "/maps/api/elevation/json?path=" + latlngsArray + "&samples=" +
            samples + "&key=" + elevationKey;

        let response = await API.get(url);
        let highestElevation = Math.max(...response.results.map(o => o.elevation), 0);
        let lowestElevation = Math.min(...response.results.map(o => o.elevation));
        let firstElevation = response.results[0].elevation;
        let lastElevation = response.results[response.results.length - 1].elevation;

        elevationObj = {
            highest: highestElevation,
            lowest: lowestElevation,
            first: firstElevation,
            last: lastElevation
        };

        return elevationObj;
    }
}
