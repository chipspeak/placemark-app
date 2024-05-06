<script lang="ts">
    import "leaflet/dist/leaflet.css";
    import { onMount } from "svelte";
    import type { Control, Map as LeafletMap, LayerGroup } from "leaflet";
    import { browser } from "$app/environment";
    import L from "leaflet";
  
    export let id = "home-map-id";
    export let height = 80;
    export let location = { lat: 53.2734, lng: -7.7783203 };
    export let zoom = 8;
    export let minZoom = 5;
    export let activeLayer = "Terrain";

    const categories = ["Park", "Castle", "Ancient Ruin", "Walk", "Beach", "River", "Lake", "Waterfall", "Hike", "Cave", "Ringfort", "Dolmen", "Monument", "National Park"];

    let imap: LeafletMap;
    let control: Control.Layers;
    let overlays: Control.LayersObject = {};
    let baseLayers: any;
    let categoryLayers: Record<string, LayerGroup> = {};
  
    onMount(async () => {
      if (browser) {
      const leaflet = await import("leaflet");
      categories.forEach(category => {
      categoryLayers[category] = L.layerGroup();
      });
      baseLayers = {
        Terrain: leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 17,
          attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        }),
        Satellite: leaflet.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
      })
      };



      let defaultLayer = baseLayers[activeLayer];
      imap = leaflet.map(id, {
        center: [location.lat, location.lng],
        zoom: zoom,
        minZoom: minZoom,
        layers: [defaultLayer, ...Object.values(categoryLayers)]
      });
      control = leaflet.control.layers(baseLayers, categoryLayers).addTo(imap);
    }
    });

    export function moveTo(lat: number, lng: number) {
    imap.flyTo({ lat: lat, lng: lng });
  }

    export async function addMarker(lat: number, lng: number, popupText: string, category: string) {
      const marker = L.marker([lat, lng]).addTo(imap);
      const popup = L.popup({ autoClose: false, closeOnClick: false });
      popup.setContent(popupText);
      marker.bindPopup(popup);
      categoryLayers[category].addLayer(marker);
    }


  </script>
  
  <div {id} class="box" style="height: {height}vh" />