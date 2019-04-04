/*global L*/
import { map } from "./loadLeafletMap.js";

import { popup } from "./popup.js";

import { options } from "./options.js";

import { polylines, markers, polygons, add, getLength, clearHouse } from "./add.js";

import { edit } from "./edit.js";

export let guideline = null;

/**
 * Marker - Description
 */
export class Marker {
    /**
     * constructor - Description
     *
     * @param {type} latlng     Description
     * @param {type} attributes Description
     * @param {type} icon       Description
     *
     * @returns {type} Description
     */
    constructor(latlng, attributes, icon) {
        this.attributes = attributes;

        this.marker = new L.Marker(latlng, options.marker(icon))
            .bindPopup(popup.marker(this.attributes[0]) + popup.changeCoord(latlng))
            .on("drag", edit.moveMarker)
            .on('popupopen', this.updateCoords);

        //Adds marker to map
        markers.addLayer(this.marker).addTo(map);
    }

    /**
     * updateCoords - Description
     *
     * @param {type} event Description
     *
     * @returns {type} Description
     */
    updateCoords(event) {
        //behövs kommenteras
        let buttons = document.getElementsByClassName('sendCoords');

        buttons[buttons.length - 1].addEventListener('click', () => {
            let lat = document.getElementById('latitud').value;
            let lng = document.getElementById('longitud').value;

            event.target.closePopup();
            event.target.setLatLng([lat, lng]);
            map.panTo([lat, lng]);
            event.target.setPopupContent(popup.marker(add.activeObjName) +
                popup.changeCoord({ lat: lat, lng: lng }));
        });
    }
}

/**
 * House - Description
 */
export class House {
    /**
     * constructor - Description
     *
     * @param {type} latlng     Description
     * @param {type} attributes Description
     *
     * @returns {type} Description
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
     * draw - Description
     *
     * @param {type} latlng Description
     *
     * @returns {type} Description
     */
    draw(latlng) {
        this.polygon.addLatLng(latlng);
        polygons.addLayer(this.polygon).addTo(map);

        let coord = guideline.getLatLngs();

        coord.shift();
        coord.unshift(latlng);
    }

    /**
     * updateGuideLine - update the guideline coordinates from mousemove.
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
     * stopDrawListener - Description
     *
     * @returns {type} Description
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
                            this.polygon.definition = "Hus";
                            this.polygon.nop = 5;
                            this.polygon.flow = "150 l/person";
                            map.off('mousemove', this.updateGuideLine);
                            guideline.remove();
                            clearHouse();
                        });
                }
            }
        }), { once: true };
    }
}

/**
 * Pipe - Description
 */
export class Pipe {
    /**
     * constructor - Description
     *
     * @param {type} latlngs    Description
     * @param {type} attributes Description
     * @param {type} type       Description
     * @param {type} id         Description
     *
     * @returns {type} Description
     */
    constructor(latlngs, attributes, type, id) {
        this.latlngs = latlngs;
        this.attribute = attributes;
        this.type = type;
        this.first = id;
    }

    /**
     * draw - Description
     *
     * @param {type} dimension     Description
     * @param {type} tilt          Description
     * @param {type} id            Description
     * @param {null} [latlng=null] Description
     *
     * @returns {type} Description
     */
    draw(dimension, tilt, id, latlng = null) {
        this.dimension = dimension;
        this.tilt = tilt;
        this.last = id;

        if (latlng != null) { this.latlngs.push(latlng); }

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
        this.polyline.on('click', add.pipe);
        polylines.addLayer(this.polyline).addTo(map);
        this.polyline.editingDrag.removeHooks();
    }
}
