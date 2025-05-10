let map;
let userPosition;
let directionsService;
let directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -23.5505, lng: -46.6333 },
    zoom: 15,
    mapTypeControl: false,
    styles: [
      { featureType: "poi", stylers: [{ visibility: "off" }] },
      { featureType: "transit", stylers: [{ visibility: "off" }] },
      { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
      { featureType: "administrative", stylers: [{ visibility: "off" }] }
    ]
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map.setCenter(userPosition);

        new google.maps.Marker({
          position: userPosition,
          map,
          title: "Você está aqui",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });
      },
      () => alert("Erro ao obter localização.")
    );
  } else {
    alert("Geolocalização não suportada pelo navegador.");
  }
}

document.getElementById("findHospitalBtn").addEventListener("click", () => {
  if (!userPosition) {
    alert("Aguardando localização...");
    return;
  }

  const service = new google.maps.places.PlacesService(map);
  const request = {
    location: userPosition,
    radius: 5000,
    keyword: "hospital",
  };

  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
      results.forEach((place) => {
        const marker = new google.maps.Marker({
          map,
          position: place.geometry.location,
          title: place.name,
          icon: {
            url: "https://cdn-icons-png.flaticon.com/512/2967/2967350.png",
            scaledSize: new google.maps.Size(20, 20),
          },
        });

        const photoUrl = place.photos
          ? place.photos[0].getUrl({ maxWidth: 250, maxHeight: 150 })
          : null;

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="font-family: Arial; max-width: 250px;">
              <strong>${place.name}</strong><br>
              ${place.vicinity || "Endereço não disponível"}<br>
              ${place.opening_hours
                ? place.opening_hours.open_now
                  ? "<span style='color:green'>Aberto agora</span>"
                  : "<span style='color:red'>Fechado agora</span>"
                : "Horário não disponível"}<br><br>
              ${
                photoUrl
                  ? `<img src="${photoUrl}" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 8px;" />`
                  : ""
              }
              <button onclick="tracarRota(${place.geometry.location.lat()}, ${place.geometry.location.lng()})">
                Traçar rota
              </button>
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });

      map.setCenter(results[0].geometry.location);
    } else {
      alert("Nenhum hospital encontrado nas proximidades.");
    }
  });
});

function tracarRota(destLat, destLng) {
  if (!userPosition) return;

  const request = {
    origin: userPosition,
    destination: { lat: destLat, lng: destLng },
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, (result, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(result);
    } else {
      alert("Erro ao traçar rota.");
    }
  });
}

window.initMap = initMap;
