"use client";

import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { TourRoute } from "@/lib/data/tourStops";

const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ??
  "pk.eyJ1Ijoic2VvdWxjaXR5dGlnZXJidXMiLCJhIjoiY200czRpMWN5MGIzZjJrb2k0NW1zMHh2eCJ9.wonTUTAacShXj9ojs4MTew";

const SEOUL_CENTER: [number, number] = [126.988, 37.566];

interface Props {
  tour: TourRoute;
  landmarksVisible: boolean;
  onStopSelect?: (index: number) => void;
}

export default function TourMap({ tour, landmarksVisible, onStopSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const landmarkMarkersRef = useRef<mapboxgl.Marker[]>([]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: SEOUL_CENTER,
      zoom: 13,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers & route when tour changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Wait for style to load
    function updateRoute() {
      // Remove existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Remove existing route layer/source
      if (map!.getLayer("tour-route")) map!.removeLayer("tour-route");
      if (map!.getSource("tour-route")) map!.removeSource("tour-route");

      // Add stop markers
      tour.stops.forEach((stop, idx) => {
        const el = document.createElement("div");
        el.className = "tour-stop-marker";
        el.style.cssText = `
          width: 28px; height: 28px; border-radius: 50%;
          background: ${tour.color}; border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 11px; font-weight: 700; cursor: pointer;
        `;
        el.textContent = String(idx + 1);

        const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(
          `<div style="padding:8px;font-family:sans-serif">
            <strong style="font-size:13px">${stop.name}</strong><br/>
            <span style="font-size:11px;color:#666">Stop ${String(idx + 1).padStart(2, "0")} · ${tour.code}</span>
          </div>`
        );

        el.addEventListener("click", () => onStopSelect?.(idx));

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([stop.lng, stop.lat])
          .setPopup(popup)
          .addTo(map!);

        markersRef.current.push(marker);
      });

      // Draw route line using full polyline coordinates
      if (tour.routeCoords.length > 1) {
        map!.addSource("tour-route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: tour.routeCoords,
            },
          },
        });

        map!.addLayer({
          id: "tour-route",
          type: "line",
          source: "tour-route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": tour.color,
            "line-width": 4,
            "line-opacity": 0.7,
          },
        });
      }

      // Center on Stop 1, or first route coord for tours with no stops
      if (tour.stops.length > 0) {
        const stop1 = tour.stops[0];
        map!.flyTo({ center: [stop1.lng, stop1.lat], zoom: 14, duration: 800 });
      } else if (tour.routeCoords.length > 0) {
        const first = tour.routeCoords[0];
        map!.flyTo({ center: first, zoom: 13, duration: 800 });
      }
    }

    if (map.isStyleLoaded()) {
      updateRoute();
    } else {
      map.on("load", updateRoute);
    }
  }, [tour]);

  // Toggle landmarks — uses per-tour landmark data
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing landmark markers
    landmarkMarkersRef.current.forEach((m) => m.remove());
    landmarkMarkersRef.current = [];

    if (!landmarksVisible || tour.landmarks.length === 0) return;

    tour.landmarks.forEach((lm) => {
      const el = document.createElement("div");
      el.style.cssText = `
        display: flex; flex-direction: column; align-items: center; gap: 2px; cursor: pointer;
      `;

      const icon = document.createElement("img");
      icon.src = lm.icon;
      icon.alt = lm.name;
      icon.style.cssText = `
        width: 36px; height: 36px; border-radius: 50%; object-fit: cover;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 2px solid white;
      `;

      const label = document.createElement("span");
      label.textContent = lm.name;
      label.style.cssText = `
        background: rgba(245,242,234,0.95); padding: 2px 6px; border-radius: 6px;
        font-size: 10px; font-weight: 500; white-space: nowrap;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      `;

      el.appendChild(icon);
      el.appendChild(label);

      const popup = new mapboxgl.Popup({ offset: 20, closeButton: true }).setHTML(
        `<div style="padding:8px;font-family:sans-serif">
          <strong style="font-size:13px">${lm.name}</strong><br/>
          <span style="font-size:11px;color:#666">${lm.description}</span>
        </div>`
      );

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lm.lng, lm.lat])
        .setPopup(popup)
        .addTo(map);

      landmarkMarkersRef.current.push(marker);
    });
  }, [landmarksVisible, tour]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[500px] rounded-xl max-md:h-[350px]"
    />
  );
}
