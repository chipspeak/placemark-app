<script lang="ts">
    import Card from "$lib/ui/Card.svelte";
    import Gallery from "./Gallery.svelte";
    import { cardColumnSizeStore } from "$lib/stores";
    import { subTitle } from "$lib/stores";

    export let data: any;
  subTitle.set("View All Placemarks");

  // Define options for column sizes
  const columnSizes = [
    { label: 'Full Width', value: 'is-full' },
    { label: 'Half', value: 'is-half' },
    { label: 'One Third', value: 'is-one-third' },
  ];
</script>

<Card title="Placemark Gallery" icon="fa-camera">
  <!-- Inject the select dropdown into the header-extra slot -->
  <span slot="header-extra" class="is-flex is-align-items-center">
    <span class="mr-2">Card Size:</span> <!-- Add text "Card Size" -->
    <span class="select is-small">
      <select bind:value={$cardColumnSizeStore}>
        {#each columnSizes as { label, value }}
          <option value={value}>{label}</option>
        {/each}
      </select>
    </span>
  </span>
  
  <!-- Main content -->
  <div class="columns {$cardColumnSizeStore}">
    <Gallery placemarks={data.placemarks} />
  </div>
</Card>
    