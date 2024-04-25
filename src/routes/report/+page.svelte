<script lang="ts">
  import { placemarkService } from "$lib/services/placemark-service";
  import type { Placemark } from "$lib/types/placemark-types";
  import { currentSession, subTitle } from "$lib/stores";
  import Card from "$lib/ui/Card.svelte";
  import PlacemarkList from "$lib/ui/PlacemarkList.svelte";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  subTitle.set("View All Placemarks");
  let placemarks: Placemark[] = [];
  onMount(async () => {
    placemarks = await placemarkService.getPlacemarks(get(currentSession));
  });
</script>

<Card title="All Placemarks">
  <PlacemarkList {placemarks}/>
</Card>
