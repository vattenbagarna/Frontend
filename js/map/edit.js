/* global L, configuration */
export let isEdit = null;
let tempPolylineArray = [];

//imports the map object
import { map, token } from "./loadLeafletMap.js";

import { add, polylines, markers, polygons, getLength } from "./add.js";

import { popup } from "./popup.js";


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
        let json = [];

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
                id: polyline._leaflet_id,
            };

            json.push(temp);
        });

        //loop through all markers and save them in a json format
        markers.eachLayer((marker) => {
            let temp = {
                coordinates: [marker._latlng.lat, marker._latlng.lng],
                type: "marker",
                options: marker.options,
                id: marker._leaflet_id,
                popup: marker.getPopup().getContent(),
                attributes: marker.attributes,
            };

            json.push(temp);
        });

        polygons.eachLayer((polygon) => {
            let temp = {
                coordinates: polygon._latlngs,
                type: "polygon",
                options: polygon.options,
                id: polygon._leaflet_id,
                popup: polygon.getPopup().getContent(),
                definition: polygon.definition,
                address: polygon.address,
                nop: polygon.nop,
                flow: polygon.flow
            };

            json.push(temp);
        });

        /*
        var str = "";

        for (let i = 0; i < json.length; i++) {
            for (var key in json[i]) {
                if (json[i].type !== "marker") {
                    str += encodeURIComponent(key) + "=" +
                        encodeURIComponent(json[i][key]) + "&";
                } else if (key === "options") {
                    console.log(key);
                    console.log(json[i][key].draggable);
                    str += encodeURIComponent("draggable") + "=" +
                        encodeURIComponent(json[i][key].draggable) + "&";
                    console.log(json[i][key].icon.options.iconAnchor);
                    str += encodeURIComponent("icon.options.iconAnchor") + "=" +
                        encodeURIComponent(json[i][key].icon.options.iconAnchor) + "&";

                    console.log(json[i][key].icon.options.iconSize);
                    str += encodeURIComponent("icon.options.iconSize") + "=" +
                        encodeURIComponent(json[i][key].icon.options.iconSize) + "&";

                    console.log(json[i][key].icon.options.iconUrl);
                    str += encodeURIComponent("icon.options.iconUrl") + "=" +
                        encodeURIComponent(json[i][key].icon.options.iconUrl) + "&";

                    console.log(json[i][key].icon.options.popupAnchor);
                    str += encodeURIComponent("icon.options.popupAnchor") + "=" +
                        encodeURIComponent(json[i][key].icon.options.popupAnchor) + "&";


                    console.log(json[i][key].icon._initHooksCalled);
                    str += encodeURIComponent("icon._initHooksCalled") + "=" +
                        encodeURIComponent(json[i][key].icon._initHooksCalled) + "&";
                } else {
                    str += encodeURIComponent(key) + "=" +
                        encodeURIComponent(json[i][key]) + "&";
                }
            }
        }

        console.log(str);

		*/

        //backend måste uppdateras för att acceptera content-type application/json
        let id = new URL(window.location.href).searchParams.get('id');

        fetch(configuration.apiURL + `/${id}/12345?token=${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: json,
        }).then(res => res.json())
            .then((response) => console.log(response[0].data))
            .catch(error => alert(error));
    },

    /**
     * load - Load objects(markers, polylines, polygons) to the map using json
     * data
     *
     * @returns {void}
     */
    load: (json) => {
        let icon;
        let newObj;

        console.log(json);

        //Loop through json data.
        for (let i = 0; i < json.type.length; i++) {
            switch (json.type[i]) {
                //if marker add it to the map with its options
                case "marker":
                    icon = L.icon(json[i].options.icon.options);

                    json[i].options.icon = icon;
                    newObj = new L.Marker(json[i].coordinates, json[i].options)
                        .addTo(map)
                        .on("drag", edit.moveMarker);

                    newObj._leaflet_id = json[i].id;
                    newObj.bindPopup(json[i].popup);

                    markers.addLayer(newObj);
                    break;
                    //if polyline
                case "polyline":
                    //get polyline options and add it to an object
                    newObj = L.polyline(json[i].coordinates, json[i].options);
                    newObj
                        .connected_with = json[i].connected_with;
                    newObj.bindPopup(
                        json[i].popup);

                    newObj.getLength = json[i].getLength;
                    newObj.tilt = json[i].tilt;
                    newObj.innerDiameter = json[i].dimension;

                    //add to map
                    polylines.addLayer(newObj).addTo(map);
                    break;
                case "polygon":
                    newObj = L.polygon(json[i].coordinates, json[i].options);
                    newObj
                        .bindPopup(json[i].popup);
                    newObj.address = json[i].address;
                    newObj
                        .nop = json[i].nop;
                    newObj.flow = json[i].flow;

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
