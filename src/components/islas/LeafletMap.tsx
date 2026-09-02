"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Rectangle, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import type { MapData } from "@/lib/con-textos/islas-def";

const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const ERA_COLOR: Record<string, string> = {
  isabelina: "#d9a441",
  restauracion: "#1f4e79",
  "dictadura-primo": "#4a4a4a",
  republica: "#7a1420",
  franquismo: "#4a4a4a",
  transicion: "#617685",
  democracia: "#ff6261",
};

function FitBounds({ data }: { data: MapData }) {
  const map = useMap();
  useEffect(() => {
    const pts: Array<[number, number]> = data.points.map((p) => [p.lat, p.lon]);
    for (const b of data.boxes) pts.push(b.bbox[0], b.bbox[1]);
    if (pts.length > 1) map.fitBounds(pts as LatLngBoundsExpression, { padding: [24, 24], maxZoom: 14 });
    else map.setView(data.center, data.zoom);
  }, [map, data]);
  return null;
}

/** Mapa Leaflet con teselas de OpenStreetMap. Solo se carga en cliente y bajo demanda. */
export default function LeafletMap({ data }: { data: MapData }) {
  return (
    <MapContainer
      center={data.center}
      zoom={data.zoom}
      minZoom={4}
      maxZoom={14}
      scrollWheelZoom={false}
      style={{ height: data.height, width: "100%" }}
      className="rounded-sm"
      attributionControl
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={OSM_ATTRIBUTION}
        errorTileUrl="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
      />
      <FitBounds data={data} />
      {data.boxes.map((b) => (
        <Rectangle key={b.id} bounds={b.bbox as LatLngBoundsExpression} pathOptions={{ color: ERA_COLOR[b.era ?? ""] ?? "#617685", weight: 1.5, fillOpacity: 0.08 }}>
          <Popup>
            <strong>{b.label}</strong>
            {b.note ? <p style={{ margin: "4px 0 0" }}>{b.note}</p> : null}
          </Popup>
        </Rectangle>
      ))}
      {data.points.map((p) => (
        <CircleMarker key={p.id} center={[p.lat, p.lon]} radius={7} pathOptions={{ color: "#fff", weight: 1.5, fillColor: ERA_COLOR[p.era ?? ""] ?? "#ff6261", fillOpacity: 0.95 }}>
          <Popup>
            <strong>{p.label}</strong>
            {p.note ? <p style={{ margin: "4px 0 0" }}>{p.note}</p> : null}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
