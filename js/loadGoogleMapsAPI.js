/* global document*/

import {
  key
} from "./getKey.js";

const scri = document.createElement("script");

scri.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=myMap`;
document.head.appendChild(scri).addEventListener("load", myMap);



function myMap() {
  var mapProp = {
    center: new google.maps.LatLng(56.16156, 15.58661),
    zoom: 15,
  };
  var map = new google.maps.Map(document.getElementById("printMap"), mapProp);
}
