const value_types = [
  // first 7 are used in AQI
  'PM2.5',
  'PM10',
  'O3 - 1h',
  'O3 - 8h',
  'CO',
  'SO2',
  'NO2',
  // 'Temperature',
  // 'Humidity',
  // 'Pressure',
  'PM1',
  'NH3',
  'CO2',
  'Radiation',
  // 'Sound',
];
const value_units = [
  'AQI',
  'AQI',
  'AQI',
  'AQI',
  'AQI',
  'AQI',
  'AQI',
  // 'Temperature',
  // 'Humidity',
  // 'Pressure',
  'нг/м<sup>3</sup>',
  'ppm',
  'ppm',
  'мкР/год',
  // 'Sound',
];

const base_url = 'https://i.imgur.com/';
const url = ''; // PRODUCTION
// const url = 'http://localhost:8080'; // DEVELOPMENT

let current_marker = null;
let map;
let map_zoom = 14;
let marker_zoom = 16;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 50.515, lng: 30.785 },
    zoom: map_zoom,
    clickableIcons: false,
  });

  map.addListener('click', (event) => {
    if (!current_marker) return;
    displayLoading();
    stopMarker(current_marker);
    current_marker = null;
    displayAqi(url, false);
    map.setZoom(map_zoom);
  });
}

function displayAqi(url, draw_markers = true) {
  fetch(url + '/map')
    .then((response) => response.json())
    .then((data) => {
      if (!data.length) {
        displayEmpty();
        return;
      }

      let average_aqi = 0;
      let average_values = {};
      let created = data[0].created;
      let point;

      for (point of data) {
        average_aqi += point.aqi;
        center = {
          lat: parseFloat(point.latitude),
          lng: parseFloat(point.longitude),
        };

        icon = {
          url: base_url + aqiMarkerColor(point.aqi),
          origin: new google.maps.Point(0, 0),
          labelOrigin: new google.maps.Point(14, 15),
          anchor: new google.maps.Point(13, 43),
          size: new google.maps.Size(27, 43),
        };

        if (draw_markers) {
          let marker = new google.maps.Marker({
            map,
            icon,
            position: center,
            title: point.aqi.toString(),
            label: {
              text: point.aqi.toString(),
              color: 'black',
              fontFamily: 'Roboto',
              fontWeight: 'thin',
              fontSize: '14px',
            },
          });

          marker.addListener('mouseup', () => {
            if (!marker.getAnimation()) {
              displayLoading();
              map.setZoom(marker_zoom);
              stopMarker(current_marker);
              current_marker = marker;
              startMarker(marker);
              displayAreaAqi(url, marker.getPosition());
            } else {
              displayLoading();
              map.setZoom(map_zoom);
              stopMarker(marker);
              displayAqi(url, false);
            }
          });
        }

        for (let value_type of value_types) {
          if (!(value_type in average_values)) {
            average_values[value_type] = {
              value: 0,
              count: 0,
            };
          }

          average_values[value_type]['value'] += +point[value_type];
          average_values[value_type]['count'] += 1;
        }
      }

      average_aqi /= data.length;
      for (let value in average_values) {
        average_values[value] = Math.round(
          average_values[value]['value'] / average_values[value]['count'],
        );
      }

      if (created < point.created) {
        created = point.created;
      }

      displayData(average_aqi, average_values, created);
    })
    .catch((error) => {
      displayEmpty();
      console.error(error);
    });
}

function displayAreaAqi(url, position) {
  fetch(
    url +
      '/area?' +
      new URLSearchParams({
        latitude: position.lat(),
        longitude: position.lng(),
      }),
  )
    .then((response) => response.json())
    .then((point) => {
      if (!point) {
        document.querySelector('div#aqi-general h1').innerHTML = 'N/A';
        document.querySelector('div#aqi-general h4').innerHTML =
          'No data available';
        document.querySelector('span#latest-update').innerHTML =
          'no data available';
        document.querySelector(
          'table',
        ).innerHTML += `<tr><td>no data</td><td>no data</td></tr>`;
        return;
      }

      let values = {};
      for (let value_type of value_types) {
        values[value_type] = point[value_type];
      }

      displayData(point.aqi, values, point.created);
    })
    .catch((error) => {
      console.log(error);
    });
}

