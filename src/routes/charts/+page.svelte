<script lang="ts">
  // @ts-ignore
  import Chart from "svelte-frappe-charts";
  import Charts from "./Charts.svelte";
  import Card from "$lib/ui/Card.svelte";
  import { subTitle } from "$lib/stores";
  import type { DataSet } from "$lib/types/placemark-types";
  import { placemarkService } from "$lib/services/placemark-service";
  import { currentSession, placemarkStore } from "$lib/stores";
  import { get } from "svelte/store";
  import { calculateCategoryData } from "$lib/utils/placemark-calculations";
  import { onMount } from "svelte";

  subTitle.set("Charts");

  let placemarks = [];

  placemarkStore.subscribe((value) => {
    placemarks = value;
  });

  let categoriesTotal: DataSet = {
    labels: [],
    datasets: [{ values: [] }]
  };

  onMount(async () => {
    const fetchedPlacemarks = await placemarkService.getPlacemarks(get(currentSession));
    categoriesTotal = calculateCategoryData(fetchedPlacemarks);
  });
</script>

<!-- Gallery of placemark images -->
<div>
  <Card title="Charts">
    <div class="columns">
      <div class="column has-text-centered">
        <h1 class="title is-4">Categories by number of Placemarks</h1>
        <Chart data={categoriesTotal} type="bar" />
      </div>
    </div>
  </Card>
</div>
