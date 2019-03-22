/* global L */
let mouseCoord = null;



//imports the map object
import {
    map
} from "./loadLeafletMap.js";

import {
    polylines,
    clearStartPolyline
} from "./add.js";

import {
    edit
} from "./edit.js";

export const show = {
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
                edit.clearMapsEvents();
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
     * showMouseCoord - Shows the user the latLngs of the mouse on the map.
     *
     * @param {object} event
     * @returns {void}
     */
    mouseCoordOnMap: (event) => {
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
     * showAllLength - Gets each pipes length and also gets the total length of
     * all pipes.
     *
     * @returns {void}
     */
    polylineLengths: () => {
        //var totalDistance = 0;
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
                //totalDistance += thisPipeDistance;
                //bind a popup with length for current polyline
                polyline.bindTooltip("Längd: " + Math.round(thisPipeDistance * 100) / 100 +
                    "m", {
                        autoClose: false
                    }).openTooltip();
                //if polylines have more than 2 points
            } else if (tempPolyline.length > 2) {
                for (var i = 0; i < tempPolyline.length - 1; i++) {
                    firstPoint = tempPolyline[i];
                    secondPoint = tempPolyline[i + 1];
                    thisPipeDistance += L.latLng(firstPoint).distanceTo(secondPoint);
                }
                //totalDistance += thisPipeDistance;
                polyline.bindTooltip("Längd: " + Math.round(thisPipeDistance * 100) / 100 +
                    "m", {
                        autoClose: false
                    }).openTooltip();
            }
        });
    },

    openModal: () => {
        let modal = document.getElementById("myModal");
        var span = document.getElementsByClassName("close")[0];

        // Open the modal
        modal.style.display = 'block';

        // When the user clicks on <span> (x), close the modal
        span.onclick = () => {
            modal.style.display = "none";
            clearStartPolyline();
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
                clearStartPolyline();
            }
        }
    },
};
