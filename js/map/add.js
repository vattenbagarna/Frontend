/* global L */
let pipe = null;
let first;

export let house = null;

export let polylines = L.layerGroup();
export let markers = L.layerGroup();
export let polygons = L.layerGroup();

// Imports the map object.
import { map, icons, pipeChoice, objectData } from "./loadLeafletMap.js";

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
            house = new House(event.latlng, ["house"], '#3388ff');
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
export let getLength = (latlngs) => {
    let thisPipeDistance = 0;

    // Calulates the total length according to number of points in the polyline.
    if (latlngs.length == 2) {
        return L.latLng(latlngs[0]).distanceTo(latlngs[1]);
    } else if (latlngs.length > 2) {
        for (var i = 0; i < latlngs.length - 1; i++) {
            var firstPoint = latlngs[i];
            var secondPoint = latlngs[i + 1];

            thisPipeDistance += L.latLng(firstPoint).distanceTo(secondPoint);
        }
        return thisPipeDistance;
    }
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
    target.decorator.setPaths(firstLatlngs);

    secondLatlngs.unshift(event.latlng);

    // Creates the marker for branch connector.
    let icon = icons.find(element => element.category == "Förgrening");

    let branchMarker = new Marker(event.latlng, { Kategori: "Förgrening" }, icon.icon);

    newLine = {
        latlngs: secondLatlngs,
        first: branchMarker.marker.id,
        last: target.connected_with.last
    };
    target.connected_with.last = branchMarker.marker.id;

    let newPipe = new Pipe(newLine.latlngs, [""], target.type, newLine.first);

    newPipe.draw(
        newLine.last,
        null,
        target.elevation,
        target.material,
        target.dimension,
        target.tilt
    );

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
