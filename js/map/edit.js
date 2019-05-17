/* global configuration, API */
export let isEdit = null;
let tempPolylineArray = [];

//Imports the map object
import { map, token, icons, projectInfo } from "./loadLeafletMap.js";

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

            event.target.setPopupContent(popup.marker(event.target.attributes) + popup.changeCoord({
                lat: event.latlng.lat,
                lng: event.latlng.lng
            }));

            edit.warning.unsavedChanges(true);
        });
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
        isEdit = true
        ;
    },

    /**
     * removeArrows - Removes the arrows when adding or editing pipes.
     *
     * @returns {void}
     */
    removeArrows: () => {
        polylines.eachLayer((polyline) => {
            polyline.decorator.off('click');
            polyline.decorator.removeFrom(map);
        });
    },

    /**
     * clearMapsEvents - Clear the map from events.
     *
     * @returns {void}
     */
    clearMapsEvents: () => {
        //Gets each polylines and removes the "editing hooks".
        polylines.eachLayer((polyline) => {
            polyline.decorator.addTo(map);
            polyline.decorator.on('click', () => {
                polyline.openPopup();
            });
        });

        //Turn off click events for markers and polylines.
        map.off("click", add.marker);
        map.off('click', add.polygone);

        //If polylines has been edited
        if (isEdit == true) {
            var i = 0;

            //For each element in polylines
            polylines.eachLayer(async (polyline) => {
                polyline.editingDrag.removeHooks();
                polyline.decorator.addTo(map);
                polyline.decorator.setPaths(polyline._latlngs);

                //If amount of points has changed
                if (polyline._latlngs.length != tempPolylineArray[i++]) {
                    //Calculates new length of pipe
                    polyline.length = getLength(polyline._latlngs);
                    polyline.elevation = await polyline.updateElevation(polyline._latlngs);
                    polyline.bindTooltip("Längd: " + Math.round(polyline.length * 100) /
                        100 + "m" + "<br>Statisk höjd: " +
                        (polyline.elevation.highest - polyline.elevation.first).toFixed(
                            1)
                    );
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
        //Remove polylines, markers and polygons when clicked
        polylines.removeLayer(event.target);
        markers.removeLayer(event.target);
        polygons.removeLayer(event.target);

        edit.warning.unsavedChanges(true);
    },

    /**
     * notification - Gets status from response and then shows an appropriate
     * snackbar.
     *
     * @returns {void}
     */
    notification: (status) => {
        // Get the snackbar DIV
        let snackbar = document.getElementById("snackbar");

        if (status == "error") {
            snackbar.style.backgroundColor = "red";
            snackbar.innerHTML = "Spara misslyckades. Du har ingen internetuppkoppling";
        } else if (status == "error2") {
            snackbar.style.backgroundColor = "red";
            snackbar.innerHTML = "Spara misslyckades";
        } else if (status == "success") {
            snackbar.style.backgroundColor = "green";
            snackbar.innerHTML = "Spara lyckades";
        }

        // Add the "show" class to DIV
        snackbar.className = "show";

        // After 3 seconds, remove the show class from DIV
        setTimeout(function() {
            snackbar.className = snackbar.className.replace("show", "");
        }, 3000);
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
        let status;

        temp = {
            zoom: map.getZoom(),
            center: map.getCenter()
        };

        json.push(temp);

        //Loop through all polylines and save them in a json format
        polylines.eachLayer((polyline) => {
            temp = {
                coordinates: polyline._latlngs,
                type: "polyline",
                connected_with: polyline.connected_with,
                elevation: polyline.elevation,
                length: polyline.length,
                tilt: polyline.tilt,
                material: polyline.material,
                dimension: polyline.dimension,
                pipeType: polyline.type,
            };

            json.push(temp);
        });

        //Loop through all markers and save them in a json format
        markers.eachLayer((marker) => {
            temp = {
                coordinates: { lat: marker._latlng.lat, lng: marker._latlng.lng },
                type: "marker",
                id: marker.id,
                attributes: marker.attributes,
            };

            json.push(temp);
        });

        polygons.eachLayer((polygon) => {
            temp = {
                coordinates: polygon._latlngs,
                type: "polygon",
                definition: polygon.definition,
                id: polygon.id,
                address: polygon.address,
                nop: polygon.nop,
                flow: polygon.flow,
                color: polygon.options.color
            };

            json.push(temp);
        });

        if (version == projectInfo.version) {
            let id = new URL(window.location.href).searchParams.get('id');

            let response = await API.post(
                `${configuration.apiURL}/proj/update/data/${id}?token=${token}`,
                'application/json', JSON.stringify(json));

            if (response[1] == "error") {
                edit.notification("error");
            } else if (response[0] == undefined) {
                edit.notification("error2");
            } else {
                edit.notification("success");
            }

            edit.warning.unsavedChanges(false);
        } else {
            projectInfo.version = version;

            let response = await API.post(
                `${configuration.apiURL}/proj/insert?token=${token}`,
                'application/json', JSON.stringify(projectInfo));

            let res = await API.post(
                `${configuration.apiURL}/proj/update/data/${response._id}?token=${token}`,
                'application/json', JSON.stringify(json));

            if (res[1] == "error") {
                status = "error";
            } else {
                status = "success";
            }

            edit.warning.unsavedChanges(false);
            document.location.href = `map.html?id=${response._id}&savestatus=${status}`;
        }
    },

    /**
         * load - Load objects(markers, polylines, polygons) to the map using json data.
         *
         * @returns {void}
         */
    load: (json) => {
        let icon;
        let newObj;
        let popup;

        map.setView(json[0].center, json[0].zoom);

        //Loop through json data.
        for (let i = 1; i < json.length; i++) {
            switch (json[i].type) {
                //If marker add it to the map with its options
                case "marker":
                    icon = icons.find(element => element.category == json[i].attributes.Kategori);
                    newObj = new Marker(json[i].coordinates, json[i].attributes, icon.icon,
                        json[i].id);
                    break;
                    //If polyline
                case "polyline":
                    newObj = new Pipe(json[i].coordinates, ["", ""], json[i].pipeType,
                        json[i].connected_with.first);
                    newObj.draw(
                        json[i].connected_with.last,
                        null,
                        json[i].elevation,
                        json[i].material,
                        json[i].dimension,
                        json[i].tilt
                    );
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
    },

    /**
         * warning - Warning message object.
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
        }
    },
};
