function displayAqi() {
  fetch('http://localhost:8080/map')
    .then((response) => response.json())
    .then((data) => {
      if (!data.length) {
        document.querySelector('div#aqi-general h1').innerHTML = 'N/A';
        document.querySelector('div#aqi-general h4').innerHTML =
          'No data available';
        document.querySelector('span#latest-update').innerHTML =
          'No data available';
        return;
      }

      let point;
      let average_aqi = 0;
      let base_url = 'https://i.imgur.com/';

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
          animation: google.maps.Animation.DROP,
          title: 'AQI',
          label: {
            text: point.aqi.toString(),
            color: 'black',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            fontSize: '14px',
          },
        });
      }

      average_aqi /= data.length;
      document.querySelector('div#aqi-general h1').innerHTML = Math.round(
        average_aqi,
      );
      document.querySelector('div#aqi-general h4').innerHTML = aqiDescription(
        average_aqi,
      );
      document.querySelector('span#latest-update').innerHTML = point.created;
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

displayAqi();
