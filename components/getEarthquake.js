import { map } from "../public/Apps.js"

let userStartDate
let convertStartDate
let userEndDate
let convertEndDate

export let currentLayer

export let bufferCollection = turf.featureCollection()
bufferCollection.features = []

export let magnitudeLabels
export let magnitudeValues
export let depthLabels
export let depthValues

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = `0${date.getMonth() + 1}`.slice(-2)
  const day = `0${date.getDate()}`.slice(-2)
  const hours = `0${date.getHours()}`.slice(-2)
  const minutes = `0${date.getMinutes()}`.slice(-2)

  return `${year}/${month}/${day} ${hours}:${minutes}`
}

const groupByProperty = (data, property) =>
  data.reduce((acc, obj) => {
    const key = obj.properties[property];

    acc[key] = acc[key] || [];
    acc[key].push(obj);

    return acc;
  }, {});

const groupByDate = (data) =>
  data.reduce((acc, obj) => {
    const key = obj.properties.time.substring(0, 10);

    acc[key] = acc[key] || [];
    acc[key].push(obj);

    return acc;
  }, {});


let initializeMagnitudeChart = () => {
  const chartConfig = {
    type: "pie",
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          '#003f5c',
          '#7a5195',
          '#ef5675',
          '#ffa600'
        ],
        // borderColor: "rgba(19, 153, 108, 1)"
      }]
    },
    options: {
      maintainAspectRatio: true,
      // responsive: true,
      height: 250,
      layout: { padding: 0 },
      plugins: {
        legend: { display: false },
      },
    },
  };
  const chartCanvas = $("#magnitudeChart");
  const myChart = new Chart(chartCanvas, chartConfig);

  // chartCanvas.$chartjs.resizer.hidden = true;

  return myChart
}
const magnitudeChart = initializeMagnitudeChart();

let initializeExpandedMagnitudeChart = () => {
  const chartConfig = {
    type: "pie",
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          '#003f5c',
          '#7a5195',
          '#ef5675',
          '#ffa600'
        ],
        // borderColor: "rgba(19, 153, 108, 1)"
      }]
    },
    options: {
      maintainAspectRatio: false,
      // responsive: true,
      // height: 250,
      layout: { padding: 0 },
      plugins: {
        legend: {
          display: true,
          position: 'right',
        },
      },
    },
  };
  const modalCanvas = $("#expandedChartMagnitude")
  const modalChart = new Chart(modalCanvas, chartConfig);

  // chartCanvas.$chartjs.resizer.hidden = true;

  return modalChart
}
const expandedMagnitudeChart = initializeExpandedMagnitudeChart();

let initializeDepthChart = () => {
  const chartConfig = {
    type: "pie",
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          '#003f5c',
          '#7a5195',
          '#ef5675',
          '#ffa600'
        ],
        // borderColor: "rgba(19, 153, 108, 1)"
      }]
    },
    options: {
      maintainAspectRatio: true,
      // responsive: true,
      height: 250,
      layout: { padding: 0 },
      plugins: {
        legend: { display: false },
      },
    },
  };
  const chartCanvas = $("#depthChart");
  const myChart = new Chart(chartCanvas, chartConfig);

  // chartCanvas.$chartjs.resizer.hidden = true;

  return myChart;
}
const depthChart = initializeDepthChart();

let initializeExpandedDepthChart = () => {
  const chartConfig = {
    type: "pie",
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [
          '#003f5c',
          '#7a5195',
          '#ef5675',
          '#ffa600'
        ],
        // borderColor: "rgba(19, 153, 108, 1)"
      }]
    },
    options: {
      maintainAspectRatio: false,
      // responsive: true,
      // height: 180,
      layout: { padding: 0 },
      // elements: {
      //   arc: {
      //     // borderWidth: 0, // Set to 0 to remove borders
      //     borderColor: 'transparent',
      //   },
      // },
      plugins: {
        legend: {
          display: true,
          position: 'right',
        },
      },
    },
  };
  const modalCanvas = $("#expandedChartDepth")
  const modalChart = new Chart(modalCanvas, chartConfig);

  // chartCanvas.$chartjs.resizer.hidden = true;

  return modalChart
}
const expandedDepthChart = initializeExpandedDepthChart();

export const getEarthquake = async () => {
  userStartDate = $('#selectStartDate').val()
  convertStartDate = new Date(userStartDate)
  userEndDate = $('#selectEndDate').val()
  convertEndDate = new Date(userEndDate)

  let countEarthquake = document.getElementById('countEarthquake')

  if (convertStartDate <= convertEndDate) {
    convertStartDate.setHours(0, 0, 0, 0)
    convertEndDate.setHours(23, 59, 59, 999)

    let startDate = formatDate(convertStartDate)
    let endDate = formatDate(convertEndDate)

    const response = await fetch(`http://localhost:3000/api/Gempa/getDatabyDateRange/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}`)
    const data = await response.json()
    let cleanedData = []

    // if (startDate && endDate) {
    if (currentLayer) {
      map.removeLayer(currentLayer)
    }

    data.forEach(({ gempaindonesia }) => {
      const { properties, geometry } = gempaindonesia;

      const pointData = turf.point(geometry.coordinates, properties);
      const buffer = turf.buffer(pointData, properties.magnitude * 5, { units: 'kilometers' });

      bufferCollection["features"].push(buffer)
      cleanedData.push(buffer)
    })

    currentLayer = L.geoJSON(bufferCollection.features, {
      style: {
        fillOpacity: 0.4,
        stroke: 0,
        color: 'red'
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`${feature.properties.date}`)
        layer.bindPopup(`${feature.properties.magnitudeClass}`)
      }
    }).addTo(map)

    const elementsToToggle = ['.countEarthquake', '.magnitudeChart', '.depthChart'];
    elementsToToggle.forEach(elementClass => {
      const $element = $(elementClass);

      if ($element.hasClass('hidden')) {
        $element.removeClass('hidden').addClass('flex flex-col items-center');
      }
    });


    countEarthquake.innerHTML = `
      Accumulated Earthquake Events<br>
      <strong>${String(convertStartDate.getMonth() + 1).padStart(2, '0')}/${convertStartDate.getFullYear()} to 
      ${String(convertEndDate.getUTCMonth() + 1).padStart(2, '0')}/${convertEndDate.getFullYear()}</strong><br>
      <span style="font-size: 36px; font-weight: bold;">${data.length}</span>`;

    bufferCollection.features = []

    const magnitudeClass = groupByProperty(cleanedData, 'magnitudeClass');
    const depthClass = groupByProperty(cleanedData, 'depthClass');
    const sortedData = groupByDate(cleanedData);

    let updateChart = (chart, expandedChart, dataClass) => {
      const labels = Object.keys(dataClass);
      const values = labels.map(key => dataClass[key].length);

      chart.config._config.data.datasets[0].data = values;
      chart.config._config.data.labels = labels;
      chart.update();

      expandedChart.config._config.data.datasets[0].data = values;
      expandedChart.config._config.data.labels = labels;
      expandedChart.update();
    }

    // Usage
    updateChart(magnitudeChart, expandedMagnitudeChart, magnitudeClass);
    updateChart(depthChart, expandedDepthChart, depthClass);


    Object.keys(sortedData).forEach((key, index) => {
      const featureCollection = {
        type: 'FeatureCollection',
      }

      featureCollection[`day${index}`] = sortedData[key]

      bufferCollection["features"].push(featureCollection)
    });
  }
  else {
    alert('Please input the valid date')
  }
}
