/* global L, data */
let startPolyline = null;

let polygon = null;
let latLngs;
let guideline = null;

let polylines = L.layerGroup();
let markers = L.layerGroup();
let polygons = L.layerGroup();
const popupPump =
    `<select name="model">
<option value="?"><b>vattenpump1</b></option>
<option value="?">vattenpump2</option>
<option value="?">vattenpump3</option>
<option value="?">vattenpump4</option>
</select><br>
<b>Typ:</b> BPS 200<br>
<b>RSK:</b> 5890162<br>
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

import {
    map
} from "./loadLeafletMap.js";


const myIcon = L.icon({
    "iconAnchor": [10, 45],
    "iconSize": [38, 45],
    "iconUrl": "img/pump.png",
    "popupAnchor": [1, -45]
});

export const object = {
    /**
     * Adds a marker to the map.
     * @param {object} event event.
     * @returns {void}
     */
    addMarker: (event) => {
        const temp = new L.Marker(event.latlng, {
            "draggable": "true",
            "icon": myIcon
        }).bindPopup(popupPump).on(
            "drag", object.movePipe);

        markers.addLayer(temp).addTo(map);
    },

    addHouse: (event) => {
        if (polygon != null) {
            polygon.bindPopup("<b> This is a House </b>");
            polygon.addLatLng(event.latlng);
            polygons.addLayer(polygon).addTo(map);

            let coord = guideline.getLatLngs();

            coord.shift();
            coord.unshift(event.latlng);
        } else {
            latLngs = [event.latlng];
            polygon = L.polygon(latLngs, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                weight: 1.5
            });

            guideline = L.polyline([event.latlng, event.latlng], {
                dashArray: '5, 10'
            }).addTo(map);

            map.on('mousemove', (e) => {
                let coord = guideline.getLatLngs();

                coord.pop();
                coord.push(e.latlng);
                guideline.setLatLngs(coord);
            });
        }
    },

    showMouseCoord: (event) => {
        if (guideline == null) {
            guideline = L.polyline(event.latlng, {
                dashArray: '5, 10'
            }).addTo(map);
        } else {
            guideline.bindTooltip("lat:" + event.latlng.lat +
                ", lng:" + event.latlng.lng).openTooltip(
                event.latlng);
        }
    },
    /**
     * Draws polylines.
     * @param {object} event event.
     * @returns {void}
     */
    redraw: (event) => {
        event.target.closePopup();

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
     *
     *
     */
    movePipe: (event) => {
        polylines.eachLayer((polyline) => {
            if (event.target._leaflet_id ===
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
     *
     *
     */
    editPolylines: () => {
        polylines.eachLayer((polyline) => {
            polyline.editingDrag.addHooks();
        });
    },
    /**
     * Changes classname on active button.
     * @returns {void}
     */
    activeObj: () => {
        const obj = document.getElementsByClassName(
            "obj");

        for (let i = 0; i < obj.length; i++) {
            obj[i].addEventListener("click", function activeClassName() {
                const current = document.getElementsByClassName(
                    "active");

                if (current.length > 0) {
                    current[0].className =
                        current[0].className.replace(
                            " active",
                            "");
                }
                this.className += " active";
                object.clearMapsEvents();
            });
        }
    },
    /**
     *
     *
     */

    clearMapsEvents: () => {
        polylines.eachLayer((polyline) => {
            polyline.editingDrag.removeHooks();
        });

        map.off("click", object.addMarker);

        if (guideline != null) {
            map.off('click', object.addPolygone);
            map.off('mousemove');
            guideline.remove();
            guideline = null;
            polygon = null;
        }
        document.getElementById("map").style.cursor = "grab";

        map.closePopup();
        map.eachLayer((layer) => {
            layer.off("click", object.remove);
            layer.off("click", object.redraw);
        });
    },

    stopEdit: () => {
        if (guideline != null) {
            guideline.remove();
            guideline = null;
            polygon = null;
        }
    },
    /**
     *
     *
     */

    remove: (event) => {
        polylines.removeLayer(event.sourceTarget);
        markers.removeLayer(event.sourceTarget);
        polygons.removeLayer(event.sourceTarget);
    },
    /**
     *
     *
     */

    save: () => {
        const jsonArray = [];

        polylines.eachLayer((polyline) => {
            let temp = {
                "coordinates": polyline._latlngs,
                "type": "polyline",
                "connected_with": polyline.connected_with,
                "options": polyline.options,
            };

            jsonArray.push(temp);
        });

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
     *
     *
     */

    load: () => {
        const savedData = JSON.parse(data);
        let icon;
        let newObj;

        for (let i = 0; i < savedData.length; i++) {
            switch (savedData[i].type) {
                case "marker":
                    icon = L.icon(savedData[i].options.icon
                        .options);

                    savedData[i].options.icon = icon;
                    newObj = new L.Marker(savedData[i].coordinates,
                        savedData[i].options).addTo(
                        map).
                        on("drag", object.movePipe);
                    newObj._leaflet_id = savedData[i].id;

                    newObj.bindPopup(popupPump).openPopup();

                    markers.push(newObj);
                    break;
                case "polyline":
                    newObj = new L.polyline(savedData[i]
                        .coordinates,
                    savedData[i].options);
                    newObj.connected_with = savedData[i]
                        .connected_with;

                    polylines.push(newObj);
                    polylines[polylines.length - 1].addTo(
                        map);
                    break;
            }
        }
    },

    search: () => {
        L.esri.Geocoding.geosearch().addTo(map);
    },


    totalDistance: () => {
        var totalDistance = 0;
        var firstPoint;
        var secondPoint;

        polylines.eachLayer((polyline) => {
            var tempPolyline = polyline._latlngs;

            if (tempPolyline.length == 2) {
                totalDistance += tempPolyline[0]
                    .distanceTo(
                        tempPolyline[1]);
            } else if (tempPolyline.length > 2) {
                for (var i = 0; i <
                    tempPolyline.length - 1; i++
                ) {
                    firstPoint = tempPolyline[i];
                    secondPoint = tempPolyline[
                        i + 1];
                    totalDistance += L.latLng(
                        firstPoint).distanceTo(
                        secondPoint);
                }
            }
        });
        console.log(totalDistance);
    }
};
