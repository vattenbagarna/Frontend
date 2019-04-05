/* global L */
let mouseCoord = null;

// Imports the map object.
import {map} from "./loadLeafletMap.js";

// Imports polylines and clears the start polyline.
import {polylines, clearStartPolyline} from "./add.js";

// Imports the edit file.
import {edit} from "./edit.js";

export const show = {
    /**
     * activeObj - Shows which object is clicked in the sidebar menu by adding
     * and removing the active class.
     *
     * @param {object} event
     * @returns {void}
     */
    activeObj: () => {
        const obj = document.getElementsByClassName("obj");

        // Gets all buttons and adds a click event to each.
        for (let i = 0; i < obj.length; i++) {
            obj[i].parentElement.addEventListener("click", function() {
                let current = document.getElementsByClassName(
                    "active");

                // If current have the class "active" replace it with "".
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

                // Clicked object gets the class active.
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
        var thisPipeDistance = 0;
        var firstPoint;
        var secondPoint;

        // Loop each polyline and adds a function to each.
        polylines.eachLayer((polyline) => {
            var tempPolyline = polyline._latlngs;

            // If polyline only has 2 points.
            if (tempPolyline.length == 2) {
                // Calculate current pipe's length.
                thisPipeDistance = tempPolyline[0].distanceTo(tempPolyline[1]);
                // Bind a popup with length for current polyline.
                polyline.bindTooltip("Längd: " + Math.round(thisPipeDistance * 100) / 100 +
                    "m", {
                    autoClose: false
                }).openTooltip();
                // If polylines have more than 2 points.
            } else if (tempPolyline.length > 2) {
                for (var i = 0; i < tempPolyline.length - 1; i++) {
                    firstPoint = tempPolyline[i];
                    secondPoint = tempPolyline[i + 1];
                    thisPipeDistance += L.latLng(firstPoint).distanceTo(secondPoint);
                }
                polyline.bindTooltip("Längd: " + Math.round(thisPipeDistance * 100) / 100 +
                    "m", {
                    autoClose: false
                }).openTooltip();
            }
        });
    },

    /**
     * openModal - It handles the opening and closing of boxes that shows when
     * save button and pipe specifications.
     *
     * @param {object} modal
     * @returns {void}
     */
    openModal: (modal) => {
        var span = modal.children[0].children[0];
        let success = false;

        // Open the modal
        modal.style.display = 'block';
        let firstInput = modal.getElementsByTagName('input')[0];
        let button = modal.getElementsByTagName('input')[modal.getElementsByTagName('input')
            .length - 1];

        firstInput.focus();

        // When the user clicks on <span> (x), close the modal
        span.onclick = () => {
            modal.style.display = "none";
            clearStartPolyline();
        };

        document.addEventListener('keyup', (event) => {
            if (event.keyCode == 27) {
                console.log("??");
                modal.style.display = "none";
                clearStartPolyline();
            } else if (event.keyCode == 13) {
                event.preventDefault();
                button.click();
            }
        });

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
                clearStartPolyline();
            }
        };

        return success;
    },
};
