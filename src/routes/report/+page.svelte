<script lang="ts">
  import { subTitle } from "$lib/stores";
  import Card from "$lib/ui/Card.svelte";
  import PlacemarkList from "$lib/ui/PlacemarkList.svelte";
  import { columnSizeStore, placemarkDisplayStore } from "$lib/stores";

  // Define the data prop to receive data from server
  export let data: any;

  // Set the subtitle for the page
  subTitle.set("View All Placemarks");

  // Define options for column sizes
  const columnSizes = [
    { label: 'Half', value: 'is-half' },
    { label: 'One Third', value: 'is-one-third' },
    { label: 'Full Width', value: 'is-full' },
  ];

  // Define options for user display choices
  const userDisplayChoices = [
    { label: 'View all', value: 'all' },
    { label: 'View mine', value: 'user' },
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

<!-- Display the PlacemarkList component using the card component -->
<Card title="Placemarks" icon="fa-map">
  <!-- Place text "Card Size" and select in the header-extra slot -->
  <span slot="header-extra" class="is-flex is-align-items-center hide-on-mobile">
    <span class="mr-2 hide-on-mobile">Size:</span> 
    <span class="select hide-on-mobile is-small">
      <select bind:value={$columnSizeStore}>
        {#each columnSizes as { label, value }}
          <option value={value}>{label}</option>
        {/each}
      </select>
    </span>
  </span>
  <span slot="header-extra-2" class="is-flex is-align-items-center">
    <span class="mr-2 ml-4">Filter:</span> 
    <span class="select is-small">
      <select bind:value={$placemarkDisplayStore}>
        {#each userDisplayChoices as { label, value }}
          <option value={value}>{label}</option>
        {/each}
      </select>
    </span>
  </span>
  
  <!-- Main content -->
  <div class="columns">
    <!-- Inject the PlacemarkList component into the column and pass the retrieved placemarks from the server side -->
    <PlacemarkList data={data} placemarks={data.placemarks} />
  </div>
</Card>