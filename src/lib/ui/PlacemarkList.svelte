<script lang="ts">
  import { onMount } from "svelte";
  import type { Placemark } from "$lib/types/placemark-types";
  import { placemarkService } from "$lib/services/placemark-service";
  import { currentSession } from "$lib/stores";
  import { get } from "svelte/store";

  export let placemarks: Placemark[] = [];
  export let columnSize: string = "is-one-third";

  let photoCollapse: Record<string, boolean> = {};
  let collapseState: Record<string, boolean> = {};

  async function handleDelete(placemarkId: string) {
    const confirmation = confirm('Are you sure you want to delete this placemark?');
    if (confirmation) {
      try {
        const success = await placemarkService.deletePlacemark(placemarkId, get(currentSession));
        if (success) {
          // If deletion is successful, reload the placemarks
          placemarks = placemarks.filter(placemark => placemark._id !== placemarkId);
        }
      } catch (error) {
        console.error('Failed to delete placemark:', error);
      }
    }
  }

  function toggleCollapse(event: Event, id: string): void {
    event.preventDefault();
    const content = document.getElementById(id);
    if (content) {
      content.classList.toggle('is-hidden');
      collapseState[id] = !collapseState[id];
    } else {
      console.error(`Element with id ${id} not found`);
    }
  }

  function togglePhotoCollapse(event: Event, id: string): void {
    event.preventDefault();
    photoCollapse[id] = !photoCollapse[id];
  }

  onMount(() => {
    placemarks.forEach(placemark => {
        collapseState[placemark._id] = false; 
        photoCollapse[`photo-${placemark._id}`] = false;
      });
  });
</script>

<div class="columns is-multiline">
  {#each placemarks as placemark}
    <div class="column {columnSize}">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title is-centered">{placemark.title}</p>
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a class="card-header-icon" title="Expand/Collapse Details" aria-label="more options" data-action="collapse" 
          href="#" on:click={(event) => toggleCollapse(event, `details-${placemark._id}`)}>
            <span class="icon">
                {#if collapseState[`details-${placemark._id}`]}
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                {/if}
                {#if !collapseState[`details-${placemark._id}`]}
                    <i class="fas fa-angle-up" aria-hidden="true"></i>
                {/if}
            </span>
          </a>
        </header>
        <div class="card-content collapse" id="details-{placemark._id}">
          <div class="content">
            <p><strong>Description:</strong> {placemark.description}</p>
            <p><strong>Location:</strong> {placemark.location}</p>
            <p><strong>Latitude:</strong> {placemark.latitude}</p>
            <p><strong>Longitude:</strong> {placemark.longitude}</p>
            <p><strong>Category:</strong> {placemark.category}</p>
          </div>
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a class="card-header-icon" title="Expand/Collapse Photo" aria-label="more options" data-action="collapse" href="#" on:click={(event) => togglePhotoCollapse(event, `photo-${placemark._id}`)}>
            <span class="icon">
                {#if photoCollapse[`photo-${placemark._id}`]}
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                {/if}
                {#if !photoCollapse[`photo-${placemark._id}`]}
                    <i class="fas fa-angle-up" aria-hidden="true"></i>
                {/if}
            </span>
          </a>
          {#if placemark.img}
          <div class="card-image collapse" id={`photo-${placemark._id}`} class:is-hidden={photoCollapse[`photo-${placemark._id}`]}>
            <figure class="image">
              <img src={placemark.img} alt="" />
            </figure>
          </div>
          {/if}
        </div>
        <footer class="card-footer">
          <hr>
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a href="#" title="Update Placemark" class="card-footer-item" on:click={() => handleDelete(placemark._id)}>
            <span class="icon has-text-success">
              <i class="fas fa-pen-nib"></i>
            </span>
          </a>
          <a href="/dashboard/uploadimage/{placemark._id}" title="Upload/Update Image" class="card-footer-item">
            <span class="icon has-text-success">
              <i class="fas fa-camera"></i>
            </span>
          </a>
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a href="#" title="Delete Placemark" class="card-footer-item" on:click={() => handleDelete(placemark._id)}>
            <span class="icon has-text-danger">
              <i class="fas is-danger fa-trash"></i>
            </span>
          </a>
        </footer>
      </div>
    </div>
  {/each}
</div>

