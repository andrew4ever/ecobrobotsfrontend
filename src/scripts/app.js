fetch('http://localhost:8080/map')
  .then((response) => response.json())
  .then((data) => {
    if (!data.length) {
      document.querySelector('div#aqi-general h2').innerHTML = 'N/A';
      document.querySelector('div#aqi-general h5').innerHTML =
        'No data available';
      document.querySelector('span#latest-update').innerHTML =
        'No data available';
      return;
    }

    let point;
    let average_aqi = 0;
    let base_url = '';

    for (point of data) {
      average_aqi += point.aqi;
      center = {
        lat: parseFloat(point.latitude),
        lng: parseFloat(point.longitude),
      };

      icon = {
        url: base_url + aqiMarkerColor(point.aqi),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 10),
        size: new google.maps.Size(20, 32),
      };

      new google.maps.Marker({
        map,
        // icon,
        position: center,
        animation: google.maps.Animation.DROP,
        title: 'AQI',
        label: {
          text: point.aqi.toString(),
          color: 'white',
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
    return 'marker-good.png';
  } else if (aqi > 50 && aqi <= 100) {
    return 'marker-moderate.png';
  } else if (aqi > 100 && aqi <= 150) {
    return 'marker-unhealthy-for-sensitive-groups.png';
  } else if (aqi > 150 && aqi <= 200) {
    return 'marker-unhealthy.png';
  } else if (aqi > 200 && aqi <= 300) {
    return 'marker-very-unhealthy.png';
  } else if (aqi > 300 && aqi <= 500) {
    return 'marker-hazardous.png';
  }
}
