<script lang="ts">
  import { currentSession, latestPlacemark, subTitle } from "$lib/stores";
  import PlacemarkForm from "./PlacemarkForm.svelte";
  import Card from "$lib/ui/Card.svelte";
  import { placemarkService } from "$lib/services/placemark-service";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import type { Placemark } from "$lib/types/placemark-types";
  import PlacemarkList from "$lib/ui/PlacemarkList.svelte";

  let placemarks: Placemark[] = [];
  let columnSize: string = "is-half";
  subTitle.set("Create Placemarks");

  onMount(async () => {
    placemarks = await placemarkService.getPlacemarks(get(currentSession));
  });

  latestPlacemark.subscribe(async (createdPlacemark) => {
  if (createdPlacemark) {
    placemarks.unshift(createdPlacemark);
    placemarks = [...placemarks];
  }
});
</script>

<div class="columns">
  <div class="column">
    <Card title="All Placemarks">
      <PlacemarkList {placemarks} {columnSize}/>
    </Card>
  </div>
  <div class="column is-one-third">
    <Card title="Create a new Placemark">
      <PlacemarkForm />
    </Card>
    </div>
</div>
