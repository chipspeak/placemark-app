<script lang="ts">
    import type { Placemark } from "$lib/types/placemark-types";
    import Message from "./Message.svelte";

    export let placemarks: Placemark[];
    export let placemark: Placemark;
    export let photoCollapse: Record<string, boolean> = {};
    export let currentImageIndex: Record<string, number> = {};

    function handleImagePrevious(placemarkId: string) {
        const placemark = placemarks.find(p => p._id === placemarkId);
        if (placemark && placemark.img && placemark.img.length > 0) {
            // Decrement currentImageIndex for the placemark
            currentImageIndex[placemarkId] = (currentImageIndex[placemarkId] - 1 + placemark.img.length) % placemark.img.length;
        }
    }

    function handleImageNext(placemarkId: string) {
        const placemark = placemarks.find(p => p._id === placemarkId);
        if (placemark && placemark.img && placemark.img.length > 0) {
            // Increment currentImageIndex for the placemark
            currentImageIndex[placemarkId] = (currentImageIndex[placemarkId] + 1) % placemark.img.length;
        }
    }
    
    </script>
    
    <style>
        .card-image img {
          width: 100%; 
          height: 400px;
          object-fit: cover; 
        }
      </style>

    {#if placemark.img && placemark.img.length > 0}
    <div class="card-image collapse" id={`photo-${placemark._id}`} class:is-hidden={photoCollapse[`photo-${placemark._id}`]}>
        <figure class="image mb-5">
            <!-- Display the current image -->
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img src={placemark.img[currentImageIndex[placemark._id]]} alt="Placemark Image" />
        </figure>
        <div class="ml-5 mr-5 is-flex is-justify-content-space-between">
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
    </div>
{/if}