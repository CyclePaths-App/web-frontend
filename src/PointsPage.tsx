import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { getPoints } from "./api/points";

// Type for a point
interface Point {
  latitude: number;
  longitude: number;
  intensity?: number; // optional
}

// Component to add heat layer after map loads
function HeatmapLayer({ points }: { points: any[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length === 0) return;

    // Convert points into [lat, lng, intensity]
    const heatPoints: [number, number, number][] = points.map((p: any) => [
  p.latitude,
  p.longitude,
  1 // intensity (optional, can adjust)
]);
    // Add heat layer to map
    const heatLayer = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    }).addTo(map);

    // Cleanup on unmount
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

export default function PointsPage() {
  const [points, setPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    getPoints()
      .then((data) => {
        setPoints(data);
      })
      .catch((error) => {
        console.error("Error fetching points:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading map...</p>;
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
        <h2 style={{ textAlign: "center" }}>📍 Points Heatmap Viewer</h2>
       { }
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <input
                type="file"
                accept=".json"
                onChange={(e) => {
                    const file = e.target.files?.[0]; // get the first uploaded file
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event: ProgressEvent<FileReader>) => {
                    try {
                        const data = JSON.parse(event.target?.result as string);
                        setPoints(data);
                        setUploaded(true);
                        console.log("Uploaded points:", data);
                    } catch {
                        alert("Invalid JSON file");
                    }
                };
                reader.readAsText(file);
             }}
            />
            {uploaded && <p> JSON points loaded successfully</p>}
        </div>
      <MapContainer
        center={[42.6526, -73.7562]} // Default: Albany, NY
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />
        <HeatmapLayer points={points} />
      </MapContainer>
    </div>
  );
}
