<script lang="ts">
import { onMount } from "svelte";
import type { Placemark } from "$lib/types/placemark-types";
import { placemarkService } from "$lib/services/placemark-service";
import { currentSession, placemarkStore } from "$lib/stores";
import { get } from "svelte/store";
import InPlaceEdit from "./InPlaceEdit.svelte";
import UploadWidget from "./UploadWidget.svelte";

export let placemarks: Placemark[] = [];
export let columnSize: string = "is-one-third";

let editState: Record<string, Placemark> = {};
let photoCollapse: Record<string, boolean> = {};
let collapseState: Record<string, boolean> = {};

const allowedCategories = ["Park", "Castle", "Ancient Ruin", "Walk", "Beach", "River", "Lake", "Waterfall", "Hike", "Cave", "Ringfort", "Dolmen", "Monument", "National Park"];

placemarkStore.subscribe((value) => {
    placemarks = value;
});

async function handleDelete(placemarkId: string) {
  const confirmation = confirm('Are you sure you want to delete this placemark?');
  if (confirmation) {
    try {
      const success = await placemarkService.deletePlacemark(placemarkId, get(currentSession));
      if (success) {
        // if deletion is successful, reload the placemarks
        placemarks = placemarks.filter(placemark => placemark._id !== placemarkId);
      }
    } catch (error) {
      console.error('Failed to delete placemark:', error);
    }
  }
}

async function handleUpdate(updatedPlacemark: Placemark) {
try {
  const success = await placemarkService.updatePlacemark(updatedPlacemark, get(currentSession));
  if (success) {
    // update the placemark in the local state or refresh the placemarks list
    const index = placemarks.findIndex(p => p._id === updatedPlacemark._id);
    if (index !== -1) {
      placemarks[index] = updatedPlacemark;
    }

    placemarkStore.set(placemarks);
  }
  } catch (error) {
    console.error('Failed to update placemark:', error);
  }
}

function handleImageUploaded(event: CustomEvent<{ imageUrl: string }>, placemarkId: string) {
    const imageUrl = event.detail.imageUrl;
    const placemark = placemarks.find(p => p._id === placemarkId);
    
    if (placemark) {
        // Update the placemark's img property
        placemark.img = imageUrl;
        console.log('Updated placemark:', placemark);

        // Optionally, update the placemark on the server
        placemarkService.updatePlacemark(placemark, get(currentSession));

        placemarkStore.set(placemarks);
    }
}

function submit(field: string | number) {
  return ({detail: newValue}: {detail: any}) => {
    editState[field] = newValue;
  };
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
      editState[placemark._id] = { ...placemark};
    });
});
</script>


<div class="columns is-multiline">
{#each placemarks as placemark}
  <div class="column {columnSize}">
    <div class="card">
      <header class="card-header">
        <p class="card-header-title is-centered">
          <InPlaceEdit bind:value={placemark.title} on:submit={submit('title')} />
        </p>
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
          <p><strong>Description:</strong> <InPlaceEdit bind:value={placemark.description} on:submit={submit('description')}/></p>
          <p><strong>Location:</strong> <InPlaceEdit bind:value={placemark.location} on:submit={submit('location')}/></p>
          <p><strong>Latitude:</strong> <InPlaceEdit bind:value={placemark.latitude} on:submit={submit('latitude')}/></p>
          <p><strong>Longitude:</strong> <InPlaceEdit bind:value={placemark.longitude} on:submit={submit('longitude')}/></p>
          <p><strong>Category:</strong> <InPlaceEdit bind:value={placemark.category} on:submit={submit('category')} isCategoryField={true} allowedCategories={allowedCategories} /></p>

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
        <a href="#" title="Update Placemark" class="card-footer-item" on:click={() => handleUpdate(placemark)}>
          <span class="icon has-text-success">
            <i class="fas fa-pen-nib"></i>
          </span>
        </a>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <UploadWidget placemarkId={placemark._id} on:imageUploaded={(event) => handleImageUploaded(event, placemark._id)} />
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

