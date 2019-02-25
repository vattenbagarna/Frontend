/* global document google*/

import {
    key
} from "./getKey.js";

const scri = document.createElement("script");

/**
 * Load google map from API into HTML
 * @returns {null} no need to return anything else
 */
const myMap = () => {
    const mapProp = {
        "center": new google.maps.LatLng(56.16156, 15.58661),
        "zoom": 15
    };
    const map = new google.maps.Map(
        document.getElementById("printMap"),
        mapProp
    );

    return map;
};


scri.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=myMap`;
document.head.appendChild(scri).addEventListener("load", myMap);
