<script lang="ts">
  // @ts-ignore
  import Chart from "svelte-frappe-charts";
  import Charts from "./Charts.svelte";
  import Card from "$lib/ui/Card.svelte";
  import { subTitle } from "$lib/stores";
  import type { DataSet } from "$lib/types/placemark-types";
  export let data: any;

  subTitle.set("Charts");
</script>

<!-- Gallery of placemark images -->
<div>
  <Card title="Charts">
    <div class="columns">
      <div class="column has-text-centered">
        <h1 class="title is-4">Categories by number of Placemarks</h1>
        <Chart data={data.categoriesTotal} type="bar" />
      </div>
    </div>
  </Card>
</div>
