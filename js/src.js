/* global L, data */
let startPolyline = null;

let polygon = null;
let latLngs;
let guideline = null;
let mouseCoord = null;
let isEdit = null;
let tempPolylineArray = [];

let polylines = L.layerGroup();
let markers = L.layerGroup();
let polygons = L.layerGroup();
const popupPump =
    `<b>RSK:</b> 5890162<br>
<b>ArtikelNr:</b> BPS200<br>
<b>slang:</b> 32<br>
<b>invGanga:</b> g 32<br>
<b>Fas:</b> 1<br>
<b>Volt:</b> 230<br>
<b>Motoreffekt:</b> 0.2<br>
<b>Markström:</b> 1<br>
<b>varvtal:</b> 2900<br>
<b>kabeltyp:</b> H05RNF/H07RNF<br>
<b>kabellängd:</b> 10<br>
<b>vikt:</b> 5`;

//imports the map object
import {
    map
} from "./loadLeafletMap.js";

export const object = {
    'activeObjName': "",
    'activeIcon': "",

    /**
	 * AddMarker - Adds a "marker" to the map, markers is also known as pumps.
     *
     * @param {object} event
	 * @returns {void}
	 */
    addMarker: (event) => {
        //Create marker object
        const temp = new L.Marker(event.latlng, {
            "draggable": "true",
            "icon": object.activeIcon
        }).bindPopup(
            `<b>${object.activeObjName}<br>`)
            .on(
                "drag", object.movePipe);

        //Adds marker to map
        markers.addLayer(temp).addTo(map);
    },

    /**
	 * addHouse - Adds a polygon to the map, polygons is used to mark houses.
     *
     * @param {object} event
	 * @returns {void}
	 */
    addHouse: (event) => {
        if (polygon != null) {
            polygon.addLatLng(event.latlng);
            polygons.addLayer(polygon).addTo(map);

            let coord = guideline.getLatLngs();

            coord.shift();
            coord.unshift(event.latlng);
        } else {
            latLngs = [event.latlng];
            polygon = L.polygon(latLngs, {
                color: 'blue',
                fillColor: '#3388ff',
                fillOpacity: 0.5,
                weight: 1.5
            });

            guideline = L.polyline([event.latlng, event.latlng], {
                dashArray: '5, 10'
            }).addTo(map);

            map.on('mousemove', object.showGuideLine);
        }
    },

    /**
	 * showGuideLine - Shows a guideline for the user when creating polygons.
     *
     * @param {object} event
	 * @returns {void}
	 */
    showGuideLine: (event) => {
        let coord = guideline.getLatLngs();

        coord.pop();
        coord.push(event.latlng);
        guideline.setLatLngs(coord);
    },

    /**
     * redraw - Draws polylines on the map, polylines is also known as pipes.
     *
     * @param {object} event event.
     * @returns {void}
     */
    redraw: (event) => {
        event.target.closePopup();

        //If startPolyline is null create the first point
        if (startPolyline != null) {
            const temp = new L.polyline([startPolyline.latlng,
                event.latlng
            ], {
                "edit_with_drag": true,
                "vertices": {
                    "destroy": true,
                    "first": false,
                    "last": false,
                    "insert": true,
                    "middle": true,
                }
            });

            temp.connected_with = {
                "first": startPolyline.id,
                "last": event.sourceTarget._leaflet_id
            };

            polylines.addLayer(temp).addTo(map);
            temp.editingDrag.removeHooks();
            startPolyline = null;
        } else {
            startPolyline = [];
            startPolyline.latlng = event.latlng;
            startPolyline.id = event.sourceTarget._leaflet_id;
        }
    },

    /**
     * movePipe - Moves a marker and connected polyline follows.
     *
     * @param {object} event
     * @returns {void}
     */
    movePipe: (event) => {
        //get each polyline
        polylines.eachLayer((polyline) => {
            //check if polylines are connected to a marker, by first point and last point.
            if (event.target._leaflet_id ===
                //if polyline is connected with marker change lat lng to match marker
                polyline.connected_with
                    .first) {
                let newLatlng = polyline.getLatLngs();

                newLatlng.shift();
                newLatlng.unshift(event.latlng);

                polyline.setLatLngs(newLatlng);
            } else if (event.target._leaflet_id ===
                polyline.connected_with
                    .last) {
                let newLatlng = polyline.getLatLngs();

                newLatlng.pop();
                newLatlng.push(event.latlng);
                polyline.setLatLngs(newLatlng);
            }
        });
    },

    /**
     * editPolylines - Makes polylines editable by adding hooks and dragging.
     * library?
     *
     * @returns {void}
     */
    editPolylines: () => {
        tempPolylineArray = [];

        polylines.eachLayer((polyline) => {
            polyline.editingDrag.addHooks();
            tempPolylineArray.push(polyline._latlngs.length);
        });

        isEdit = true;
    },

    /**
     * activeObj - Shows which object is clicked in the sidebar menu by adding
     * and removing the active class
     *
     * @param {object} event
     * @returns {void}
     */
    activeObj: () => {
        const obj = document.getElementsByClassName("obj");

        //gets all buttons and adds a click event to each.
        for (let i = 0; i < obj.length; i++) {
            obj[i].parentElement.addEventListener("click", function() {
                let current = document.getElementsByClassName(
                    "active");

                //if current have the class "active" replace it with "".
                if (current.length > 0) {
                    current[0].className =
                        current[0].className.replace(
                            " active",
                            "");
                }

                current = document.getElementsByClassName(
                    "active3");
                if (current.length > 0) {
                    current[0].className = current[0].className
                        .replace(
                            " active3",
                            "");
                }

                //clicked object gets the class active
                this.className += " active";
                object.clearMapsEvents();
            });
        }
    },

    /**
     * activeCustomControl - Shows which button is active from the leaflet
     * custom control buttons.
     *
     * @param {object} event
     * @returns {void}
     */
    activeCustomControl: (event) => {
        let current = document.getElementsByClassName("active");

        if (current.length > 0) {
            current[0].className = current[0].className.replace(
                " active",
                "");
        }

        current = document.getElementsByClassName("active3");

        if (current.length > 0) {
            current[0].className = current[0].className.replace(
                " active3",
                "");
        }
        if (event.target.localName == 'div') {
            event.target.className += " active3";
        } else {
            event.target.parentElement.className += " active3";
        }
    },

    /**
     * clearMapsEvents - Clear the map from events.
     *
     * @returns {void}
     */

    clearMapsEvents: () => {
        //Gets each polylines and removes the "editing hooks".
        polylines.eachLayer((polyline) => {
            polyline.closePopup();
            polyline.editingDrag.removeHooks();
        });

        //Turn off click events for markers and polylines.
        map.off("click", object.addMarker);
        map.off('click', object.addPolygone);

        if (isEdit == true) {
            var i = 0;

            polylines.eachLayer((polyline) => {
            if (polyline._latlngs.length != tempPolylineArray[i]) {
                object.calcLengthFromPipe(polyline);
                polyline.bindPopup("Längd: " + Math.round(polyline.getLength * 100) / 100 + "m");
                console.log(polyline.getLength);
            }
            i++;
            });

            isEdit = null;
        }

        //remove guideline from polygon.
        if (guideline != null) {
            map.off('mousemove', object.showGuideLine);
            guideline.remove();
            guideline = null;
            polygon = null;
        }
        document.getElementById("map").style.cursor = "grab";

        //Closes popups and turns off click events for remove and redraw.
        map.closePopup();
        map.eachLayer((layer) => {
            layer.off("click", object.remove);
            layer.off("click", object.redraw);
        });
    },

    /**
     * stopEdit - Stops the drawing of a polygon.
     *
     * @returns {void}
     */
    stopEdit: () => {
        //if user is still drawing a polygon, stop it.
        if (guideline != null && polygon != null) {
            map.off('mousemove', object.showGuideLine);
            guideline.remove();
            polygon.bindPopup("<b> This is a House </b>");
            polygon = null;
        }
    },

    /**
     * remove - Removes objects from the map.
     *
     * @param {object} event
     * @returns {void}
     */
    remove: (event) => {
        //remove polylines, markers and polygons when clicked
        polylines.removeLayer(event.sourceTarget);
        markers.removeLayer(event.sourceTarget);
        polygons.removeLayer(event.sourceTarget);
    },

    /**
     * save - Saves the objects from the map in a json format.
     *
     * @returns {void}
     */
    save: () => {
        const jsonArray = [];

        //loop through all polylines and save them in a json format
        polylines.eachLayer((polyline) => {
            let temp = {
                "coordinates": polyline._latlngs,
                "type": "polyline",
                "connected_with": polyline.connected_with,
                "options": polyline.options,
            };

            jsonArray.push(temp);
        });

        //loop through all markers and save them in a json format
        markers.eachLayer((marker) => {
            let temp = {
                "coordinates": marker._latlng,
                "type": "marker",
                "options": marker.options,
                "id": marker._leaflet_id
            };

            jsonArray.push(temp);
        });

        const myJSON = JSON.stringify(jsonArray);

        console.log(myJSON);
    },

    /**
     * load - Load objects(markers, polylines, polygons) to the map using json
     * data
     *
     * @returns {void}
     */
    load: () => {
        const savedData = JSON.parse(data);
        let icon;
        let newObj;

        //Loop through json data.
        for (let i = 0; i < savedData.length; i++) {
            switch (savedData[i].type) {
                //if marker add it to the map with its options
                case "marker":
                    icon = L.icon(savedData[i].options.icon
                        .options);

                    savedData[i].options.icon = icon;
                    newObj = L.Marker(savedData[i].coordinates,
                        savedData[i].options).addTo(map).on("drag",
                        object.movePipe);

                    newObj._leaflet_id = savedData[i].id;
                    newObj.bindPopup(popupPump).openPopup();

                    markers.addLayer(newObj);
                    break;
                //if polyline
                case "polyline":
                    //get polyline options and add it to an object
                    newObj = L.polyline(savedData[i]
                        .coordinates, savedData[i].options);
                    newObj.connected_with = savedData[i].connected_with;

                    //add to map
                    polylines.addLayer(newObj).addTo(map);
                    break;
            }
        }
    },

    /**
     * showMouseCoord - Shows the user the latLngs of the mouse on the map.
     *
     * @param {object} event
     * @returns {void}
     */
    showMouseCoord: (event) => {
        if (mouseCoord == null) {
            mouseCoord = L.polyline(event.latlng).addTo(map);
        } else {
            mouseCoord.bindTooltip("lat:" + event.latlng.lat +
                ", lng:" + event.latlng.lng).openTooltip(
                event.latlng);
        }
    },

    /**
     * hideMouseCoord - Hides the latLngs from the users mouse.
     *
     * @param {object} event
     * @returns {void}
     */
    hideMouseCoord: () => {
        if (mouseCoord != null) {
            mouseCoord.remove();
            mouseCoord = null;
        }
    },

    /**
     * search - Search functionality to the map using a plugin.
     * plugin?
     *
     * @returns {void}
     */
    search: () => {
        L.esri.Geocoding.geosearch().addTo(map);
    },

    /**
     * totalDistance - Gets each pipes length and also gets the total length of
     * all pipes.
     *
     * @returns {void}
     */
    totalDistance: () => {
        var totalDistance = 0;
        var thisPipeDistance = 0;
        var firstPoint;
        var secondPoint;

        //loop each polyline and adds a function to each.
        polylines.eachLayer((polyline) => {
                var tempPolyline = polyline._latlngs;

                //if polyline only has 2 points
                if (tempPolyline.length == 2) {
                    //calculate current pipes length
                    thisPipeDistance = tempPolyline[0].distanceTo(tempPolyline[1]);
                    totalDistance += thisPipeDistance;
                    //bind a popup with length for current polyline
                    polyline.bindPopup("Längd: " + Math.round(thisPipeDistance * 100) / 100 + "m", {autoClose: false}).openPopup();
                //if polylines have more than 2 points
                } else if (tempPolyline.length > 2) {
                    for (var i = 0; i < tempPolyline.length - 1; i++) {
                        firstPoint = tempPolyline[i];
                        secondPoint = tempPolyline[i + 1];
                        thisPipeDistance += L.latLng(firstPoint).distanceTo(secondPoint);
                    }
                    totalDistance += thisPipeDistance;
                    polyline.bindPopup("Längd: " + Math.round(thisPipeDistance * 100) / 100 + "m", {autoClose: false}).openPopup();
                }
        });
    },

    calcLengthFromPipe: (polyline) => {
        var tempPolyline = polyline._latlngs;
        var thisPipeDistance = 0;

        if (tempPolyline.length == 2) {
            polyline.getLength = tempPolyline[0].distanceTo(tempPolyline[1]);
        } else if (tempPolyline.length > 2) {
            for (var i = 0; i < tempPolyline.length - 1; i++) {
                var firstPoint = tempPolyline[i];
                var secondPoint = tempPolyline[i + 1];
                thisPipeDistance += L.latLng(firstPoint).distanceTo(secondPoint);
            }
            polyline.getLength = thisPipeDistance;
        }
        //console.log(polyline.getLength);
    }
};
