<script lang="ts">
  import { onMount } from "svelte";
  import type { Placemark } from "$lib/types/placemark-types";
  import { placemarkService } from "$lib/services/placemark-service";
  import { currentSession, placemarkStore, subTitle } from "$lib/stores";
  import { get } from "svelte/store";

  export let placemarks: Placemark[] = [];

	subTitle.set("Image Gallery");

  // Subscribe to the placemark store to update the placemarks list
  placemarkStore.subscribe((value) => {
    placemarks = value;
  });

  onMount(async () => {
    // Fetch placemarks from the server when the component mounts
    const session = get(currentSession);
    if (session) {
      const fetchedPlacemarks = await placemarkService.getPlacemarks(session);
      if (fetchedPlacemarks) {
        placemarkStore.set(fetchedPlacemarks);
      }
    }
  });
</script>


<style>
  
  .card-image img {
    width: 100%; 
    height: 400px;
    object-fit: cover; 
  }
</style>


<div class="columns is-multiline">
  {#each placemarks as placemark}
    {#if placemark.img}
      <div class="column is-half">
        <div class="card">
          <div class="card-image">
            <figure class="image">
              <img src={placemark.img} alt={placemark.title} title={placemark.title} />
            </figure>
          </div>
          <footer class="card-footer">
            <p class="card-footer-item pt-5">{placemark.title}</p>
						<p class="card-footer-item pt-2">{placemark.location}</p>
          </footer>
        </div>
      </div>
    {/if}
  {/each}
</div>
