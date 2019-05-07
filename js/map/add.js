/* global L */
let pipe = null;
let first;

export let house = null;

export let polylines = L.layerGroup();
export let markers = L.layerGroup();
export let polygons = L.layerGroup();

// Imports the map object.
import { map, pipeChoice, objectData } from "./loadLeafletMap.js";

import { elevationKey } from "./getKey.js";

// Imports three classes that are used for the project.
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
        let object;

        for (let i = 0; i < objectData.length; i++) {
            if (add.activeObjName == objectData[i].Modell) {
                object = objectData[i];
                break;
            }
        }

        new Marker(event.latlng, object, add.activeIcon);
    },

    /**
     * addHouse - Adds a polygon to the map, polygons is used to mark houses.
     *
     * @param {object} event
     * @returns {void}
     */
    house: (event) => {
        // Draws houses and displays it on map.
        if (house != null) {
            house.draw(event.latlng);
        } else {
            house = new House(event.latlng, ["house"]);
        }
    },

    /**
     * addPipe - Draws polylines on the map, polylines is also known as pipes.
     *
     * @param {object} event
     * @returns {void}
     */
    pipe: (event) => {
        let target = event.target;
        let point = {};

        target.closePopup();

        // If pipe is null create the first point.
        if (pipe != null) {
            point.id = event.sourceTarget.id;
            if (target.length) {
                point = addBranchConnection(event, target);
            }
            pipe.draw(point.id, event.latlng);
            if (first) {
                first.enableDragging();
                first = null;
            }
            pipe = null;
        } else {
            point.id = event.sourceTarget.id;
            if (target.length) {
                point = addBranchConnection(event, target);
                first = point.marker.disableDragging();
            } else if (target.options.draggable) {
                first = target.disableDragging();
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
 * getLength - Gets an individual polyline and calculates the length.
 *
 * @param {L.polyline} polyline @see {@link https://leafletjs.com/reference-1.4.0.html#polyline}
 * @returns {void}
 */
export let getLength = (polyline) => {
    // Gets the coords.
    var tempPolyline = polyline._latlngs;
    var thisPipeDistance = 0;

    // Calulates the total length according to number of points in the polyline.
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
 * addValueToPolyline - Adds the values recieved from addElevation() to the polyline
 *
 * @param {object} polyline - the polyline which the values will be added to
 * @param {int} value - Value from addElevation() fetch
 * @param {string} which - specifies where a value will be added
 *
 * @returns {void}
 */
let addValueToPolyline = (polyline, value, which) => {
    if (which == "maxHeight") {
        polyline.highestElevation = value;
    } else if (which == "firstHeight") {
        polyline.firstElevation = value;
    } else if (which == "lastHeight") {
        polyline.lastElevation = value;
    }
};

/**
 * addElevation - gets elevation values from google elevation API and calls
 * addValueToPolyline() to add them
 *
 * @param {object} polyline - which polyline to add the values to and get latlng
 * for the API call
 *
 * @returns {void}
 */
export let addElevation = (polyline) => {
    let latlngsArray = [];

    //Loops through polyline and creates and array with its lats and lngs
    for (var i = 0; i < 2; i++) {
        latlngsArray.push(polyline._latlngs[i].lat + "," + polyline._latlngs[i].lng);
    }
    //Instead of the array being separated by commas google API wants it separated
    //with a "pipe" which is why this is done
    latlngsArray = latlngsArray.join('|');

    //fetches google elevation API. https://cors-anywhere.herokuapp.com/ is
    //used to avoid cors error/network error when trying to call the API
    fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com" +
    "/maps/api/elevation/json?path=" + latlngsArray + "&samples=10&key=" + elevationKey, {
        method: "GET",
    })
        .then(response => response.json())
        .then(function(response) {
            //Find the highest elevation from the response
            let highestElevation = Math.max(...response.results.map(o => o.elevation), 0);
            //elevation where polyline starts
            let firstElevation = response.results[0].elevation;
            //elevation where polyline ends
            let lastElevation = response.results[9].elevation;

            //adds all the values we got to the polyline
            addValueToPolyline(polyline, highestElevation, "maxHeight");
            addValueToPolyline(polyline, firstElevation, "firstHeight");
            addValueToPolyline(polyline, lastElevation, "lastHeight");
        })
        .catch(error => console.error('Error:', error));
};

/**
 * addBranchConnection - Connecting pipes with each other and add a branch
 * connector between them.
 *
 * @param {type} event
 * @param {type} target The element selected by the user.
 *
 * @returns {void}
 */
let addBranchConnection = (event, target) => {
    let targetLatlngs = target.getLatLngs();
    let firstLatlngs;
    let secondLatlngs;
    let newLine;
    let distanceMin = Infinity;
    let segmentMin = null;

    // Finds closest point where user's click when connecting two pipes.
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

    addElevation(target);

    secondLatlngs.unshift(event.latlng);

    let url = 'https://cdn4.iconfinder.com/data/icons/bathroom-accessory-outline/32/14-512.png';

    // Creates the marker for branch connector.
    let branchMarker = new Marker(event.latlng, ["Förgrening"], L.icon({
        iconAnchor: [19.5, 19.5],
        iconSize: [39, 39],
        iconUrl: url,
        popupAnchor: [0, -19.5]
    }));

    newLine = {
        latlngs: secondLatlngs,
        first: branchMarker.marker.id,
        last: target.connected_with.last
    };
    target.connected_with.last = branchMarker.marker.id;

    let newPipe = new Pipe(newLine.latlngs, [""], target.type, newLine.first);

    newPipe.draw(newLine.last, null, target.dimension, target.tilt);

    return {
        marker: branchMarker.marker,
        id: branchMarker.marker.id
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
 * clearHouse - A house is marked when user cancels the drawing tool.
 *
 * @returns {void}
 */
export let clearHouse = () => {
    house = null;
};
