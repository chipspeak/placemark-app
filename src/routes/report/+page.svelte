<script lang="ts">
  import { subTitle } from "$lib/stores";
  import Card from "$lib/ui/Card.svelte";
  import PlacemarkList from "$lib/ui/PlacemarkList.svelte";
  import { columnSizeStore } from "$lib/stores";

  export let data: any;
  subTitle.set("View All Placemarks");

  // Define options for column sizes
  const columnSizes = [
    { label: 'Half', value: 'is-half' },
    { label: 'One Third', value: 'is-one-third' },
    { label: 'Full Width', value: 'is-full' },
  ];
</script>

<Card title="All Placemarks" icon="fa-map">
  <!-- Place text "Card Size" and select in the header-extra slot -->
  <span slot="header-extra" class="is-flex is-align-items-center">
    <span class="mr-2">Card Size:</span> <!-- Add text "Card Size" -->
    <span class="select is-small">
      <select bind:value={$columnSizeStore}>
        {#each columnSizes as { label, value }}
          <option value={value}>{label}</option>
        {/each}
      </select>
    </span>
  </span>
  
  <!-- Main content -->
  <div class="columns">
    <PlacemarkList data={data} placemarks={data.placemarks} />
  </div>
</Card>