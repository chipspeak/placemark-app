<script lang="ts">
    import Card from "$lib/ui/Card.svelte";
    import LeafletMap from "$lib/ui/LeafletMap.svelte";
    import { onMount } from "svelte";
    import { subTitle } from "$lib/stores";
    import { placemarkService } from "$lib/services/placemark-service";
    import { get } from "svelte/store";
    import { currentSession, placemarkStore } from "$lib/stores";
    import type { Placemark } from "$lib/types/placemark-types";

    subTitle.set("Maps");
    let map: LeafletMap;

    onMount(async () => {
        const placemarks = await placemarkService.getPlacemarks(get(currentSession));
        placemarks.forEach((placemark: Placemark) => {
            const popup = `
            <Card/>
            <h1><strong>${placemark.title}</strong></h1>
            <br>
            <img src='${placemark.img}' alt='Placemark Image' style='width: 100%; height: auto;'>
        `;
            map.addMarker(placemark.latitude, placemark.longitude, popup);
        });
        const mostRecentPlacemark = placemarks[placemarks.length - 1];
        if (mostRecentPlacemark) {
            map.moveTo(mostRecentPlacemark.latitude, mostRecentPlacemark.longitude);
        }
    });
  </script>
  
  <Card title="Placemark Locations">
    <LeafletMap height={60} bind:this={map}/>
  </Card>