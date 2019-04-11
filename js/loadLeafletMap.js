/* global L */

let temp =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2FmM2M5MDJlMTIwYjBkNzE2OGFkMzYiLCJ1c2VybmFtZSI6ImpvaGFuLmRqYXJ2Lmthcmx0b3JwQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGN4c3Nic0oyNy9Sby9xNVR4THA4UGV1cFhFZkhVeFpuUS80TVltL0J2VFRqdkxTQnBrOXNlIiwiaXNBZG1pbiI6ImZhbHNlIiwiaWF0IjoxNTU0OTg4MTc5fQ.X8qkvnr1R9clgVddcaHMywnr_UCyCf0deqi3wKo__xA";

// Ska skapas vid inlogg i framtiden istället
let localStorage = window.localStorage;

localStorage.setItem('token', temp);

let token = localStorage.getItem('token');


// Imports Google maps javascript api key from getKey.js file
import {
    key
} from "./getKey.js";

// Imports functions from underlying functionality from add.js file that uses the leaflet library
import {
    add
} from "./add.js";

import {
    edit
} from "./edit.js";

import {
    show
} from "./show.js";

export let pipeChoice = null;
export let objectData;


/**
 * loadProducts - Description
 *
 * @returns {type} Description
 */
let loadProducts = () => {
    fetch(
        `http://localhost:1337/obj/all?token=${token}`
    )
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            objectData = json;
            let temp = "";
            let list = document.getElementsByClassName('obj-list')[0];

            for (let i = 0; i < json.length; i++) {
                if (temp != json[i].Kategori) {
                    temp = json[i].Kategori;

                    list.innerHTML +=
                        `<button class="accordion desc">${json[i].Kategori}</button>
						 <div class="panel"></div>`;

                    let panels = document.getElementsByClassName('panel');
                    let panel = panels[panels.length - 1];

                    let object = document.createElement('div');

                    object.innerHTML =
                        `<div class="obj-container">
							<div id="${json[i].Kategori}" class="obj ${json[i].Kategori}">
								<img src="img/${json[i].Modell}.png"/>
							</div>
							<div class="obj-desc">${json[i].Modell}</div>
						 </div>`;

                    panel.appendChild(object);
                } else {
                    let panels = document.getElementsByClassName('panel');
                    let panel = panels[panels.length - 1];

                    let object = document.createElement('div');

                    object.innerHTML =
                        `<div class="obj-container">
							<div id="${json[i].Kategori}" class="obj ${json[i].Kategori}">
						   		<img src="img/${json[i].Modell}.png"/>
					   		</div>
					   		<div class="obj-desc">${json[i].Modell}</div>
						 </div>`;

                    panel.appendChild(object);
                }
            }

            accordions();
            show.activeObj();
            loadClickEvent();
            addPipeOnClick();
            addHouseOnClick();
        })
        .catch(error => alert(error));
};

// Initialize the map with center coordinates on BAGA HQ and zoom 18.
export const map = L.map("myMap", {
    "center": [56.208640, 15.632630],
    "editable": true,
    "zoom": 18
});

// Creates script link to Google Maps javascript API with our key
// then append it to head of map.html.
const script = document.createElement("script");

script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
document.head.appendChild(script);

/**
 * gridlayers - Creates the layer button in the top right corner with roadmap
 * 				and satellite alternatives
 *
 * @returns {void}
 */
let gridlayers = () => {
    // Creates Google maps roadmap (standard) grid layer and displays it on the map
    var roadmap = L.gridLayer.googleMutant({
        type: "roadmap"
    }).addTo(map);

    // Creates Google maps satellite grid layer
    var satellite = L.gridLayer.googleMutant({
        type: "satellite"
    });

    // Creates a array with roadmap and satellite inside and then add the array to a
    // new control layer and displays it to the map in the top right corner.
    var baseMaps = {
        "Karta": roadmap,
        "Satellit": satellite
    };

    L.control.layers(baseMaps).addTo(map);
};

/**
 * customControl - Create the custom buttons on the top left side under
 * 				   zoom buttons with icons from material icons
 *
 * @param {string} iconName - The name of the material icon.
 *
 * @returns {void}
 */
let customControl = (iconName) => {
    // Create a new leaflet control extended
    var myCustomControl = L.Control.extend({
        options: {
            position: 'topleft'
        },
        // When the customControl have been added to the map
        onAdd: () => {
            // Creates a new 'div' with pre configured css classes
            var container = L.DomUtil.create('div',
                'leaflet-bar leaflet-control leaflet-control-custom'
            );

            // Adds id equals to iconName to later easly call button
            container.id = iconName;
            // Disables map events when the button is clicked
            L.DomEvent.disableClickPropagation(container);

            // Creates a new 'i' html element and displays a material icon
            let icon = L.DomUtil.create('i');

            icon.className = 'material-icons';
            icon.innerHTML = iconName;
            //appends it to the div we created earlier
            container.appendChild(icon);

            //returns the div
            return container;
        }
    });

    // adds our customControl we created above to the maps controls and displays it on the map
    map.addControl(new myCustomControl());
};

