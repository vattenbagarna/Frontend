/* global L */
let startPolyline = null;

let latLngs;
let options = {
    marker: (activeIcon) => {
        return {
            draggable: true,
            icon: activeIcon
        };
    },

    house: {
        color: 'blue',
        fillColor: '#3388ff',
        fillOpacity: 0.5,
        weight: 1.5
    },

    pipe: {
        id: "pipe",
        edit_with_drag: true,
        vertices: {
            destroy: true,
            first: false,
            last: false,
            insert: true,
            middle: true,
        }
    },

    stemPipe: {
        id: "stemPipe",
        weight: 5,
        color: "red",
        edit_with_drag: true,
        vertices: {
            destroy: true,
            first: false,
            last: false,
            insert: true,
            middle: true,
        }
    },
};

export let popup = {
    marker: (objName) => {
        return `<ul class='accordion2'>
    <li>
        <label for='cp-1'>Info</label>
        <input type='radio' name='a' id='cp-1' checked='checked'>
        <div class='content'>
			<table>
		        	<tr><td>${objName}</td></tr>
					<tr><td>antalpumpar: 1</td></tr>
					<tr><td>diameter: 600</td></tr>
					<tr><td>inlopp: 110, typ: gummitätning</td></tr>
					<tr><td>höjd: 700</td></tr>
					<tr><td>Kabelgenomförning: 50, typ: gummitätning</td> </tr>
					<tr><td>RSK: 5886909</td></tr>
					<tr><td>utlopp: 32, typ: inv. gänga</td></tr>
			</table>
		</div>
    </li>`;
    },

    pipe: (dimension, tilt) => {
        return `<b>Rör</b><br>
<label>Inner Dimension</label>
<input type="number" id="dimension" name="dimension" placeholder="${dimension}">
<label>Lutning</label>
<input type="number" id="tilt" name="tilt" placeholder="${tilt}">
<input type="button" value="Skicka">`;
    },

    branch: `<b>Förgrening<br>`,

    changeCoord: (latlng) => {
        return `
    <li>
        <label for='cp-2'>Ändra coordinater</label>
        <input type='radio' name='a' id='cp-2'>
        <div class='content'>
			<b> Latitud </b>
			<input type="text" id='latitud' value=${latlng.lat}>
        	<b> Longitud </b>
			<input type="text" id='longitud' value=${latlng.lng}>
        	<input type="button" class="sendCoords" value="Skicka" >
		</div>
    </li>
</ul>`;
    }

};

export let polygon = null;
export let guideline = null;

export let polylines = L.layerGroup();
export let markers = L.layerGroup();
export let polygons = L.layerGroup();

//imports the map object
import {
    map,
    pipeChoice
} from "./loadLeafletMap.js";

import {
    edit
} from "./edit.js";

import {
    show
} from "./show.js";

