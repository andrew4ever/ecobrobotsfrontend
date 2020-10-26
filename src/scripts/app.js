function displayAqi(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (!data.length) {
        document.querySelector('div#aqi-general h1').innerHTML = 'N/A';
        document.querySelector('div#aqi-general h4').innerHTML =
          'No data available';
        document.querySelector('span#latest-update').innerHTML =
          'no data available';
        return;
      }

      let value_types = [
        'pm25',
        'pm100',
        'o31',
        'o38',
        'co',
        'so2',
        'no2',
        'temp',
        'humi',
        'press',
        'pm1',
        'nh3',
        'co2',
        'rad',
        'sound',
      ];
      let aqi_value_types = ['pm25', 'pm100', 'o31', 'o38', 'co', 'so2', 'no2'];
      let base_url = 'https://i.imgur.com/';
      let average_aqi = 0;
      let average_values = {};
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
          anchor: new google.maps.Point(14, 43),
          size: new google.maps.Size(27, 43),
        };

        new google.maps.Marker({
          map,
          icon,
          position: center,
          title: 'AQI',
          label: {
            text: point.aqi.toString(),
            color: 'black',
            fontFamily: 'Roboto',
            fontWeight: 'thin',
            fontSize: '14px',
          },
        });

        for (let value_type of aqi_value_types) {
          if (!(value_type in average_values)) {
            average_values[value_type] = {
              value: 0,
              count: 0,
            };
          }

          average_values[value_type]['value'] += point[value_type];
          average_values[value_type]['count'] += 1;
        }
      }

      average_aqi /= data.length;
      document.querySelector('div#aqi-general h1').innerHTML = Math.round(
        average_aqi,
      );
      document.querySelector('div#aqi-general h4').innerHTML = aqiDescription(
        average_aqi,
      );
      document.querySelector('span#latest-update').innerHTML = point.created;

      let value, v;
      for (value in average_values) {
        v = average_values[value]['value'] / average_values[value]['count'];
        document.querySelector(
          'table',
        ).innerHTML += `<tr><td>${value}</td><td>${v}</td></tr>`;
      }
    })
    .catch((error) => {
      console.error(error);
    });
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

displayAqi('/map'); // PRODUCTION
// displayAqi('http://localhost:8080/map'); // DEVELOPMENT