function displayData(aqi, values, created) {
  document.querySelector('div#aqi-general h1').innerHTML = Math.round(aqi);
  document.querySelector('div#aqi-general h4').innerHTML = aqiDescription(aqi);
  document.querySelector('span#latest-update').innerHTML = created;
  document.querySelector('table').innerHTML =
    '<tr><th>параметр</th><th>значення</th></tr>';

  let value, unit;
  for (value in values) {
    unit = value_units[value_types.indexOf(value)];
    document.querySelector(
      'table',
    ).innerHTML += `<tr><td>${value}</td><td>${values[value]} ${unit}</td></tr>`;
  }
}

function displayLoading() {
  document.querySelector('div#aqi-general h1').innerHTML = '...';
  document.querySelector('div#aqi-general h4').innerHTML = 'Завантаження...';
  document.querySelector('span#latest-update').innerHTML = '...';
  document.querySelector('table').innerHTML =
    '<tr><th>параметр</th><th>значення</th></tr>';
  document.querySelector(
    'table',
  ).innerHTML += `<tr><td>...</td><td>...</td></tr>`;
}

function displayEmpty() {
  document.querySelector('div#aqi-general h1').innerHTML = 'N/A';
  document.querySelector('div#aqi-general h4').innerHTML = 'Немає даних';
  document.querySelector('span#latest-update').innerHTML = 'немає даних';
  document.querySelector('table').innerHTML =
    '<tr><th>параметр</th><th>значення</th></tr>';
  document.querySelector(
    'table',
  ).innerHTML += `<tr><td>пусто</td><td>пусто</td></tr>`;
}

function aqiDescription(aqi) {
  if (aqi >= 0 && aqi <= 50) {
    return 'ПОВНІСТЮ БЕЗПЕЧНО';
  } else if (aqi > 50 && aqi <= 100) {
    return 'ЗАДОВІЛЬНО';
  } else if (aqi > 100 && aqi <= 150) {
    return 'ШКІДЛИВО ДЛЯ ПЕВНИХ КАТЕГОРІЙ';
  } else if (aqi > 150 && aqi <= 200) {
    return 'ШКІДЛИВО';
  } else if (aqi > 200 && aqi <= 300) {
    return 'ДУЖЕ ШКІДЛИВО';
  } else if (aqi > 300 && aqi <= 500) {
    return 'НЕБЕЗПЕЧНО';
  }
}

function aqiMarkerColor(aqi) {
  if (aqi >= 0 && aqi <= 50) {
    // return 'good.png';
    return 'LLk8g21.png';
  } else if (aqi > 50 && aqi <= 100) {
    // return 'moderate.png';
    return '9FO3q7C.png';
  } else if (aqi > 100 && aqi <= 150) {
    // return 'unhealthy-for-sensitive-groups.png';
    return 'aCp0ABz.png';
  } else if (aqi > 150 && aqi <= 200) {
    // return 'unhealthy.png';
    return 'O5wvyYU.png';
  } else if (aqi > 200 && aqi <= 300) {
    // return 'very-unhealthy.png';
    return '3iSK85T.png';
  } else if (aqi > 300 && aqi <= 500) {
    // return 'hazardous.png';
    return 'u3MyHA2.png';
  }
}

function startMarker(marker) {
  if (!marker) return;

  marker.setLabel(null);
  map.panTo(marker.getPosition());
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(() => {
    marker.setLabel(null);
  }, 600);
}

function stopMarker(marker) {
  if (!marker) return;

  marker.setAnimation(null);
  setTimeout(() => {
    marker.setLabel(marker.getTitle());
  }, 600);
}

initMap();
displayAqi(url);