export const add = {
    activeObjName: "",
    activeIcon: "",

    /**
     * AddMarker - Adds a "marker" to the map, markers is also known as pumps.
     *
     * @param {object} event
     * @returns {void}
     */
    marker: (event) => {
        //Create marker object
        const temp = new L.Marker(event.latlng, options.marker(add.activeIcon))
            .bindPopup(popup.marker(add.activeObjName) + popup.changeCoord(event.latlng))
            .on("drag", edit.moveMarker)
            .on('popupopen', updateCoords);

        temp.attribute = [add.activeObjName, "antalpumpar: 1", "diameter: 600",
            "inlopp: 110, typ: gummitätning", "höjd: 700",
            "Kabelgenomförning: 50, typ: gummitätning", "RSK: 5886909",
            "utlopp: 32, typ: inv. gänga"];

        //Adds marker to map
        markers.addLayer(temp).addTo(map);
    },

    /**
     * addHouse - Adds a polygon to the map, polygons is used to mark houses.
     *
     * @param {object} event
     * @returns {void}
     */
    house: (event) => {
        if (polygon != null) {
            polygon.addLatLng(event.latlng);
            polygons.addLayer(polygon).addTo(map);

            let coord = guideline.getLatLngs();

            coord.shift();
            coord.unshift(event.latlng);
        } else {
            latLngs = [event.latlng];
            polygon = L.polygon(latLngs, options.house);

            guideline = L.polyline([event.latlng, event.latlng], {
                dashArray: '5, 10'
            }).addTo(map);

            map.on('mousemove', add.guideLine);
        }
    },

    /**
     * guideLine - Shows a guideline for the user when creating polygons.
     *
     * @param {object} event
     * @returns {void}
     */
    guideLine: (event) => {
        let coord = guideline.getLatLngs();

        coord.pop();
        coord.push(event.latlng);
        guideline.setLatLngs(coord);
    },

    /**
     * addPipe - Draws polylines on the map, polylines is also known as pipes.
     *
     * @param {object} event event.
     * @returns {void}
     */
    pipe: (event) => {
        let target = event.target;
        let temp;

        target.closePopup();

        //If startPolyline is null create the first point
        if (startPolyline != null) {
            if (target.getLength) {
                let newLine = addBranchConnection(startPolyline, event, target);

                if (pipeChoice == "pipe") {
                    temp = new L.polyline([startPolyline.latlng, newLine.latlng], options.pipe);
                } else if (pipeChoice == "stemPipe") {
                    temp = new L.polyline([startPolyline.latlng, newLine.latlng], options.stemPipe);
                }

                temp.connected_with = {
                    first: startPolyline.id,
                    last: newLine.id
                };
            } else {
                if (pipeChoice == "pipe") {
                    temp = new L.polyline([startPolyline.latlng, event.latlng], options.pipe);
                } else if (pipeChoice == "stemPipe") {
                    temp = new L.polyline([startPolyline.latlng, event.latlng], options.stemPipe);
                }


                temp.connected_with = {
                    first: startPolyline.id,
                    last: event.sourceTarget._leaflet_id
                };
            }

            show.openModal(document.getElementById('pipeModal'));

            // borde vara i edit.js och bör fungera hela tiden samt lägg till esq
            document.getElementById("tilt").addEventListener("keyup", (event) => {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    document.getElementById("pipeSpecifications").click();
                }
            });

            document.getElementById("pipeSpecifications").onclick = () => {
                let modal = document.getElementById("pipeModal");
                let dimension = document.getElementById("dimension");
                let tilt = document.getElementById("tilt");

                modal.style.display = "none";
                polylines.addLayer(temp).addTo(map);

                temp.dimension = dimension.value;
                temp.tilt = tilt.value;
                temp.bindPopup(popup.pipe(temp.dimension, temp.tilt));
                temp.editingDrag.removeHooks();
                temp.on('click', add.pipe);

                startPolyline = null;
                calcLengthFromPipe(temp);
            };
        } else if (target.getLength) {
            startPolyline = [];
            startPolyline.latlng = event.latlng;
            startPolyline.id = event.sourceTarget._leaflet_id;

            let startPoint = addBranchConnection(startPolyline, event, target);

            startPolyline.latlng = startPoint.latlng;
            startPolyline.id = startPoint.id;
        } else {
            startPolyline = [];
            startPolyline.latlng = event.latlng;
            startPolyline.id = event.sourceTarget._leaflet_id;
        }
    },

    /**
     * search - Search functionality to the map using a plugin.
     * plugin?
     *
     * @returns {void}
     */
    search: () => {
        L.esri.Geocoding.geosearch().addTo(map);
    }
};

/**
 * TBA
 *
 * @returns {void}
 */
let updateCoords = (event) => {
    let button = document.getElementsByClassName('sendCoords');

    button[button.length - 1].addEventListener('click', () => {
        let lat = document.getElementById('latitud').value;
        let lng = document.getElementById('longitud').value;

        event.target.closePopup();
        event.target.setLatLng([lat, lng]);
        map.panTo([lat, lng]);
        event.target.setPopupContent(popup.marker(add.activeObjName) +
			popup.changeCoord({lat: lat, lng: lng}));
    });
};

/**
 * calcLengthFromPipe - Gets an individual polyline and calculates the length.
 *
 * @param {array} array
 * @returns {void}
 */
