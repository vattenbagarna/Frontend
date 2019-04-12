/*global L*/
import { map } from "./loadLeafletMap.js";

import { popup } from "./popup.js";

import { options } from "./options.js";

import { polylines, markers, polygons, add, getLength, clearHouse } from "./add.js";

import { edit } from "./edit.js";

import { show } from "./show.js";

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
     *
     * @returns {void}
     */
    constructor(latlng, attributes, icon) {
        this.attributes = attributes;

        this.marker = new L.Marker(latlng, options.marker(icon))
            // Popup behöver uppdateras med backend
            .bindPopup(popup.marker(this.attributes) + popup.changeCoord(latlng))
            .on("drag", edit.moveMarker)
            .on('popupopen', this.updateCoords);

        this.marker.attributes = attributes;

        // Adds marker to map
        markers.addLayer(this.marker).addTo(map);
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
            let lat = document.getElementById('latitud').value;
            let lng = document.getElementById('longitud').value;

            // Close active popup
            event.target.closePopup();
            // Insert new values to active marker
            event.target.setLatLng([lat, lng]);
            // Move center to map to new values (coordinates)
            map.panTo([lat, lng]);
            // Update popup content with new values
            event.target.setPopupContent(popup.marker(add.activeObjName) +
                popup.changeCoord({ lat: lat, lng: lng }));
        });
    }
}

/**
 * House - Class for creation of house and underlying functionality for each
 */
export class House {
    /**
     * constructor - Creates a L.polygon with preconfiged attributes from options.js and popup.js
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
        this.attributes = attributes;
        this.polygon = L.polygon([latlng], options.house);

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

        coord.shift();
        coord.unshift(latlng);
    }


    /**
     * drawFromLoad - Description
     *
     * @param {type} latlngs           Description
     * @param {null} [address=null]    Description
     * @param {null} [definition=null] Description
     * @param {null} [nop=null]        Description
     * @param {null} [flow=null]       Description
     *
     * @returns {type} Description
     */
    drawFromLoad(latlngs, address = null, definition = null, nop = null, flow = null) {
        this.polygon.setLatLngs(latlngs);
        this.polygon.bindPopup(popup.house(address, definition, nop, flow));
        polygons.addLayer(this.polygon).addTo(map);

        this.polygon.address = address;
        this.polygon.definition = definition;
        this.polygon.nop = nop;
        this.polygon.flow = flow;

        map.off('mousemove', this.updateGuideLine);
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
        // Behövs kommenteras
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
                if (guideline != null && this.polygon != null) {
                    let addr;

                    L.esri.Geocoding.reverseGeocode()
                        .latlng(this.polygon._latlngs[0][0])
                        .run((error, result) => {
                            addr = result.address.Match_addr;

                            this.polygon.bindPopup(popup.house(addr, "Hus", 5,
                                "150 l/person"));
                            this.polygon.address = addr;
                        });

                    this.polygon.definition = "Hus";
                    this.polygon.nop = 5;
                    this.polygon.flow = "150 l/person";
                    map.off('mousemove', this.updateGuideLine);
                    guideline.remove();
                    clearHouse();
                }
            }
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
     * draw - Creates a L.polyline with preconfiged attributes from options.js and popup.js and type
     * 		- @see {@link https://leafletjs.com/reference-1.4.0.html#polyline}
     * 		- Set connected_with values so the object knows what is it connected to
     * 		- Set length for new polyline
     * 		- Displays new polyline on map
     *
     * @param {let} id            Unique number to last connected_with
     * @param {array} [latlng=null] Option to push new point into new polyline
     * @param {null} [dimension=null] Description
     * @param {null} [tilt=null]      Description
     *
     * @returns {void}
     **/
    draw(id, latlng = null, dimension = null, tilt = null) {
        this.last = id;
        if (latlng != null) { this.latlngs.push(latlng); }

        if (dimension == null && tilt == null) {
            show.openModal(document.getElementById('pipeModal'));

            document.getElementById("pipeSpecifications").onclick = () => {
                let modal = document.getElementById("pipeModal");
                let dimension = document.getElementById("dimension");
                let tilt = document.getElementById("tilt");


                modal.style.display = "none";

                this.dimension = dimension.value;
                this.tilt = tilt.value;

                this.createPolyline();
            };
        } else {
            this.dimension = dimension;
            this.tilt = tilt;

            this.createPolyline();
        }
    }

    /**
     * createPolyline - Description
     *
     * @returns {type} Description
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
        this.polyline.bindPopup(popup.pipe(this.dimension, this.tilt));
        this.polyline.length = getLength(this.polyline);
        this.polyline.type = this.type;
        this.polyline.dimension = this.dimension;
        this.polyline.tilt = this.tilt;
        this.polyline.on('click', add.pipe);
        polylines.addLayer(this.polyline).addTo(map);
        this.polyline.editingDrag.removeHooks();
    }
}
