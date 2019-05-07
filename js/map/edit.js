/* global L, configuration, API */
export let isEdit = null;
let tempPolylineArray = [];

//imports the map object
import { map, token, projectInfo } from "./loadLeafletMap.js";

import { add, polylines, markers, polygons, getLength } from "./add.js";

import { show, mouseCoord } from "./show.js";

import { popup } from "./popup.js";

import { Marker, House, Pipe } from "./classes.js";

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
            if (event.target.id === polyline.connected_with.first) {
                //if polyline is connected with marker change lat lng to match marker
                let newLatlng = polyline.getLatLngs();

                newLatlng.shift();
                newLatlng.unshift(event.latlng);

                polyline.setLatLngs(newLatlng);
                polyline.decorator.setPaths(newLatlng);
            } else if (event.target.id === polyline.connected_with.last) {
                let newLatlng = polyline.getLatLngs();

                newLatlng.pop();
                newLatlng.push(event.latlng);

                polyline.setLatLngs(newLatlng);
                polyline.decorator.setPaths(newLatlng);
            }
        });
        event.target.setPopupContent(popup.marker(event.target.attributes) + popup.changeCoord({
            lat: event.latlng.lat,
            lng: event.latlng.lng
        }));

        edit.warning.unsavedChanges(true);
    },

    /**
     * polylines - Makes polylines editable by adding hooks and dragging.
     * library?
     *
     * @returns {void}
     */
    polylines: () => {
        polylines.eachLayer((polyline) => {
            polyline.editingDrag.addHooks();
            polyline.decorator.removeFrom(map);
            tempPolylineArray.push(polyline._latlngs.length);
        });

        edit.warning.unsavedChanges(true);
        isEdit = true;
    },

    /**
     * clearMapsEvents - Clear the map from events.
     *
     * @returns {void}
     */
    clearMapsEvents: () => {
        //Gets each polylines and removes the "editing hooks".

        //Turn off click events for markers and polylines.
        map.off("click", add.marker);
        map.off('click', add.polygone);

        //If polylines has been edited
        if (isEdit == true) {
            var i = 0;
            //for each element in polylines

            polylines.eachLayer((polyline) => {
                polyline.editingDrag.removeHooks();
                polyline.decorator.addTo(map);
                polyline.decorator.setPaths(polyline._latlngs);

                //if amount of points has changed
                if (polyline._latlngs.length != tempPolylineArray[i++]) {
                    //Calculates new length of pipe
                    polyline.length = getLength(polyline);
                    polyline.bindTooltip(
                        "Längd: " + Math.round(polyline.length * 100) / 100 + "m");
                }
            });
            isEdit = null;
            if (mouseCoord != null) {
                map.on('mousemove', show.mouseCoordOnMap);
            }
        }

        //Closes popups and turns off click events for remove and addPipe.
        map.closePopup();
        map.eachLayer((layer) => {
            if (layer._popup != undefined) { layer._popup.options.autoPan = true; }

            layer.off("click", edit.remove);
            layer.off("click", add.pipe);
        });
        document.getElementById("myMap").style.cursor = "grab";
    },

    /**
     * remove - Removes objects from the map.
     *
     * @param {object} event
     * @returns {void}
     */
    remove: (event) => {
        //remove polylines, markers and polygons when clicked
        polylines.removeLayer(event.target);
        markers.removeLayer(event.target);
        polygons.removeLayer(event.target);

        edit.warning.unsavedChanges(true);
    },

    /**
     * save - Saves the objects from the map in a json format.
     *
     * @param {string} version version number the user wants to save the project under
     * @returns {void}
     */
    save: async (version) => {
        let json = [];
        let temp;

        temp = {
            zoom: map.getZoom(),
            center: map.getCenter()
        };

        json.push(temp);

        //loop through all polylines and save them in a json format
        polylines.eachLayer((polyline) => {
            temp = {
                coordinates: polyline._latlngs,
                type: "polyline",
                connected_with: polyline.connected_with,
                options: polyline.options,
                popup: polyline.getPopup().getContent(),
                getLength: polyline.getLength,
                tilt: polyline.tilt,
                dimension: polyline.dimension,
                pipeType: polyline.type,
            };

            json.push(temp);
        });

        //loop through all markers and save them in a json format
        markers.eachLayer((marker) => {
            temp = {
                coordinates: [marker._latlng.lat, marker._latlng.lng],
                type: "marker",
                options: marker.options,
                id: marker.id,
                popup: marker.getPopup().getContent(),
                attributes: marker.attributes,
            };

            json.push(temp);
        });

        polygons.eachLayer((polygon) => {
            temp = {
                coordinates: polygon._latlngs,
                type: "polygon",
                options: polygon.options,
                popup: polygon.getPopup().getContent(),
                definition: polygon.definition,
                address: polygon.address,
                nop: polygon.nop,
                flow: polygon.flow
            };

            json.push(temp);
        });

        if (version == projectInfo.version) {
            let id = new URL(window.location.href).searchParams.get('id');

            await API.post(`${configuration.apiURL}/proj/update/data/${id}?token=${token}`,
                'application/json', JSON.stringify(json));

            edit.warning.unsavedChanges(false);
        } else {
            projectInfo.version = version;

            let response = await API.post(
                `${configuration.apiURL}/proj/insert?token=${token}`,
                'application/json', JSON.stringify(projectInfo));

            await API.post(
                `${configuration.apiURL}/proj/update/data/${response._id}?token=${token}`,
                'application/json', JSON.stringify(json));

            edit.warning.unsavedChanges(false);
            document.location.href = `map.html?id=${response._id}`;
        }
    },

    /**
         * load - Load objects(markers, polylines, polygons) to the map using json data
         *
         * @returns {void}
         */
    load: (json) => {
        let icon;
        let newObj;

        map.setView(json[0].center, json[0].zoom);

        //Loop through json data.
        for (let i = 1; i < json.length; i++) {
            switch (json[i].type) {
                //if marker add it to the map with its options
                case "marker":
                    icon = L.icon(json[i].options.icon.options);

                    newObj = new Marker(json[i].coordinates, json[i].attributes, icon, json[i].id);
                    break;
                    //if polyline
                case "polyline":
                    newObj = new Pipe(json[i].coordinates, ["", ""], json[i].pipeType,
                        json[i].connected_with.first);
                    newObj.draw(json[i].connected_with.last, null, json[i].dimension, json[i].tilt);
                    break;
                case "polygon":
                    newObj = new House(json[i].coordinates[0], ["", ""]);
                    newObj.drawFromLoad(json[i].coordinates, json[i].popup, json[i].nop,
                        json[i].flow, json[i].options);
                    break;
            }
        }
    },

    /**
         * warning - Warning message object
         *
         * @returns {void}
         */
    warning: {
        /**
             * unsavedChanges - Display a warning box when user tries to leave the page that some
             * 				  - information may not be saved if user exit the page.
             *				  - Uses window.onbeforeunload.
             * @returns {void}
             */
        unsavedChanges: (value) => {
            if (value) {
                window.onbeforeunload = () => {
                    return "Are you sure you want to navigate away?";
                };
            } else {
                window.onbeforeunload = () => {};
            }
        },
    },

};
