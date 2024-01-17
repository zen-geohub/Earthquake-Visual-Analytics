import { map } from "../public/Apps.js"
import { currentLayer, bufferCollection } from "./getEarthquake.js";

let timeseriesLayer
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export let animated = () => {
  if (bufferCollection.features.length === 0) {
    alert('Please apply the date first')
  }
  else {
    if (currentLayer) {
      map.removeLayer(currentLayer)
      let slider = $('#dateRangeSlider')

      if (slider.val() !== 0) {
        slider.val(0)

        let dateInfo = document.getElementById('date')
        let currentValue = parseInt(slider.val());

        slider.attr({
          max: bufferCollection["features"].length
        })

        $('.play').toggle()
        $('.pause').toggle()

        const timeseriesInterval = setInterval(() => {
          if (currentValue < bufferCollection["features"].length) {
            if (timeseriesLayer) {
              map.removeLayer(timeseriesLayer)
            }

            const dayNumber = currentValue;

            timeseriesLayer = L.geoJSON(bufferCollection.features[currentValue][`day${dayNumber}`], {
              style: {
                fillOpacity: 0.4,
                stroke: 0,
                color: 'red'
              },
              onEachFeature: (feature, layer) => {
                layer.bindPopup(`${feature.properties.date}`)
              }
            }).addTo(map)

            let currentDate = new Date(bufferCollection.features[currentValue][`day${dayNumber}`][0].properties.time)

            let formattedDate =
              days[currentDate.getDay()] + ', ' +
              currentDate.getDate() + ' ' +
              months[currentDate.getMonth()] + ' ' +
              currentDate.getFullYear();
            dateInfo.innerHTML = formattedDate;

            currentValue++;
            slider.val(currentValue);
          }

          else {
            const elementsToToggle = ['.countEarthquake', '.magnitudeChart', '.depthChart'];

            elementsToToggle.forEach(elementClass => {
              const $element = $(elementClass);

              if ($element.hasClass('block')) {
                $element.removeClass('block').addClass('hidden');
              }
            });

            if (timeseriesLayer) {
              map.removeLayer(timeseriesLayer)
            }
            clearInterval(timeseriesInterval);
            dateInfo.innerHTML = ""
            bufferCollection.features = []
            slider.val(0)
            $('.play').toggle()
            $('.pause').toggle()
          }
        }, 1000)
      }
    }

  }

}