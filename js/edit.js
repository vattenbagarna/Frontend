/* global L, */
export let isEdit = null;
let tempPolylineArray = [];

//imports the map object
import {
    map,
} from "./loadLeafletMap.js";

import { add, polylines, markers, polygons, getLength } from "./add.js";

import { popup } from "./popup.js";

import { jsonData } from "../json/jsonSave.js";

export const edit = {
    /**
     * moveMarker - Moves a marker and connected polyline follows.
     *
     * @param {object} event
     * @returns {void}
     */
    moveMarker: (event) => {
        //get each polyline
        polylines.eachLayer((polyline) => {
            //check if polylines are connected to a marker, by first point and last point.
            if (event.target._leaflet_id === polyline.connected_with.first) {
                //if polyline is connected with marker change lat lng to match marker
                let newLatlng = polyline.getLatLngs();

                newLatlng.shift();
                newLatlng.unshift(event.latlng);

                polyline.setLatLngs(newLatlng);
            } else if (event.target._leaflet_id === polyline.connected_with.last) {
                let newLatlng = polyline.getLatLngs();

                newLatlng.pop();
                newLatlng.push(event.latlng);
                polyline.setLatLngs(newLatlng);
            }
        });
        event.target.setPopupContent(popup.marker(add.activeObjName) + popup.changeCoord({
            lat: event.latlng.lat,
            lng: event.latlng.lng
        }));
    },

    /**
     * editPolylines - Makes polylines editable by adding hooks and dragging.
     * library?
     *
     * @returns {void}
     */
    polylines: () => {
        polylines.eachLayer((polyline) => {
            polyline.editingDrag.addHooks();
            tempPolylineArray.push(polyline._latlngs.length);
        });

        isEdit = true;
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
        map.off("click", add.marker);
        map.off('click', add.polygone);
        //If polylines has been edited
        if (isEdit == true) {
            var i = 0;
            //for each element in polylines

            polylines.eachLayer((polyline) => {
                //if amount of points has changed
                if (polyline._latlngs.length != tempPolylineArray[i]) {
                    //Calculates new length of pipe
                    polyline.length = getLength(polyline);
                    polyline.bindTooltip("Längd: " + Math.round(polyline.length * 100) /
                        100 + "m");
                }
                i++;
            });

            isEdit = null;
        }

        document.getElementById("map").style.cursor = "grab";

        //Closes popups and turns off click events for remove and addPipe.
        map.closePopup();
        map.eachLayer((layer) => {
            layer.off("click", edit.remove);
            layer.off("click", add.pipe);
        });
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
                coordinates: polyline._latlngs,
                type: "polyline",
                connected_with: polyline.connected_with,
                options: polyline.options,
                popup: polyline.getPopup().getContent(),
                getLength: polyline.getLength,
                tilt: polyline.tilt,
                dimension: polyline.dimension,
            };

            jsonArray.push(temp);
        });

        //loop through all markers and save them in a json format
        markers.eachLayer((marker) => {
            let temp = {
                coordinates: marker._latlng,
                type: "marker",
                options: marker.options,
                id: marker._leaflet_id,
                popup: marker.getPopup().getContent(),
                attribute: marker.attribute
            };

            jsonArray.push(temp);
        });

        polygons.eachLayer((polygon) => {
            let temp = {
                coordinates: polygon._latlngs,
                type: "polygon",
                options: polygon.options,
                id: polygon.id,
                popup: polygon.getPopup().getContent(),
                definition: polygon.definition,
                address: polygon.address,
                nop: polygon.nop,
                flow: polygon.flow
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
        const savedData = jsonData;
        //const jsonLoad = JSON.parse(jsonData)
        let icon;
        let newObj;

        //Loop through json data.
        for (let i = 0; i < savedData.length; i++) {
            switch (savedData[i].type) {
                //if marker add it to the map with its options
                case "marker":
                    icon = L.icon(savedData[i].options.icon.options);

                    savedData[i].options.icon = icon;
                    newObj = new L.Marker(savedData[i].coordinates,
                        savedData[i].options).addTo(map).on("drag", edit.moveMarker);

                    newObj._leaflet_id = savedData[i].id;
                    newObj.bindPopup(savedData[i].popup);
                    newObj.attribute = savedData[i].attribute;

                    markers.addLayer(newObj);
                    break;
                    //if polyline
                case "polyline":
                    //get polyline options and add it to an object
                    newObj = L.polyline(savedData[i].coordinates, savedData[i].options);
                    newObj.connected_with = savedData[i].connected_with;
                    newObj.bindPopup(savedData[i].popup);

                    newObj.getLength = savedData[i].getLength;
                    newObj.tilt = savedData[i].tilt;
                    newObj.innerDiameter = savedData[i].dimension;

                    //add to map
                    polylines.addLayer(newObj).addTo(map);
                    break;
                case "polygon":
                    newObj = L.polygon(savedData[i].coordinates, savedData[i].options);
                    newObj.bindPopup(savedData[i].popup);
                    newObj.address = savedData[i].address;
                    newObj.nop = savedData[i].nop;
                    newObj.flow = savedData[i].flow;

                    polygons.addLayer(newObj).addTo(map);
                    break;
            }
        }
    },

    /**
     * warning - Description
     *
     * @returns {type} Description
     */
    warning: {
        /**
         * unsavedChanges - Description
         *
         * @returns {type} Description
         */
        unsavedChanges: () => {
            //borde bara köras om nya ändringar har gjorts
            window.onbeforeunload = () => {
                return "Are you sure you want to navigate away?";
            };
        },
    },

};