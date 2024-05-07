<script lang="ts">
  import Card from "$lib/ui/Card.svelte";
  import LeafletMap from "$lib/ui/LeafletMap.svelte";
  import { onMount } from "svelte";
  import { subTitle } from "$lib/stores";
  import type { Placemark } from "$lib/types/placemark-types";

  subTitle.set("Maps");
	export let data: any;
  let map: LeafletMap;

  onMount(async () => {
		const leaflet = await import("leaflet");
    const placemarks = data.placemarks;
    placemarks.forEach((placemark: Placemark) => {
      if (placemark.img) {
      const popup = `
            <Card/>
            <h1><strong>${placemark.title}</strong></h1>
            <br>
            <img src='${placemark.img[0]}' alt='Placemark Image' style='width: 100%; height: auto;'>
        `;
        map.addMarker(placemark.latitude, placemark.longitude, popup, placemark.category);
      } else {
        const popup = `
            <Card/>
            <h1><strong>${placemark.title}</strong></h1>
            <br>
        `;
        map.addMarker(placemark.latitude, placemark.longitude, popup, placemark.category);
      }
      
    });
    const mostRecentPlacemark = placemarks[placemarks.length - 1];
    if (mostRecentPlacemark) {
      map.moveTo(mostRecentPlacemark.latitude, mostRecentPlacemark.longitude);
    }
  });
</script>

<Card title="Placemark Locations">
  <LeafletMap height={60} addCategories={false} bind:this={map} />
</Card>