/**
 * Adds functionality to the sidebar accordions
 */
let accordions = () => {
    // Find all accordions
    let acc = document.getElementsByClassName("accordion");

    // Loop through each element
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", () => {
            // Toggle css class 'activeAccordion' on current accordion
            acc[i].classList.toggle("activeAccordion");
            // Find panel inside accordion
            var panel = acc[i].nextElementSibling;

            // If accordion is already open
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                // Set the panels css maxHeight value (0) equals to the panel
                // scrollHeight in px (panels true length)
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
};

/**
 * addMarkerOnClick - Displays a marker on the map with its custom icon
 *
 * @param {array} elements All elements with the same class
 * @param {L.icon} icon    Leaflet icon @see {@link https://leafletjs.com/reference-1.4.0.html#icon}
 *
 * @returns {void}
 */
let addMarkerOnClick = (elements, icon) => {
    // For each element
    for (let i = 0; i < elements.length; i++) {
        // Add a click event listenr
        elements[i].parentElement.addEventListener("click", () => {
            // Set markers info and icon
            add.activeObjName = elements[i].id;
            add.activeIcon = icon;

            // Call addMarker function in src.js
            map.on("click", add.marker);
            document.getElementById("map").style.cursor = "pointer";
        });
    }
};

/**
 * addHouseOnClick - On click the user draws polygons on the map and a house
 * 					 add are created
 *
 * @returns {void}
 */
let addHouseOnClick = () => {
    // Add click event listener on house button in sidebar
    document.getElementById("house").addEventListener('click', () => {
        // Call addHouse function everytime user clicks on map
        map.on('click', add.house);
        document.getElementById("myMap").style.cursor = "pointer";

        // Call stopEdit function when user keydown on 'esc' key
        document.addEventListener("keypress", (event) => {
            if (event.keyCode == 27) {
                edit.stopDrawingHouse();
            }
        });
    });
};

/**
 * addPipeOnClick - Adds a polyline (pipe) between two objects after the
 * 					user clicks on two outplaced objects on map
 * 					(marker, polyline, or polygon)
 *
 * @returns {void}
 */
let addPipeOnClick = () => {
    // Adds a click event listener on pipe button
    document.getElementById("pipe").addEventListener("click", () => {
        // On each layer of the map => this means all markers, all polylines
        // and all polygons but not the map itself
        pipeChoice = "pipe";
        map.eachLayer((layer) => {
            // On click on add call addPipe function
            layer.on("click", add.pipe);
        });
    });

    document.getElementById("stempipe").addEventListener("click", () => {
        pipeChoice = "stemPipe";
        map.eachLayer((layer) => {
            layer.on("click", add.pipe);
        });
    });
};

/**
 * doNothingonClick - Make it possible to drag and click on map with noting happening
 * 					  (This is the first custom button on the left side of the map)
 *
 * @returns {void}
 */
let doNothingonClick = () => {
    // Adds a click event listener on mouse icon button
    document.getElementById("map").addEventListener('click', (event) => {
        edit.clearMapsEvents();
        show.activeCustomControl(event);
    });
};

/**
 * editpipesOnClick - Make it possible to bend pipes (polylines) by dragging
 * 					  (This is the second custom button on the left side of the map)
 *
 * @returns {void}
 */
let editpipesOnClick = () => {
    // Adds a click event listener on edit pipes button
    document.getElementById("timeline").addEventListener('click', (event) => {
        edit.clearMapsEvents();
        show.activeCustomControl(event);
        edit.polylines();
    });
};

/**
 * toggleMouseCoordOnClick - On click show or hide (toggle) toolbar next to the
 * 							 mouse with the coordinates of current pos of mouse
 * 					  		 (This is the third custom button on the left side of the map)
 *
 * @returns {void}
 */
let toggleMouseCoordOnClick = () => {
    // Add a click event listener to element
    document.getElementById('control_camera').addEventListener('click', (
        event) => {
        let target = event.target;

        // Toggle css class 'active2' to element. Switches each time user clicks on button
        document.getElementById('control_camera').classList.toggle(
            'active2');

        // If the user clicks on the border of i element and by mistake select
        // the parent element instead
        if (target.localName == 'div') {
            let child = target.firstChild;

            // If button is already pressed
            if (child.active == true) {
                // Mark button as not active
                child.active = false;
                // Disable showMouseCoord function when user moves the mouse over the map
                map.off('mousemove', show.mouseCoordOnMap);
                // Hide toolbar
                show.hideMouseCoord();
            } else {
                // Mark button as active
                child.active = true;
                // Call showMouseCoord function everytime user moves the mouse over the map
                map.on('mousemove', show.mouseCoordOnMap);
            }
            //else if the user clicks on the icon ('i') element
            // Then it is the same procedure as above
        } else if (target.active == true) {
            target.active = false;
            map.off('mousemove', show.mouseCoordOnMap);
            show.hideMouseCoord();
        } else {
            target.active = true;
            map.on('mousemove', show.mouseCoordOnMap);
        }
    });
};

