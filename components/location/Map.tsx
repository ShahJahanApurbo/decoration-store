"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Dragon Mart 2 coordinates from the Google Maps link
const DRAGON_MART_POSITION: [number, number] = [25.1736564, 55.4218204];

export default function Map() {
  return (
    <MapContainer
      center={DRAGON_MART_POSITION}
      zoom={16}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={DRAGON_MART_POSITION}>
        <Popup>
          <div className="text-center">
            <h3 className="font-semibold mb-2">DecoStore</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Dragon Mart 2, Dubai
            </p>
            <p className="text-xs">Visit us for beautiful home decorations!</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
