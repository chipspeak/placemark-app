
<script lang="ts">
import { onMount } from "svelte";
import type { Placemark } from "$lib/types/placemark-types";
import { placemarkService } from "$lib/services/placemark-service";
import { currentSession, placemarkStore } from "$lib/stores";
import { get } from "svelte/store";
import InPlaceEdit from "./InPlaceEdit.svelte";
import ImageCarousel from "$lib/ui/ImageCarousel.svelte";
import PlacemarkDetails from "$lib/ui/PlacemarkDetails.svelte";
import PlacemarkFooter from "$lib/ui/PlacemarkFooter.svelte";
import WeatherDetails from "$lib/ui/WeatherDetails.svelte";

export let data: any;
export let placemarks: Placemark[];
export let columnSize: string = "is-one-third";

let editState: Record<string, Placemark> = {};
let photoCollapse: Record<string, boolean> = {};
let collapseState: Record<string, boolean> = {};
let currentImageIndex: Record<string, number> = {};
let weatherDataMap: Record<string, any> = {};
let weatherCollapse: Record<string, boolean> = {};

placemarkStore.subscribe((value) => {
    placemarks = value;
});

async function handleDelete(placemarkId: string) {
  const placemark = placemarks.find(p => p._id === placemarkId);
  if (placemark?.userId !== $currentSession._id) {
    return alert('You do not have permission to delete this placemark.');
  }
  const confirmation = confirm('Are you sure you want to delete this placemark?');
  if (confirmation) {
    try {
      const success = await placemarkService.deletePlacemark(placemarkId, $currentSession);
      if (success) {
        placemarks = placemarks.filter(placemark => placemark._id !== placemarkId);
      }
    } catch (error) {
      console.error('Failed to delete placemark:', error);
    }
  }
}

async function handleUpdate(updatedPlacemark: Placemark) {
  if (updatedPlacemark?.userId !== $currentSession._id) {
    return alert('You do not have permission to delete this placemark!');
  }
  try {
    const success = await placemarkService.updatePlacemark(updatedPlacemark, $currentSession);
    if (success) {
      const index = placemarks.findIndex((p) => p._id === updatedPlacemark._id);
      if (index !== -1) {
        placemarks[index] = updatedPlacemark;
        }
      
      placemarkStore.set(placemarks);
      fetchWeatherDataForPlacemark(updatedPlacemark);
    }
  } catch (error) {
    console.error('Failed to update placemark:', error);
  }
}

async function fetchWeatherDataForPlacemark(placemark: Placemark) {
    try {
        const weatherData = await placemarkService.getPlacemarkWeather(placemark, $currentSession);
        console.log('Updated weather data:', weatherData);
        // Update weather data map for the specific placemark
        weatherDataMap[placemark._id] = weatherData;
    } catch (error) {
        console.error(`Failed to fetch weather data for placemark ${placemark._id}:`, error);
    }
}

function handleImageUploaded(event: CustomEvent<{ imageUrl: string }>, placemarkId: string) {
    const imageUrl = event.detail.imageUrl;
    const placemark = placemarks.find(p => p._id === placemarkId);
    
    if (placemark) {
        placemark.img ??= [];
        placemark.img.push(imageUrl);
        console.log('Updated placemark:', placemark);
        placemarkService.updatePlacemark(placemark, $currentSession);

        placemarkStore.set(placemarks);
    }
}

function handleImageDelete(placemarkId: string) {
  const placemark = placemarks.find(p => p._id === placemarkId);
  if (placemark?.userId !== $currentSession._id) {
    return alert('You do not have permission to delete this image!');
  }
    const confirmation = confirm('Are you sure you want to delete this image?');
    if (confirmation) {
        const placemark = placemarks.find(p => p._id === placemarkId);
        if (placemark && Array.isArray(placemark.img) && placemark.img.length > 0) {
            // Remove the current image from the img array
            placemark.img.splice(currentImageIndex[placemarkId], 1);
            // Update the placemark
            placemarkService.updatePlacemark(placemark, $currentSession);
            placemarkStore.set(placemarks);
            // Adjust the currentImageIndex if necessary
            if (currentImageIndex[placemarkId] >= placemark.img.length) {
                currentImageIndex[placemarkId] = 0;
            }
        }
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

function toggleWeatherCollapse(event: Event, id: string): void {
    event.preventDefault();
    console.log('Toggling weather collapse for:', id);
    weatherCollapse[id] = !weatherCollapse[id];
}

onMount(() => {
  console.log("Current session id: " + get(currentSession)._id);
  placemarks = data.placemarks;
  placemarks.forEach(async (placemark) => {
    try {
      const weatherData = await placemarkService.getPlacemarkWeather(placemark, $currentSession);
      console.log('Weather data:', weatherData)
      weatherDataMap[placemark._id] = weatherData;
    } catch (error) {
        console.error(`Failed to fetch weather data for placemark ${placemark._id}:`, error);
      }
      collapseState[placemark._id] = false; 
      photoCollapse[`photo-${placemark._id}`] = false;
      editState[placemark._id] = { ...placemark};
      currentImageIndex[placemark._id] = 0;
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
        <div class="columns">
          <div class="column pt-5">
            <PlacemarkDetails placemark={placemark} onUpdate={handleUpdate} />
          </div>
          <div class="column">
          <WeatherDetails placemark={placemark} weatherDataMap={weatherDataMap} weatherCollapse={weatherCollapse} toggleWeatherCollapse={toggleWeatherCollapse} />
          </div>
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
        <ImageCarousel placemarks={placemarks} placemark={placemark} photoCollapse={photoCollapse} currentImageIndex={currentImageIndex}/>
      </div>
      <PlacemarkFooter placemark={placemark} handleUpdate={handleUpdate} handleDelete={handleDelete} handleImageUploaded={handleImageUploaded} handleImageDelete={handleImageDelete} />
    </div>
  </div>
{/each}
</div>

