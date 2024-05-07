<script lang="ts">
import { onMount } from "svelte";
import type { Placemark } from "$lib/types/placemark-types";
import { placemarkService } from "$lib/services/placemark-service";
import { currentSession, placemarkStore } from "$lib/stores";
import { get } from "svelte/store";
import InPlaceEdit from "../../lib/ui/InPlaceEdit.svelte";
import UploadWidget from "../../lib/ui/UploadWidget.svelte";

export let data: any;
export let placemarks: Placemark[];
export let columnSize: string = "is-one-third";

let editState: Record<string, Placemark> = {};
let photoCollapse: Record<string, boolean> = {};
let collapseState: Record<string, boolean> = {};
let currentImageIndex: Record<string, number> = {};
let weatherDataMap: Record<string, any> = {};
let weatherCollapse: Record<string, boolean> = {};



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

function handleImageUploaded(event: CustomEvent<{ imageUrl: string }>, placemarkId: string) {
    const imageUrl = event.detail.imageUrl;
    const placemark = placemarks.find(p => p._id === placemarkId);
    
    if (placemark) {
        placemark.img ??= [];
        placemark.img.push(imageUrl);
        console.log('Updated placemark:', placemark);
        placemarkService.updatePlacemark(placemark, get(currentSession));

        placemarkStore.set(placemarks);
    }
}

function handleImageDelete(placemarkId: string) {
    const confirmation = confirm('Are you sure you want to delete this image?');
    if (confirmation) {
        const placemark = placemarks.find(p => p._id === placemarkId);
        if (placemark && Array.isArray(placemark.img) && placemark.img.length > 0) {
            // Remove the current image from the img array
            placemark.img.splice(currentImageIndex[placemarkId], 1);
            // Update the placemark
            placemarkService.updatePlacemark(placemark, get(currentSession));
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

// Base URL for OpenWeather icons
const iconBaseUrl = "http://openweathermap.org/img/wn/";

function getIconUrl(iconCode: string): string {
    return `${iconBaseUrl}${iconCode}@2x.png`; // Construct the icon URL
}

// Toggle the collapsible state of weather conditions
function toggleWeatherCollapse(event: Event, id: string): void {
    event.preventDefault();
    console.log('Toggling weather collapse for:', id);
    weatherCollapse[id] = !weatherCollapse[id];
}

onMount(() => {
  placemarks = data.placemarks;
  placemarks.forEach(async (placemark) => {
    try {
      const weatherData = await placemarkService.getPlacemarkWeather(placemark, get(currentSession));
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
          <p><strong>Description:</strong> <InPlaceEdit bind:value={placemark.description} on:submit={submit('description')}/></p>
          <p><strong>Location:</strong> <InPlaceEdit bind:value={placemark.location} on:submit={submit('location')}/></p>
          <p><strong>Latitude:</strong> <InPlaceEdit bind:value={placemark.latitude} on:submit={submit('latitude')}/></p>
          <p><strong>Longitude:</strong> <InPlaceEdit bind:value={placemark.longitude} on:submit={submit('longitude')}/></p>
          <p><strong>Category:</strong> <InPlaceEdit bind:value={placemark.category} on:submit={submit('category')} isCategoryField={true} allowedCategories={allowedCategories} /></p>
        </div>
        <div class="column has-text-centered">
          {#if weatherDataMap[placemark._id]?.weather}
          {#each weatherDataMap[placemark._id].weather as weather}
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a title="Expand/Collapse Weather" aria-label="more options" data-action="collapse" 
          href="#" on:click={(event) => toggleWeatherCollapse(event, `weather-${placemark._id}`)}>
              <img src={getIconUrl(weather.icon)} alt={weather.description} title={weather.description} />
        </a>
          {/each}
          <div class="collapse has-text-left" id={`weather-${placemark._id}`} class:is-hidden={weatherCollapse[`weather-${placemark._id}`]}>
            <p><strong>Conditions:</strong> {weatherDataMap[placemark._id]?.weather[0].description}</p>
            <p><strong>Temperature:</strong> {weatherDataMap[placemark._id]?.main.temp}</p>
            <p><strong>Wind Speed:</strong> {weatherDataMap[placemark._id]?.wind.speed}</p>
            <p><strong>Wind Direction:</strong> {weatherDataMap[placemark._id]?.wind.deg}</p>
            <p><strong>Pressure</strong> {weatherDataMap[placemark._id]?.main.pressure}</p>
            <p><strong>Humidity:</strong> {weatherDataMap[placemark._id]?.main.humidity}</p>
          </div>
      {/if}
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
        <a href="#" title="Delete Image" class="card-footer-item" on:click={() => handleImageDelete(placemark._id)}>
          <span class="icon has-text-danger">
            <i class="fas is-danger fa-camera"></i>
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