/**
 * getDistanceOnClick - Displays distance of each pipe (polyline) on the map
 * 						(This is the fourth custom button on the left side of the map)
 *
 * @returns {void}
 */
let getDistanceOnClick = () => {
    // Adds a click event listener on delete button
    document.getElementById("bar_chart").addEventListener("click", (event) => {
        edit.clearMapsEvents();
        show.activeCustomControl(event);
        show.polylineLengths();
    });
};


/**
 * deleteOnClick - Make it possible to delete add on tha map by clicking
 * 				   (This is the fifth custom button on the left side of the map)
 *
 * @returns {void}
 */
let deleteOnClick = () => {
    // Adds a click event listener on delete button
    document.getElementById("delete").addEventListener("click", (event) => {
        edit.clearMapsEvents();
        show.activeCustomControl(event);
        // On each layer of the map => this means all markers, all polylines
        // and all polygons but not the map itself
        map.eachLayer((layer) => {
            // On click on add call remove function
            layer.on("click", edit.remove);
        });
    });
};


/**
 * save - Description
 *
 * @returns {type} Description
 */
let save = () => {
    document.getElementById("save").addEventListener("click", () => {
        let modal = document.getElementById('saveModal');
        let select = document.getElementById("versions");
        let newVersion = document.getElementById('newVersion');

        show.openModal(modal);

        newVersion.addEventListener('input', () => {
            let newOption = document.getElementById('newOption');

            if (newOption == null) {
                let option = document.createElement("option");

                option.text = newVersion.value;
                option.id = 'newOption';

                select.add(option, select[0]);
                select.value = option.text;
            } else {
                newOption.text = newVersion.value;
            }
        });

        document.getElementById('saveButton').addEventListener('click', () => {
            console.log(select.value);
            edit.save();

            modal.style.display = 'none';
        });
    });
};


/**
 * onLoad - Initialize the map functionality with html objects
 *
 * @returns {void}
 */
let onLoad = () => {
    loadProducts();
    gridlayers();
    customControl('map');
    customControl('timeline');
    customControl('control_camera');
    customControl('bar_chart');
    customControl('delete');
    add.search();

    doNothingonClick();
    editpipesOnClick();
    toggleMouseCoordOnClick();
    getDistanceOnClick();
    deleteOnClick();
    save();
    edit.warning.unsavedChanges();

    //make the blue border appear on mouse icon button on load
    document.getElementById('map').click();
};

onLoad();


/**
 * loadClickEvent - Description
 *
 * @returns {type} Description
 */
let loadClickEvent = () => {
    addMarkerOnClick(document.getElementsByClassName('Pumpstationer'),
        L.icon({
            iconAnchor: [19.5, 19.5],
            iconSize: [39, 39],
            iconUrl: `img/pump.png`,
            popupAnchor: [0, -19.5]
        }));

    addMarkerOnClick(document.getElementsByClassName("Fettavskiljare"),
        L.icon({
            iconAnchor: [19.5, 19.5],
            iconSize: [39, 39],
            iconUrl: `img/symbol_fettavskiljare.png`,
            popupAnchor: [0, -19.5]
        }));

    addMarkerOnClick(document.getElementsByClassName("Oljeavskiljare"),
        L.icon({
            iconAnchor: [19.5, 19.5],
            iconSize: [39, 39],
            iconUrl: `img/symbol_oljeavskiljare.png`,
            popupAnchor: [0, -19.5]
        }));



    addMarkerOnClick(document.getElementsByClassName("Slamavskiljare"),
        L.icon({
            iconAnchor: [19.5, 19.5],
            iconSize: [39, 39],
            iconUrl: `img/symbol_slamavskiljare.png`,
            popupAnchor: [0, -19.5]
        }));

    addMarkerOnClick(document.getElementsByClassName("BioTank"),
        L.icon({
            iconAnchor: [36.5, 19.5],
            iconSize: [73, 39],
            iconUrl: `img/symbol_utjämningsbrunn.png`,
            popupAnchor: [0, -19.5]
        }));

    addMarkerOnClick(document.getElementsByClassName("Källsorterat avlopp"),
        L.icon({
            iconAnchor: [36.5, 19.5],
            iconSize: [73, 39],
            iconUrl: `img/symbol_elementbrunn.png`,
            popupAnchor: [0, -19.5]
        }));


    addMarkerOnClick(document.getElementsByClassName("Kompaktbädd"),
        L.icon({
            iconAnchor: [36.5, 19.5],
            iconSize: [73, 39],
            iconUrl: `img/symbol_utjämningsbrunn.png`,
            popupAnchor: [0, -19.5]
        }));

    addMarkerOnClick(document.getElementsByClassName("endpoint"),
        L.icon({
            iconAnchor: [19.5, 19.5],
            iconSize: [39, 39],
            iconUrl: `img/endpointmarker.png`,
            popupAnchor: [0, -19.5]
        }));
};
