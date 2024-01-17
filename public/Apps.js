import { currentLayer, getEarthquake } from "../components/getEarthquake.js";
import { animated } from "../components/animated.js";
import { lineConfig, } from "../components/getChartCount.js";

export const map = L.map('map')

var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 25
}).addTo(map);

// const baseUrl = 'http://localhost:8080/geoserver/BVT/wms?'
// let currentWms = L.tileLayer.wms(baseUrl, {
//   layers: `BVT:outerindonesia`,
//   transparent: true,
//   format: 'application/json'
// }).addTo(map)

let jatinangor = [-7.757427, 110.3773647]
map.setView(jatinangor, 6)

$('#apply').click(getEarthquake)
$('#playButton').click(animated)

const chartEarthquake = new Chart($('#chartEarthquake'), lineConfig);
const expandedChartEarthquake = new Chart($('#expandedChartEarthquake'), lineConfig);

$('#expandEarthquakeChart').click(() => {
  $('#modalEarthquakeWrapper').toggle()
})
$('#collapseEarthquakeChart').click(() => {
  $('#modalEarthquakeWrapper').toggle()
})
$('#expandMagnitudeChart').click(() => {
  $('#modalMagnitudeWrapper').toggle()
})
$('#collapseMagnitudeChart').click(() => {
  $('#modalMagnitudeWrapper').toggle()
})
$('#expandDepthChart').click(() => {
  $('#modalDepthWrapper').toggle()
})
$('#collapseDepthChart').click(() => {
  $('#modalDepthWrapper').toggle()
})

$('.chart-toggle-button').click(function() {
  const wrapperId = $(this).data('wrapper-id');
  $(`#modal${wrapperId}Wrapper`).toggle();
});