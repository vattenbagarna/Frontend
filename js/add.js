/* global L */
let pipe = null;

export let house = null;

export let polylines = L.layerGroup();
export let markers = L.layerGroup();
export let polygons = L.layerGroup();

//imports the map object
import { map, pipeChoice } from "./loadLeafletMap.js";

import { Marker, House, Pipe } from "./classes.js";

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
        let attribute = [add.activeObjName, "antalpumpar: 1", "diameter: 600",
            "inlopp: 110, typ: gummitätning", "höjd: 700",
            "Kabelgenomförning: 50, typ: gummitätning", "RSK: 5886909",
            "utlopp: 32, typ: inv. gänga"
        ];

        new Marker(event.latlng, attribute, add.activeIcon);
    },

    /**
     * addHouse - Adds a polygon to the map, polygons is used to mark houses.
     *
     * @param {object} event
     * @returns {void}
     */
    house: (event) => {
        // Behöver kommenteras
        if (house != null) {
            house.draw(event.latlng);
        } else {
            house = new House(event.latlng, ["house"]);
        }
    },

    /**
     * addPipe - Draws polylines on the map, polylines is also known as pipes.
     *
     * @param {object} event event.
     * @returns {void}
     */
    pipe: (event) => {
        // skriv om och förenkla
        let target = event.target;
        let point = {};

        target.closePopup();

        //If pipe is null create the first point
        if (pipe != null) {
            point.id = event.sourceTarget._leaflet_id;
            if (target.length) {
                point = addBranchConnection(event, target);
            }
            pipe.draw(0, 0, point.id, event.latlng);
            pipe = null;
        } else {
            point.id = event.sourceTarget._leaflet_id;
            if (target.length) {
                point = addBranchConnection(event, target);
            }
            pipe = new Pipe([event.latlng], ["", ""], pipeChoice, point.id);
        }
    },

    /**
     * search - Search functionality to the map using a plugin.
     *    - @see {@link https://esri.github.io/esri-leaflet/api-reference/controls/geosearch.html}
     *
     * @returns {void}
     */
    search: () => {
        L.esri.Geocoding.geosearch().addTo(map);
    }
};

/**
 * calcLengthFromPipe - Gets an individual polyline and calculates the length.
 *
 * @param {array} array
 * @returns {void}
 */
export let getLength = (polyline) => {
    // behövs kommenteras
    var tempPolyline = polyline._latlngs;
    var thisPipeDistance = 0;

    if (tempPolyline.length == 2) {
        return tempPolyline[0].distanceTo(tempPolyline[1]);
    } else if (tempPolyline.length > 2) {
        for (var i = 0; i < tempPolyline.length - 1; i++) {
            var firstPoint = tempPolyline[i];
            var secondPoint = tempPolyline[i + 1];

            thisPipeDistance += L.latLng(firstPoint).distanceTo(secondPoint);
        }
        return thisPipeDistance;
    }
};

/**
 * addBranchConnection - Description
 *
 * @param {type} pipe Description
 * @param {type} event         Description
 * @param {type} target        Description
 *
 * @returns {type} Description
 */
let addBranchConnection = (event, target) => {
    // behövs kommenteras grundligt
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

    let branchMarker = new Marker(event.latlng, ["Förgrening"], L.icon({
        iconAnchor: [19.5, 19.5],
        iconSize: [39, 39],
        iconUrl: url,
        popupAnchor: [0, -19.5]
    }));

    newLine = {
        latlngs: secondLatlngs,
        first: branchMarker.marker._leaflet_id,
        last: target.connected_with.last
    };
    target.connected_with.last = branchMarker.marker._leaflet_id;

    let newPipe = new Pipe(newLine.latlngs, [""], target.type, newLine.first);

    newPipe.draw(0, 0, newLine.last);

    return {
        latlng: branchMarker.marker._latlng,
        id: branchMarker.marker._leaflet_id
    };
};


/**
 * clearStartPolyline - Set varible pipe equals to null.
 * 					  - This is called from clearMapsEvents()
 * 		 			  - This function is used because export varibles is read-only
 *
 * @returns {void}
 */
export let clearStartPolyline = () => {
    pipe = null;
};


/**
 * clearHouse - Description
 *
 * @returns {type} Description
 */
export let clearHouse = () => {
    house = null;
};
