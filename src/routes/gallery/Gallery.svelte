<script lang="ts">
  import type { Placemark } from "$lib/types/placemark-types";
  import { subTitle } from "$lib/stores";
  import { onMount } from "svelte";
  import { cardColumnSizeStore } from "$lib/stores";

	// Define the Placemark type to allow the passage of prop from parent
  export let placemarks: Placemark[];

	// Set the subtitle for the page
  subTitle.set("Image Gallery");

	// Define the currentImageIndex object to store the current image index for each placemark
  let currentImageIndex: Record<string, number> = {};

	// Same image carousel logic as in the PlacemarkCard component
  function handleImagePrevious(placemarkId: string) {
    const placemark = placemarks.find((p) => p._id === placemarkId);
    if (placemark && placemark.img && placemark.img.length > 0) {
      // Decrement currentImageIndex for the placemark
      currentImageIndex[placemarkId] = (currentImageIndex[placemarkId] - 1 + placemark.img.length) % placemark.img.length;
    }
  }

  function handleImageNext(placemarkId: string) {
    const placemark = placemarks.find((p) => p._id === placemarkId);
    if (placemark && placemark.img && placemark.img.length > 0) {
      // Increment currentImageIndex for the placemark
      currentImageIndex[placemarkId] = (currentImageIndex[placemarkId] + 1) % placemark.img.length;
    }
  }

	// On mount, initialize the currentImageIndex for each placemark
  onMount(async () => {
    placemarks.forEach((placemark) => {
      currentImageIndex[placemark._id] = 0;
    });
  });
</script>

<!-- Display the image gallery using the Bulma card component -->
<div class="columns is-multiline">
  {#each placemarks as placemark}
    {#if placemark.img && placemark.img.length > 0}
      <div class="column {$cardColumnSizeStore}">
        <div class="card">
          <div class="card-image">
            <figure class="image mb-5">
              <!-- Display the current image -->
              <!-- svelte-ignore a11y-img-redundant-alt -->
              <img src={placemark.img[currentImageIndex[placemark._id]]} alt="Placemark Image" />
            </figure>
          </div>
          <div class="ml-5 mr-5 mb-5 is-flex is-justify-content-space-between">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <a class="icon has-text-dark" title="Previous Image" on:click={() => handleImagePrevious(placemark._id)}>
              <i class="fas fa-chevron-left"></i>
            </a>

            <!-- Right icon to navigate to the next image -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <a class="icon has-text-dark" title="Next Image" on:click={() => handleImageNext(placemark._id)}>
              <i class="fas fa-chevron-right"></i>
            </a>
          </div>
          <footer class="card-footer">
            <p class="card-footer-item pt-5">{placemark.title}</p>
            <p class="card-footer-item pt-5">{placemark.location}</p>
          </footer>
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  .card-image img {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }
</style>
