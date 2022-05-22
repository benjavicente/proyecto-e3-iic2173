let pointerMarker = {};

const loadMap = (container) => {
  let mapConfig = {
    minZoom: 3,
    maxZoom: 18,
    initialZoom: 12,
    defaultCoords: [-33.500005, -70.612867],
  }
  
  let map = L.map(container);
  let bounds = L.latLngBounds([[85, 180],[-85, -180]]);

  map.locate({enableHighAccuracy: true})

  map.once('locationfound', (e) => {
    map.setView([e.latitude, e.longitude], mapConfig.initialZoom);
  });

  map.once('locationerror', (e) => {
    map.setView(mapConfig.defaultCoords, mapConfig.initialZoom);
  });

  map.on('click', (e) => {
    document.getElementById("lat").value = e.latlng.lat;
    document.getElementById("long").value = e.latlng.lng;

    const markerIcon = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png'
    
    if (pointerMarker) {
      map.removeLayer(pointerMarker);
    }

    document.getElementById('addPositionButton').removeAttribute('disabled', '');
    pointerMarker = addMarker(map, [e.latlng.lat, e.latlng.lng], markerIcon);
  });
  
  map.options.minZoom = mapConfig.minZoom;
  map.options.maxZoom = mapConfig.maxZoom;
  map.options.maxBounds = bounds;
  map.options.maxBoundsViscosity = 1.0;
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map); 

  return map;
}


const addMarker = (map, coords, markerIcon) => {  
  let iconConfig = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  let newMarker = L.marker(coords, {icon: iconConfig});
  map.addLayer(newMarker);
  
  return newMarker;
}


const loadUserMarkers = (map, data) => {
  const markerIcon = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
  
  data.forEach(register => {
    let marker = addMarker(map, register.position.coordinates, markerIcon);

    marker.bindPopup(`
      <div class="text-center"><b>${register.name}</b></div>
      Registrado por ti (${formatDate(register.createdAt)})

      <div class="text-center">
        <span role="button" class="link-danger" onClick="deleteMarker(${register.id})">
          <i class="fa fa-trash-o" aria-hidden="true"></i> Eliminar
        </span>
      </div>
    `);
  });
}


const loadPeopleMarkers = (map, data) => {
  const markerIcon = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
  
  data.forEach(register => {
    let marker = addMarker(map, register.position.coordinates, markerIcon);
    
    marker.bindPopup(`
      <div class="text-center"><b>${register.name}</b></div>
      Registrado por ${register.user.username} (${formatDate(register.createdAt)})

      <div class="text-center">
        <span class="link-primary" role="button" onClick="sendPing(${register.user.id})">
          <i class="fa fa-heart-o" aria-hidden="true"></i> Enviar Ping
        </span>
      </div>
    `)
  });
}


const sendPing = (value) => {
  document.getElementById("userIdTo").value = value;
  document.getElementById("sendPingForm").submit();
}


const deleteMarker = (value) => {
  document.getElementById("markerId").value = value;
  document.getElementById("deleteMarkerForm").submit();
}
