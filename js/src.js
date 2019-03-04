/* global L, data */
let startPolyline = null;
let polylines = [];
const markers = [];
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
     * Draws polylines.
     * @param {object} event event.
     * @returns {void}
     */
    redraw: (event) => {
        event.target.closePopup();
        for (let i = 0; i < polylines.length; i++) {
            polylines[i].on("click", object.redraw);
        }

        if (startPolyline !== null) {
            const temp = new L.polyline([startPolyline.latlng, event.latlng], {
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

            polylines.push(temp);
            polylines[polylines.length - 1].addTo(map);

            polylines[polylines.length - 1].editingDrag.removeHooks();


            // Få längden på polylines fungerar bara när man placerar ut den första gången

            let previousPoint;

            temp.getLatLngs().forEach((latLng) => {
                if (previousPoint) {
                    polylines[polylines.length - 1].bindPopup(
                        `Distance from previous point: ${
                            previousPoint.distanceTo(latLng).toFixed(2)
                        } meter(s)`
                    ).addTo(map).openPopup();
                }
                previousPoint = latLng;
            });
            startPolyline = null;
        } else {
            startPolyline = [];
            startPolyline.latlng = event.latlng;
            startPolyline.id = event.sourceTarget._leaflet_id;
        }
    },
    /**
     * Adds a marker to the map.
     * @param {object} event event.
     * @returns {void}
     */
    addMarker: (event) => {
        const temp = new L.Marker(event.latlng, {
            "draggable": "true",
            "icon": myIcon
        }).addTo(map).on("drag", object.movePipe);

        temp.bindPopup(popupPump).openPopup();

        markers.push(temp);
    },
    /**
     *
     *
     */
    movePipe: (event) => {
        for (let i = 0; i < polylines.length; i++) {
            if (event.target._leaflet_id === polylines[i].connected_with
                .first) {
                let newLatlng = polylines[i].getLatLngs();

                newLatlng.shift();
                newLatlng.unshift(event.latlng);

                polylines[i].setLatLngs(newLatlng);
            } else if (event.target._leaflet_id === polylines[i].connected_with
                .last) {
                let newLatlng = polylines[i].getLatLngs();

                newLatlng.pop();
                newLatlng.push(event.latlng);
                polylines[i].setLatLngs(newLatlng);
            }
        }
    },
    /**
     *
     *
     */
    editPolylines: () => {
        for (let i = 0; i < polylines.length; i++) {
            polylines[i].editingDrag.addHooks();
        }
    },
    /**
     * Changes classname on active button.
     * @returns {void}
     */
    activeObj: () => {
        const obj = document.getElementsByClassName("obj");

        for (let i = 0; i < obj.length; i++) {
            obj[i].addEventListener("click", function activeClassName() {
                const current = document.getElementsByClassName(
                    "active");

                if (current.length > 0) {
                    current[0].className =
                        current[0].className.replace(" active",
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

    arrayRemove: (arr, value) => {
        return arr.filter((ele) => ele != value);
    },
    /**
     *
     *
     */

    clearMapsEvents: () => {
        for (let i = 0; i < polylines.length; i++) {
            polylines[i].editingDrag.removeHooks();
        }

        map.off("click", object.addMarker);
        map.closePopup();

        map.eachLayer((layer) => {
            layer.off("click", object.remove);
            layer.off("click", object.redraw);
        });
    },
    /**
     *
     *
     */

    remove: (event) => {
        // Körs varje gång man tar bort ett object även om det inte är en polyline
        polylines = object.arrayRemove(polylines, event.target);
        event.target.removeFrom(map);
    },
    /**
     *
     *
     */

    save: () => {
        const jsonArray = [];

        for (let i = 0; i < polylines.length; i++) {
            let temp = {
                "coordinates": polylines[i]._latlngs,
                "type": "polyline",
                "connected_with": polylines[i].connected_with,
                "options": polylines[i].options,
            };

            jsonArray.push(temp);
        }

        for (let i = 0; i < markers.length; i++) {
            let temp = {
                "coordinates": markers[i]._latlng,
                "type": "marker",
                "options": markers[i].options,
                "id": markers[i]._leaflet_id
            };

            jsonArray.push(temp);
        }

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
                    icon = L.icon(savedData[i].options.icon.options);

                    savedData[i].options.icon = icon;
                    newObj = new L.Marker(savedData[i].coordinates,
                        savedData[i].options).addTo(map).
                        on("drag", object.movePipe);
                    newObj._leaflet_id = savedData[i].id;

                    newObj.bindPopup(popupPump).openPopup();

                    markers.push(newObj);
                    break;
                case "polyline":
                    newObj = new L.polyline(savedData[i].coordinates,
                        savedData[i].options);
                    newObj.connected_with = savedData[i].connected_with;

                    polylines.push(newObj);
                    polylines[polylines.length - 1].addTo(map);
                    break;
            }
        }
    },

    search: () => {
        L.esri.Geocoding.geosearch().addTo(map);
    },


    totalDistance: () => {
        var totalDistance = 0;
        var tempDistance = 0;
        var firstPoint;
        var secondPoint;

        for (var i = 0; i < polylines.length; i++) {
            var tempPolyline = polylines[i]._latlngs;

            if (tempPolyline.length == 2) {
                tempDistance = tempPolyline[0].distanceTo(tempPolyline[1]);
                totalDistance += tempDistance;
            } else if (tempPolyline.length > 2) {
                for (var k = 0; k < tempPolyline.length - 1; k++) {
                    firstPoint = tempPolyline[k];
                    secondPoint = tempPolyline[k + 1];
                    tempDistance = L.latLng(firstPoint).distanceTo(secondPoint);
                    totalDistance += tempDistance;
                }
            }
        }
        console.log(totalDistance);
    }

};
