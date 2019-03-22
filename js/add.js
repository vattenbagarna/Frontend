/* global L */
let startPolyline = null;

let latLngs;

export let polygon = null;
export let guideline = null;

export let polylines = L.layerGroup();
export let markers = L.layerGroup();
export let polygons = L.layerGroup();

//imports the map object
import {
    map,
    pipeChoice
} from "./loadLeafletMap.js";

import {
    edit
} from "./edit.js";

import {
    show
} from "./show.js";

export const add = {
    activeObjName: "",
    activeIcon: "",

    /**
     * AddMarker - Adds a "marker" to the map, markers is also known as pumps.
     *
     * @param {object} event
     * @returns {void}
     */
    marker: (event) => {
        //Create marker object
        const temp = new L.Marker(event.latlng, {
                "draggable": "true",
                "icon": add.activeIcon
            }).bindPopup(
                `<b>${add.activeObjName}<br>`)
            .on(
                "drag", edit.moveMarker);

        //Adds marker to map
        markers.addLayer(temp).addTo(map);
    },

    /**
     * addHouse - Adds a polygon to the map, polygons is used to mark houses.
     *
     * @param {object} event
     * @returns {void}
     */
    house: (event) => {
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

            map.on('mousemove', add.guideLine);
        }
    },

    /**
     * guideLine - Shows a guideline for the user when creating polygons.
     *
     * @param {object} event
     * @returns {void}
     */
    guideLine: (event) => {
        let coord = guideline.getLatLngs();

        coord.pop();
        coord.push(event.latlng);
        guideline.setLatLngs(coord);
    },

    /**
     * addPipe - Draws polylines on the map, polylines is also known as pipes.
     *
     * @param {object} event event.
     * @returns {void}
     */
    pipe: (event) => {
        let target = event.target;
        let temp;

        target.closePopup();

        //If startPolyline is null create the first point
        if (startPolyline != null) {
            if (target.getLength) {
                let endPoint = addBranchConnection(startPolyline, event, target);

                if (pipeChoice == "pipe") {
                    temp = new L.polyline([startPolyline.latlng, endPoint.latlng], {
                        edit_with_drag: true,
                        vertices: {
                            destroy: true,
                            first: false,
                            last: false,
                            insert: true,
                            middle: true,
                        }
                    });
                } else if (pipeChoice == "stemPipe") {
                    temp = new L.polyline([startPolyline.latlng, endPoint.latlng], {
                        id: "stemPipe",
                        weight: 5,
                        color: "red",
                        edit_with_drag: true,
                        vertices: {
                            destroy: true,
                            first: false,
                            last: false,
                            insert: true,
                            middle: true,
                        }
                    });
                }


                temp.connected_with = {
                    first: startPolyline.id,
                    last: endPoint.id
                };

                show.openModal();

                document.getElementById("pipeSpecifications").onclick = () => {
                    let modal = document.getElementById("myModal");
                    let dimension = document.getElementById("dimension");
                    let tilt = document.getElementById("tilt");

                    modal.style.display = "none";
                    polylines.addLayer(temp).addTo(map);

                    temp.dimension = dimension.value;
                    temp.tilt = tilt.value;
                    temp.bindPopup(
                        `<b>Rör</b><br>
						<label>Inner Dimension</label>
						<input type="text" id="dimension" name="dimension" placeholder="${temp.dimension}">
						<label>Lutning</label>
						<input type="text" id="tilt" name="tilt" placeholder="${temp.tilt}">
						<input type="button" value="Skicka">`
                    );
                    temp.editingDrag.removeHooks();
                    temp.on('click', add.pipe);

                    startPolyline = null;
                    calcLengthFromPipe(temp);
                }

            } else {
                if (pipeChoice == "pipe") {
                    temp = new L.polyline([startPolyline.latlng, event.latlng], {
                        edit_with_drag: true,
                        vertices: {
                            destroy: true,
                            first: false,
                            last: false,
                            insert: true,
                            middle: true,
                        }
                    });
                } else if (pipeChoice == "stemPipe") {
                    temp = new L.polyline([startPolyline.latlng, event.latlng], {
                        id: "stemPipe",
                        weight: 5,
                        color: "red",
                        edit_with_drag: true,
                        vertices: {
                            destroy: true,
                            first: false,
                            last: false,
                            insert: true,
                            middle: true,
                        }
                    });
                }


                temp.connected_with = {
                    first: startPolyline.id,
                    last: event.sourceTarget._leaflet_id
                };

                show.openModal();
                document.getElementById("pipeSpecifications").onclick = () => {
                    let modal = document.getElementById("myModal");
                    let dimension = document.getElementById("dimension");
                    let tilt = document.getElementById("tilt");

                    modal.style.display = "none";
                    polylines.addLayer(temp).addTo(map);

                    temp.dimension = dimension.value;
                    temp.tilt = tilt.value;
                    temp.bindPopup(
                        `<b>Rör</b><br>
						<label>Inner Dimension</label>
						<input type="text" id="dimension" name="dimension" placeholder="${temp.dimension}">
						<label>Lutning</label>
						<input type="text" id="tilt" name="tilt" placeholder="${temp.tilt}">
						<input type="button" value="Skicka">`
                    );
                    temp.editingDrag.removeHooks();
                    temp.on('click', add.pipe);

                    startPolyline = null;
                    calcLengthFromPipe(temp);
                }
            }
        } else if (target.getLength) {
            startPolyline = [];
            startPolyline.latlng = event.latlng;
            startPolyline.id = event.sourceTarget._leaflet_id;

            let startPoint = addBranchConnection(startPolyline, event, target);

            startPolyline.latlng = startPoint.latlng;
            startPolyline.id = startPoint.id;
        } else {
            startPolyline = [];
            startPolyline.latlng = event.latlng;
            startPolyline.id = event.sourceTarget._leaflet_id;
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
    }
};

