import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { icon } from "leaflet"

// Intentar hacer que lo importe de public y no de internet
const ICON = icon({
  iconUrl: "https://i.pinimg.com/originals/0f/61/ba/0f61ba72e0e12ba59d30a50295964871.png",
  iconSize: [64, 64],
})

const Map = () => {
  return (
    <MapContainer center={[-33.498617, -70.615722]} zoom={13} scrollWheelZoom={true} style={{height: 400, width: "100%"}}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[-33.498617, -70.615722]} icon={ICON}>
        <Popup>
          La PUC
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default Map