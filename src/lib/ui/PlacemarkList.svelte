
<script lang="ts">
import { onMount } from "svelte";
import type { Placemark } from "$lib/types/placemark-types";
import { placemarkService } from "$lib/services/placemark-service";
import { currentSession, placemarkStore } from "$lib/stores";
import { get } from "svelte/store";
import PlacemarkCard from "./PlacemarkCard.svelte";
import { acts } from '@tadashi/svelte-notification';

export let data: any;
export let placemarks: Placemark[];

let editState: Record<string, Placemark> = {};
let photoCollapse: Record<string, boolean> = {};
let collapseState: Record<string, boolean> = {};
let currentImageIndex: Record<string, number> = {};
let weatherDataMap: Record<string, any> = {};
let weatherCollapse: Record<string, boolean> = {};

placemarkStore.subscribe((value) => {
    placemarks = value;
});

export async function handleDelete(placemarkId: string) {
  const placemark = placemarks.find(p => p._id === placemarkId);
  if (placemark?.userId !== $currentSession._id) {
    return acts.add({ mode: 'danger', lifetime: '3', message: 'You do not have permission to delete this placemark!' });
  }
  const confirmation = confirm('Are you sure you want to delete this placemark?');
  if (confirmation) {
    try {
      const success = await placemarkService.deletePlacemark(placemarkId, $currentSession);
      if (success) {
        placemarks = placemarks.filter(placemark => placemark._id !== placemarkId);
        acts.add({ mode: 'success', lifetime: '3', message: 'Placemark deleted successfully!' });
      }
    } catch (error) {
      console.error('Failed to delete placemark:', error);
    }
  }
}

export async function handleUpdate(updatedPlacemark: Placemark) {
  if (updatedPlacemark.userId !== $currentSession._id) {
    return acts.add({ mode: 'danger', lifetime: '3', message: 'You do not have permission to update this placemark!' });
  }
  try {
    const success = await placemarkService.updatePlacemark(updatedPlacemark, $currentSession);
    if (success) {
      const index = placemarks.findIndex((p) => p._id === updatedPlacemark._id);
      if (index !== -1) {
        placemarks[index] = updatedPlacemark;
        }
      
      placemarkStore.set(placemarks);
      acts.add({ mode: 'success', lifetime: '3', message: 'Placemark updated successfully!' });
      fetchWeatherDataForPlacemark(updatedPlacemark);
    }
  } catch (error) {
    console.error('Failed to update placemark:', error);
  }
}

export async function fetchWeatherDataForPlacemark(placemark: Placemark) {
    try {
        const weatherData = await placemarkService.getPlacemarkWeather(placemark, $currentSession);
        console.log('Updated weather data:', weatherData);
        // Update weather data map for the specific placemark
        weatherDataMap[placemark._id] = weatherData;
    } catch (error) {
        console.error(`Failed to fetch weather data for placemark ${placemark._id}:`, error);
    }
}

export function handleImageUploaded(event: CustomEvent<{ imageUrl: string }>, placemarkId: string) {
    const imageUrl = event.detail.imageUrl;
    const placemark = placemarks.find(p => p._id === placemarkId);
    
    if (placemark) {
        placemark.img ??= [];
        placemark.img.push(imageUrl);
        console.log('Updated placemark:', placemark);
        placemarkService.updatePlacemark(placemark, $currentSession);
        acts.add({ mode: 'success', lifetime: '3', message: 'Image uploaded successfully!' });

        placemarkStore.set(placemarks);
    }
}

export function handleImageDelete(placemarkId: string) {
  const placemark = placemarks.find(p => p._id === placemarkId);
  if (placemark?.userId !== $currentSession._id) {
    return acts.add({ mode: 'danger', lifetime: '3', message: 'You do not have permission to delete this image!' });
  }
    const confirmation = confirm('Are you sure you want to delete this image?');
    if (confirmation) {
        const placemark = placemarks.find(p => p._id === placemarkId);
        if (placemark && Array.isArray(placemark.img) && placemark.img.length > 0) {
            // Remove the current image from the img array
            placemark.img.splice(currentImageIndex[placemarkId], 1);
            // Update the placemark
            placemarkService.updatePlacemark(placemark, $currentSession);
            acts.add({ mode: 'success', lifetime: '3', message: 'Image deleted successfully!' });
            placemarkStore.set(placemarks);
            // Adjust the currentImageIndex if necessary
            if (currentImageIndex[placemarkId] >= placemark.img.length) {
                currentImageIndex[placemarkId] = 0;
            }
        }
    }
}

export function submit(field: string | number) {
  return ({detail: newValue}: {detail: any}) => {
    editState[field] = newValue;
  };
}

export function toggleCollapse(event: Event, id: string): void {
  event.preventDefault();
  const content = document.getElementById(id);
  if (content) {
    content.classList.toggle('is-hidden');
    collapseState[id] = !collapseState[id];
  } else {
    console.error(`Element with id ${id} not found`);
  }
}

export function togglePhotoCollapse(event: Event, id: string): void {
  event.preventDefault();
  photoCollapse[id] = !photoCollapse[id];
}

export function toggleWeatherCollapse(event: Event, id: string): void {
    event.preventDefault();
    console.log('Toggling weather collapse for:', id);
    weatherCollapse[id] = !weatherCollapse[id];
}

onMount(() => {
  console.log("Current session id: " + get(currentSession)._id);
    // Initialize state using data prop
    placemarks = data.placemarks;

    // Initialize the weather data map from the server-side data
    weatherDataMap = data.weatherDataMap || {};

    // Set up initial states based on data prop
    collapseState = data.collapseState || {};
    photoCollapse = data.photoCollapse || {};
    editState = data.editState || {};
    currentImageIndex = data.currentImageIndex || {};
    });

</script>


<div class="columns is-multiline">
{#each placemarks as placemark}
<PlacemarkCard
  placemarks={placemarks}
  placemark={placemark}
  toggleWeatherCollapse={toggleWeatherCollapse}
  toggleCollapse={toggleCollapse}
  togglePhotoCollapse={togglePhotoCollapse}
  handleUpdate={handleUpdate}
  handleDelete={handleDelete}
  handleImageUploaded={handleImageUploaded}
  handleImageDelete={handleImageDelete}
  submit={submit}
  weatherCollapse={weatherCollapse}
  weatherDataMap={weatherDataMap}
  currentImageIndex={currentImageIndex}
  photoCollapse={photoCollapse}
  collapseState={collapseState}
/>
{/each}
</div>

