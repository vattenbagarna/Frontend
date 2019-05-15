/* global L */
export let mouseCoord = null;

// Imports the map object.
import { map } from "./loadLeafletMap.js";

// Imports polylines and clears the start polyline.
import { polylines, clearStartPolyline } from "./add.js";

import { popup } from "./popup.js";

// Imports the edit file.
import { edit } from "./edit.js";

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
                        current[0].className.replace(" active", "");
                }

                current = document.getElementsByClassName("active3");
                if (current.length > 0) {
                    current[0].className = current[0].className.replace(" active3", "");
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
            current[0].className = current[0].className.replace(" active", "");
        }

        current = document.getElementsByClassName("active3");

        if (current.length > 0) {
            current[0].className = current[0].className.replace(" active3", "");
        }
        if (event.target.localName == 'div') {
            event.target.className += " active3";
            // Clears all events from the map
            edit.clearMapsEvents();
        } else {
            event.target.parentElement.className += " active3";
            // Clears all events from the map
            edit.clearMapsEvents();
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
            mouseCoord = L.circle(event.latlng, { radius: 0 }).addTo(map);
        } else {
            document.getElementById("myMap").style.cursor = "pointer";
            mouseCoord.setLatLng(event.latlng);
            mouseCoord.bindTooltip("lat:" + event.latlng.lat + ", lng:" + event.latlng.lng)
                .openTooltip(event.latlng);
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

        // Loop each polyline
        polylines.eachLayer((polyline) => {
            var tempPolyline = polyline._latlngs;

            // If polyline only has 2 points.
            if (tempPolyline.length == 2) {
                // Calculate current pipe's length.
                thisPipeDistance = tempPolyline[0].distanceTo(tempPolyline[1]);
                // Bind a popup with length for current polyline.
                polyline.bindTooltip("Längd: " + Math.round(thisPipeDistance * 100) / 100 +
                    "m" + "<br>Statisk höjd: " +
                    (polyline.elevation.highest - polyline.elevation.first).toFixed(1), {
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
                    "m" + "<br>Statisk höjd: " +
                    (polyline.elevation.highest - polyline.elevation.first).toFixed(1), {
                    autoClose: false
                }).openTooltip();
            }
        });
    },


    alert: (first, result) => {
        let div = document.createElement('div');
        let alerts;

        div.classList.add(first.attributes.id);

        let parent = document.getElementById('myMap');

        alerts = document.getElementsByClassName(first.attributes.id);

        for (let i = alerts.length - 1; i >= 0; i--) {
            alerts[i].children[0].style.opacity = "0";
            setTimeout(() => alerts[i].remove(), 600);
        }

        switch (result.calculations.status) {
            case 0:

                div.innerHTML =
                    `<div class="alert success">
								<span class="closebtn">&times;</span>
								<strong>OK!</strong>
								Flödeshastighet: ${result.calculations.mps.toFixed(2)} m/s

								 <span class="info-text">
									 ${first.attributes.Modell}
									 id: ${first.attributes.id}
								 </span>
							</div>`;
                parent.appendChild(div);

                first._icon.classList.remove('warning-icon');

                first.attributes.Flödeshastighet = result.calculations.mps.toFixed(2);
                first.setPopupContent(popup.marker(first.attributes) +
                    popup.changeCoord(first._latlng));

                setTimeout(() => {
                    let div = close.parentElement.parentElement;

                    div.style.opacity = "0";
                    setTimeout(() => div.remove(), 600);
                }, 4000);
                break;
            case 1:
                div.innerHTML =
                    `<div class="alert warning">
							<span class="closebtn">&times;</span>
							<strong>För låg flödeshastighet!</strong>
							Flödeshastighet: ${result.calculations.mps.toFixed(2)} m/s

							<span class="info-text">
								${first.attributes.Modell}
								id: ${first.attributes.id}
							</span>
						</div>`;
                parent.appendChild(div);

                first._icon.classList.add('warning-icon');
                break;
            case 2:
                div.innerHTML =
                    `<div class="alert warning">
							<span class="closebtn">&times;</span>
							<strong>För hög flödeshastighet!</strong>
							Flödeshastighet: ${result.calculations.mps.toFixed(2)} m/s

							<span class="info-text">
								${first.attributes.Modell}
								id: ${first.attributes.id}
							</span>
						</div>`;
                parent.appendChild(div);

                first._icon.classList.add('warning-icon');
                break;
            case 3:
                div.innerHTML =
                    `<div class="alert">
							<span class="closebtn">&times;</span>
							<strong>För högt tryck!</strong>
							Totaltrycket: ${result.totalPressure}
							<span class="info-text">
							   ${first.attributes.Modell}
							  id: ${first.attributes.id}
						</div>`;
                parent.appendChild(div);

                first._icon.classList.add('warning-icon');
                break;
            case 4:
                div.innerHTML =
                    `<div class="alert">
							<span class="closebtn">&times;</span>
							<strong>För lågt tryck!</strong>
							Totaltrycket: ${result.totalPressure}
							<span class="info-text">
							   ${first.attributes.Modell}
							  id: ${first.attributes.id}
						</div>`;
                parent.appendChild(div);

                first._icon.classList.add('warning-icon');
                break;
        }

        let close = document.getElementsByClassName("closebtn");

        close = close[close.length - 1];

        close.onclick = function() {
            let div = this.parentElement.parentElement;

            div.style.opacity = "0";
            setTimeout(() => div.remove(), 600);
        };
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