/**
 * calcLengthFromPipe - Gets an individual polyline and calculates the length.
 *
 * @param {array} array
 * @returns {void}
 */
export let calcLengthFromPipe = (polyline) => {
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
};

/**
 * addBranchConnection - Description
 *
 * @param {type} startPolyline Description
 * @param {type} event         Description
 * @param {type} target        Description
 *
 * @returns {type} Description
 */
let addBranchConnection = (startPolyline, event, target) => {
    let newLetlng = target.getLatLngs();
    let endPoint = {
        latlng: newLetlng.pop(),
        id: target.connected_with.last
    };
    let temp;

    newLetlng.push(event.latlng);
    target.setLatLngs(newLetlng);

    let url = 'https://cdn4.iconfinder.com/data/icons/bathroom-accessory-outline/32/14-512.png';

    let branchMarker = new L.Marker(event.latlng, {
            draggable: true,
            icon: L.icon({
                iconAnchor: [19.5, 19.5],
                iconSize: [39, 39],
                iconUrl: url,
                popupAnchor: [0, -19.5]
            })
        }).bindPopup(
            `<b>Förgrening<br>`)
        .on("drag", edit.moveMarker);

    markers.addLayer(branchMarker).addTo(map);
    branchMarker.on('click', add.pipe);

    target.connected_with.last = branchMarker._leaflet_id;
    if (target.options.id == "stemPipe") {
        temp = new L.polyline([event.latlng, endPoint.latlng], {
            id: "stempipe",
            weight: 5,
            color: "red",
            edit_with_drag: true,
            vertices: {
                destroy: true,
                first: false,
                last: false,
                insert: true,
                middle: true,
            }
        });
    } else {
        temp = new L.polyline([event.latlng, endPoint.latlng], {
            edit_with_drag: true,
            vertices: {
                destroy: true,
                first: false,
                last: false,
                insert: true,
                middle: true,
            }
        });
    }

    temp.connected_with = {
        first: target.connected_with.last,
        last: endPoint.id
    };

    temp.dimension = target.dimension;
    temp.tilt = target.tilt;
    temp.bindPopup(
        `<b>Rör</b><br>
		<label>Inner Dimension</label>
		<input type="text" id="dimension" name="dimension" placeholder="${temp.dimension}">
		<label>Lutning</label>
		<input type="text" id="tilt" name="tilt" placeholder="${temp.tilt}">
		<input type="button" value="Skicka">`
    );
    polylines.addLayer(temp).addTo(map);
    temp.editingDrag.removeHooks();
    temp.on('click', add.pipe);

    calcLengthFromPipe(temp);


    return {
        latlng: branchMarker._latlng,
        id: branchMarker._leaflet_id
    };
};

export let clear = () => {
    polygon = null;
    guideline = null;
};

export let clearStartPolyline = () => {
    startPolyline = null;
};
