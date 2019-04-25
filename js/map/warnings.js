// /* eslint-disable no-unused-vars */
// /* global configuration */
//
// import { polylines, markers, polygons } from "./add.js";
//
// // _leafleat_id ska ersättas med id efter pull request
// let calcPressure = () => {
//     let currMarkers = markers.getLayers();
//
//     if (currMarkers[i].attributes.Pump != undefined) {
//         polylines.eachLayer((polyline) => {
//             for (let i = 0; i < currMarkers.length; i++) {
//                 if (currMarkers[i]._leaflet_id == polyline.connected_with.first) {
//                     //få längden
//                     let length = polyline.length;
//
//                     //få höjd
//                     let height = polyline.tilt;
//
//                     //få innerdiameter
//                     let dia = polyline.dimension;
//
//                     //få ytterdiameter?
//
//                     //göra beräkningar
//                     //kapacitet
//                     let outPress = 0;
//                     let inPress = 2;
//                     let mu = 0.015;
//
//                     let capacity = calcQPump(dia, mu, length, inPress, height, outPress);
//
//                     //hastighet
//                     let velocity = calcV(capacity, dia);
//
//                     //hitta pumpen
//                     let pump = currMarkers[i].attributes.Pump;
//
//                     //fetch pumpvärden
//                     fetch(`${configuration.apiURL}/obj/type/Pump?token=${token}`)
//                         .then((response) => {
//                             return response.json();
//                         })
//                         .then((json) => {
//                             for (let i = 0; i < json[0].length; i++) {
//                                 if (pump == json[0].Modell) {
//                                     pump = json[0];
//                                     break;
//                                 }
//                             }
//
//                             //antal pumpar
//                             // let nrOfPumps = currMarkers[i].attributes["Antal pumpar"];
//                             // let margin = 0.5;
//                             //
//                             // for (let k = 0; k < pump.Pumpkurva.length; k++) {
//                             //     if (pumps.Pumpkurva[k].y == inputHeight) {
//                             //         let mps = calcVel(pumps[i].Pumpkurva[k].x, dimension);
//                             //
//                             //         if (mps >= wantedFlow - margin && mps <= wantedFlow +
//                             //             margin) {
//                             //             let option = document.createElement("option");
//                             //
//                             //             option.text = pumps[i].Modell;
//                             //             select.add(option);
//                             //             break;
//                             //         }
//                             //     }
//                             // }
//                         });
//                 }
//             }
//         });
//     }
// };
//
// document.getElementById("calcButton").addEventListener("click", calcPressure);
//
// /**
//  * Calculate velocity
//  *
//  * @param {number} Önskad flödeskapacitet
//  * @param {number} innerdiameter
//  *
//  * @return {number} velocity
//  *
//  */
// function calcV(q, di) {
//     q /= 1000; // l/s
//     return 4 * 1000000 * q / (di * di * Math.PI);
// }
//
// /**
//  * calcQPump - Calculates capacity for pump pipes
//  *
//  * @param {number} Innerdimension
//  * @param {number} MU
//  * @param {number} Pipelength
//  * @param {number} Inpressure
//  * @param {number} Height
//  * @param {number} Outpressure
//  *
//  * @return {number} Capacity
//  *
//  */
// function calcQPump(di, mu, l, inPress, height, outPress) {
//     let dim = di / 1000;
//     let inMu = mu; // mm
//     let length = l; // m
//     let viscosity = 1e-6; // m2/s
//     let rho = 1000; // kg/m3
//
//     let deltap = (inPress - outPress + 0.0981 * (height) * rho / 1000) * 100000;
//
//     let top = -Math.PI / 2 * Math.pow(dim, 2.5);
//     let top2 = Math.sqrt(2 * deltap / (length * rho));
//     let inside = inMu / 1000 / (3.7 * dim);
//     let rightInside = (Math.pow(dim, 1.5) * Math.sqrt(2 * deltap / (length * rho)));
//     let avgQ = top * top2 * log10(inside + 2.51 * viscosity / rightInside);
//
//     return avgQ * 1000;
// }
//
// /**
//  * square - Calculates X squared
//  *
//  * @param {number} Value to square
//  *
//  * @return {number} Result of value squared
//  *
//  */
// function square(x) {
//     return Math.pow(x, 2);
// }
//
// /**
//  * log10 - Calculates X log10
//  *
//  * @param {number} Value to log10
//  *
//  * @return {number} Result of value log10
//  *
//  */
// function log10(x) {
//     return Math.LOG10E * Math.log(x);
// }
