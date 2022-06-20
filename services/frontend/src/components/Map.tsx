import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { icon } from "leaflet"

// "https://i.pinimg.com/originals/0f/61/ba/0f61ba72e0e12ba59d30a50295964871.png"
// Intentar hacer que lo importe de public y no de internet
const ICON = icon({
  iconUrl: "https://i.pinimg.com/originals/0f/61/ba/0f61ba72e0e12ba59d30a50295964871.png",
  iconSize: [64, 64],
})

const ICONPEOPLE = icon({
  iconUrl: "https://iconarchive.com/download/i57832/icons-land/vista-map-markers/Map-Marker-Marker-Inside-Pink.ico",
  iconSize: [36, 36],
})

const TagsToString = (tags) => {
  let str = "";
  tags.forEach(tag => {
    str += tag.name + " "
  })
  return str;
}

const Map = ({ markers, initialCoordinates }) => {
  let userMarkers;
  let peopleMarkers;

  if (initialCoordinates == null) {
    initialCoordinates = {lat: -33.498617, lng: -70.615722};
  } 

  if (markers) {
    userMarkers = markers.userMarkers.map((marker) => {
      const tags = TagsToString(marker.tags);
      return (
        <Marker position={[marker.position.coordinates[0], marker.position.coordinates[1]]} icon={ICON} key={marker.id}>
          <Popup>
            {marker.name} <br></br> {tags} 
          </Popup>
        </Marker>
      )
    });

    peopleMarkers = markers.peopleMarkers.map((marker) => {
      const tags = TagsToString(marker.tags);
      return (
        <Marker position={[marker.position.coordinates[0], marker.position.coordinates[1]]} icon={ICONPEOPLE} key={marker.id}>
          <Popup>
            {marker.user.username} <br></br> {marker.name} <br></br> {tags} 
          </Popup>
        </Marker>
      )
    });
  }  

  return (
    <MapContainer center={[initialCoordinates.lat, initialCoordinates.lng]} zoom={13} scrollWheelZoom={true} style={{height: 400, width: "100%"}}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userMarkers}
      {peopleMarkers}
    </MapContainer>
  )
}

export default Map