<script lang="ts">
  // @ts-ignore
  import Chart from "svelte-frappe-charts";
  import { currentSession, latestPlacemark, subTitle } from "$lib/stores";
  import PlacemarkForm from "./PlacemarkForm.svelte";
  import Card from "$lib/ui/Card.svelte";
  import LeafletMap from "$lib/ui/LeafletMap.svelte";
  import { placemarkService } from "$lib/services/placemark-service";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import type { Placemark, DataSet } from "$lib/types/placemark-types";
  import { calculateCategoryData } from "$lib/utils/placemark-calculations";

  export const ssr = false;
  
  let placemarks: Placemark[] = [];
  let categoriesTotal: DataSet;
  let map: LeafletMap;
  subTitle.set("Create Placemarks");

  onMount(async () => {
    placemarks = await placemarkService.getPlacemarks(get(currentSession));
    categoriesTotal = calculateCategoryData(placemarks);

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

  latestPlacemark.subscribe(async (createdPlacemark) => {
  if (createdPlacemark) {
    placemarks.unshift(createdPlacemark);
    placemarks = [...placemarks];
    categoriesTotal = calculateCategoryData(placemarks);
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
  }
});
</script>

<div class="columns">
  <div class="column">
    <Card title="Placemark Locations">
      <LeafletMap height={50} bind:this={map}/>
    </Card>
    <Card title="Placemarks by Category">
      <Chart data={categoriesTotal} type="bar" />
    </Card>
  </div>
  <div class="column is-one-third">
    <Card title="Create a new Placemark">
      <PlacemarkForm />
    </Card>
    </div>
</div>