export let calcLengthFromPipe = (polyline) => {
    var tempPolyline = polyline._latlngs;
    var thisPipeDistance = 0;

    if (tempPolyline.length == 2) {
        polyline.getLength = tempPolyline[0].distanceTo(tempPolyline[1]);
    } else if (tempPolyline.length > 2) {
        for (var i = 0; i < tempPolyline.length - 1; i++) {
            var firstPoint = tempPolyline[i];
            var secondPoint = tempPolyline[i + 1];

            thisPipeDistance += L.latLng(firstPoint).distanceTo(secondPoint);
        }
        polyline.getLength = thisPipeDistance;
    }
    //console.log(polyline.getLength);
};

/**
 * addBranchConnection - Description
 *
 * @param {type} startPolyline Description
 * @param {type} event         Description
 * @param {type} target        Description
 *
 * @returns {type} Description
 */
let addBranchConnection = (startPolyline, event, target) => {
    let targetLatlngs = target.getLatLngs();
    let firstLatlngs;
    let secondLatlngs;
    let newLine;
    let distanceMin = Infinity;
    let segmentMin = null;

    for (let i = 0; i < targetLatlngs.length - 1; i++) {
        let segment = [targetLatlngs[i], targetLatlngs[i + 1]];
        let distance = L.GeometryUtil.distanceSegment(map, event.latlng, segment[0], segment[1]);

        if (distance < distanceMin) {
            distanceMin = distance;
            segmentMin = segment;
        }
    }

    firstLatlngs = targetLatlngs.splice(0, targetLatlngs.indexOf(segmentMin[0]) + 1);
    secondLatlngs = targetLatlngs.slice(targetLatlngs.indexOf(segmentMin[1]), targetLatlngs.length);

    firstLatlngs.push(event.latlng);
    target.setLatLngs(firstLatlngs);

    secondLatlngs.unshift(event.latlng);

    let url = 'https://cdn4.iconfinder.com/data/icons/bathroom-accessory-outline/32/14-512.png';

    let branchMarker = new L.Marker(event.latlng, {
        draggable: true,
        icon: L.icon({
            iconAnchor: [19.5, 19.5],
            iconSize: [39, 39],
            iconUrl: url,
            popupAnchor: [0, -19.5]
        })
    }).bindPopup(popup.branch).on("drag", edit.moveMarker);

    branchMarker.attribute = ["Type: Förgrening"];

    markers.addLayer(branchMarker).addTo(map);
    branchMarker.on('click', add.pipe);

    newLine = {
        latlngs: secondLatlngs,
        first: branchMarker._leaflet_id,
        last: target.connected_with.last
    };
    target.connected_with.last = branchMarker._leaflet_id;

    let temp;

    if (target.options.id == "stemPipe") {
        temp = new L.polyline(newLine.latlngs, options.stemPipe);
    } else {
        temp = new L.polyline(newLine.latlngs, {
            edit_with_drag: true,
            vertices: {
                destroy: true,
                first: false,
                last: false,
                insert: true,
                middle: true,
            }
        });
    }

    temp.connected_with = {
        first: newLine.first,
        last: newLine.last
    };

    temp.dimension = target.dimension;
    temp.tilt = target.tilt;
    temp.bindPopup(popup.pipe(temp.dimension, temp.tilt));
    polylines.addLayer(temp).addTo(map);
    temp.editingDrag.removeHooks();
    temp.on('click', add.pipe);

    calcLengthFromPipe(temp);


    return {
        latlng: branchMarker._latlng,
        id: branchMarker._leaflet_id
    };
};

/**
 * clear - Set varible polygon and guideLine equals null. This is called from clearMapsEvents()
 * 		 - This function is used because export varibles is read-only
 *
 * @returns {void}
 */
export let clear = () => {
    polygon = null;
    guideline = null;
};


/**
 * clearStartPolyline - Set varible startPolyline equals to null.
 * 					  - This is called from clearMapsEvents()
 * 		 			  - This function is used because export varibles is read-only
 *
 * @returns {void}
 */
export let clearStartPolyline = () => {
    startPolyline = null;
};
