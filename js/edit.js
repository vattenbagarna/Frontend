/* global L, data */
export let isEdit = null;
let tempPolylineArray = [];
let housePopup =
    `
    <div class="housePopup">
    <select>
    <option value="Hus">Hus</option>
    <option value="Garage">Garage</option>
    <option value="Restaurang">Restaurang</option>
    <option value="Sommarstuga">Sommarstuga</option>
    </select>

    <form action="">
    Personer per hushåll: <input type="text" name="per" value="5"><br>
    Vatten per person/dygn: <input type="text" name="cons" value="150L"><br>
    <input type="submit" value="Ändra">
    </form>
    </div>`;

//imports the map object
import {
    map
} from "./loadLeafletMap.js";

import {
    add,
    polylines,
    markers,
    polygons,
    polygon,
    guideline,
    clear,
    calcLengthFromPipe,
    popup
} from "./add.js";

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
            } else if (event.target._leaflet_id === polyline.connected_with
                .last) {
                let newLatlng = polyline.getLatLngs();

                newLatlng.pop();
                newLatlng.push(event.latlng);
                polyline.setLatLngs(newLatlng);
            }
        });
        event.target.setPopupContent(popup.marker(add.activeObjName) +
            popup.changeCoord({
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
        clear();

        polylines.eachLayer((polyline) => {
            polyline.editingDrag.addHooks();
            tempPolylineArray.push(polyline._latlngs.length);
        });

        isEdit = true;
    },

    /**
     * stopEdit - Stops the drawing of a polygon.
     *
     * @returns {void}
     */
    stopDrawingHouse: () => {
        //if user is still drawing a polygon, stop it.
        if (guideline != null && polygon != null) {
            L.esri.Geocoding.reverseGeocode()
                .latlng(polygon._latlngs[0][0])
                .run(function(error, result, response) {
                    map.off('mousemove', add.guideLine);
                    if (response != null) {
                        polygon.bindPopup(response.address.Match_addr + housePopup);
                        guideline.remove();
                        clear();
                    }
                });
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
                    calcLengthFromPipe(polyline);
                    polyline.bindTooltip("Längd: " + Math.round(polyline.getLength * 100) /
                        100 +
                        "m");
                }
                i++;
            });

            isEdit = null;
        }

        //remove guideline from polygon.
        if (guideline != null) {
            map.off('mousemove', add.showGuideLine);
            guideline.remove();
            clear();
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
                        edit.moveMarker);

                    newObj._leaflet_id = savedData[i].id;
                    //newObj.bindPopup(popupPump).openPopup();

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

};
