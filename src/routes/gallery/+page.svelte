<script lang="ts">
  import Card from "$lib/ui/Card.svelte";
  import Gallery from "./Gallery.svelte";
  import { cardColumnSizeStore } from "$lib/stores";
  import { subTitle } from "$lib/stores";

  // Define the data prop to receive data from server
  export let data: any;
  subTitle.set("View All Placemarks");

  // Define options for column sizes
  const columnSizes = [
    { label: "Full Width", value: "is-full" },
    { label: "Half", value: "is-half" },
    { label: "One Third", value: "is-one-third" }
  ];
</script>

<!-- CSS class for hiding elements on mobile -->
<style>
  @media (max-width: 768px) {
    .hide-on-mobile {
      display: none;
    }
  }
</style>

<Card title="Placemark Gallery" icon="fa-camera">
  <!-- Inject the select dropdown into the header-extra slot -->
  <span slot="header-extra" class="hide-on-mobile is-flex is-align-items-center">
    <span class="mr-2 hide-on-mobile">Card Size:</span>
    <!-- Add text "Card Size" -->
    <span class="select hide-on-mobile is-small">
      <select bind:value={$cardColumnSizeStore}>
        {#each columnSizes as { label, value }}
          <option {value}>{label}</option>
        {/each}
      </select>
    </span>
  </span>

  <!-- Main content -->
  <div class="columns {$cardColumnSizeStore}">
    <Gallery placemarks={data.placemarks} />
  </div>
</Card>
