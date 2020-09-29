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

    for (point of data) {
      average_aqi += point.aqi;
      center = {
        lat: parseFloat(point.latitude),
        lng: parseFloat(point.longitude),
      };

      new google.maps.Marker({
        position: center,
        map,
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
    document.querySelector('div#aqi-general h2').innerHTML = Math.round(
      average_aqi,
    );
    document.querySelector('div#aqi-general h5').innerHTML = aqiDescription(
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

function areaPolygon(center) {}

// const triangleCoords = [
//   { lat: 25.774, lng: -80.19 },
//   { lat: 18.466, lng: -66.118 },
//   { lat: 32.321, lng: -64.757 },
//   { lat: 25.774, lng: -80.19 },
// ];

// const bermudaTriangle = new google.maps.Polygon({
//   paths: triangleCoords,
//   strokeColor: '#000000',
//   strokeOpacity: 0,
//   strokeWeight: 0,
//   fillColor: '#10FF00',
//   fillOpacity: 0.3,
// });
// bermudaTriangle.setMap(map);
