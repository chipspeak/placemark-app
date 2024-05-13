<script lang="ts">
  import { onMount } from "svelte";
  import type { Placemark } from "$lib/types/placemark-types";
  import { placemarkService } from "$lib/services/placemark-service";
  import { currentSession, placemarkDisplayStore, placemarkStore } from "$lib/stores";
  import { get } from "svelte/store";
  import PlacemarkCard from "./PlacemarkCard.svelte";
  import { acts } from "@tadashi/svelte-notification";

  // Declare variables and functions to allow passing of props (and receive data from the server page)
  export let data: any;
  export let placemarks: Placemark[];

  let editState: Record<string, Placemark> = {};
  let photoCollapse: Record<string, boolean> = {};
  let collapseState: Record<string, boolean> = {};
  let currentImageIndex: Record<string, number> = {};
  let weatherDataMap: Record<string, any> = {};
  let weatherCollapse: Record<string, boolean> = {};

  // Subscribe to the placemarkStore to update the placemarks when a new placemark is added or one is deleted
  placemarkStore.subscribe((value) => {
    placemarks = value;
  });

  // Reactive statement to filter placemarks based on the placemarkDisplayStore selection
  $: filteredPlacemarks = placemarks.filter((placemark) => {
    if ($placemarkDisplayStore === "all") {
      // Show all placemarks
      return true;
    } else if ($placemarkDisplayStore === "user") {
      // Show only user's placemarks
      return placemark.userId === get(currentSession)._id;
    }
  });

  // Handle the deletion of a placemark
  export async function handleDelete(placemarkId: string) {
    // Placemark to be deleted is found by the find function using the placemarkId
    const placemark = placemarks.find((p) => p._id === placemarkId);
    // Check if placemarks userId matches the current session userId. If not, display a message prohibiting deletion
    if (placemark?.userId !== $currentSession._id) {
      return acts.add({ mode: "danger", lifetime: "3", message: "You do not have permission to delete this placemark!" });
    }
    // Confirmation dialog to ensure the user wants to delete the placemark
    const confirmation = confirm("Are you sure you want to delete this placemark?");
    if (confirmation) {
      try {
        // Call the deletePlacemark function from the placemarkService and pass the placemarkId and currentSession
        const success = await placemarkService.deletePlacemark(placemarkId, $currentSession);
        // If successful, filter the placemarks array to remove the deleted placemark and output a success message
        if (success) {
          placemarks = placemarks.filter((placemark) => placemark._id !== placemarkId);
          acts.add({ mode: "success", lifetime: "3", message: "Placemark deleted successfully!" });
        }
      } catch (error) {
        console.error("Failed to delete placemark:", error);
      }
    }
  }

  // Handle the update of a placemark
  export async function handleUpdate(updatedPlacemark: Placemark) {
    // Once again ensure the user has permission to update the placemark
    if (updatedPlacemark.userId !== $currentSession._id) {
      return acts.add({ mode: "danger", lifetime: "3", message: "You do not have permission to update this placemark!" });
    }
    try {
      // Same logic as deletion function
      const success = await placemarkService.updatePlacemark(updatedPlacemark, $currentSession);
      if (success) {
        const index = placemarks.findIndex((p) => p._id === updatedPlacemark._id);
        if (index !== -1) {
          placemarks[index] = updatedPlacemark;
        }
        // Update the placemarkStore and output a success message
        placemarkStore.set(placemarks);
        acts.add({ mode: "success", lifetime: "3", message: "Placemark updated successfully!" });
        fetchWeatherDataForPlacemark(updatedPlacemark);
      }
      if (!success) {
        acts.add({ mode: "danger", lifetime: "3", message: "Failed to update placemark!" });
      }
    } catch (error) {
      console.error("Failed to update placemark:", error);
    }
  }

  // Function to fetch weather data for a specific placemark
  export async function fetchWeatherDataForPlacemark(placemark: Placemark) {
    try {
      // Call the getPlacemarkWeather function from the placemarkService and pass the placemark and currentSession
      const weatherData = await placemarkService.getPlacemarkWeather(placemark, $currentSession);
      console.log("Updated weather data:", weatherData);
      // Update weather data map for the specific placemark
      weatherDataMap[placemark._id] = weatherData;
    } catch (error) {
      console.error(`Failed to fetch weather data for placemark ${placemark._id}:`, error);
    }
  }

  // Function to handle the image uploaded event
  export function handleImageUploaded(event: CustomEvent<{ imageUrl: string }>, placemarkId: string) {
    // Get the imageUrl from the event detail (from cloudinary widget) and find the placemark by the placemarkId
    const imageUrl = event.detail.imageUrl;
    const placemark = placemarks.find((p) => p._id === placemarkId);
    // If the placemark is found, add the imageUrl to the img array and update the placemark
    if (placemark) {
      placemark.img ??= [];
      placemark.img.push(imageUrl);
      console.log("Updated placemark:", placemark);
      placemarkService.updatePlacemark(placemark, $currentSession);
      acts.add({ mode: "success", lifetime: "3", message: "Image uploaded successfully!" });
      // Update the placemarkStore
      placemarkStore.set(placemarks);
    }
  }

  // Function to handle the deletion of an image
  export function handleImageDelete(placemarkId: string) {
    // Find the placemark by the placemarkId
    const placemark = placemarks.find((p) => p._id === placemarkId);
    // If there is no image to delete, display a message
    if (placemark?.img?.length === 0) {
      return acts.add({ mode: "danger", lifetime: "3", message: "No image to delete!" });
    }
    // If the placemark userId does not match the current session userId, display a message prohibiting deletion
    if (placemark?.userId !== $currentSession._id) {
      return acts.add({ mode: "danger", lifetime: "3", message: "You do not have permission to delete this image!" });
    }
    // Confirmation dialog to ensure the user wants to delete the image
    const confirmation = confirm("Are you sure you want to delete this image?");
    // If confirmed, find the image to delete and remove it from the img array
    if (confirmation) {
      const placemark = placemarks.find((p) => p._id === placemarkId);
      if (placemark && Array.isArray(placemark.img) && placemark.img.length > 0) {
        // Remove the current image from the img array
        const imageForDeletion = placemark.img[currentImageIndex[placemarkId]];
        console.log("image for deletion: " + imageForDeletion);
        placemark.img.splice(currentImageIndex[placemarkId], 1);
        // Update the placemark
        console.log("passing image:" + imageForDeletion + " to deleteImageFromCloudinary");
        // Call the deleteImageFromCloudinary function from the placemarkService and pass the imageForDeletion and currentSession
        placemarkService.deleteImageFromCloudinary(imageForDeletion, $currentSession);
        // Update the placemark with the new version of its image array and output message to user
        placemarkService.updatePlacemark(placemark, $currentSession);
        acts.add({ mode: "success", lifetime: "3", message: "Image deleted successfully!" });
        // Update the placemarkStore
        placemarkStore.set(placemarks);
        // Adjust the currentImageIndex if necessary
        if (currentImageIndex[placemarkId] >= placemark.img.length) {
          currentImageIndex[placemarkId] = 0;
        }
      }
    }
  }

  // Function to handle the submit event for the InPlaceEdit component
  export function submit(field: string | number) {
    return ({ detail: newValue }: { detail: any }) => {
      editState[field] = newValue;
    };
  }

  // Function to toggle the collapse state of a specific element
  export function toggleCollapse(event: Event, id: string): void {
    event.preventDefault();
    const content = document.getElementById(id);
    if (content) {
      content.classList.toggle("is-hidden");
      collapseState[id] = !collapseState[id];
    } else {
      console.error(`Element with id ${id} not found`);
    }
  }

  // Function to toggle the photo collapse state of a specific element
  export function togglePhotoCollapse(event: Event, id: string): void {
    event.preventDefault();
    photoCollapse[id] = !photoCollapse[id];
  }

  // Function to toggle the weather collapse state of a specific element
  export function toggleWeatherCollapse(event: Event, id: string): void {
    event.preventDefault();
    console.log("Toggling weather collapse for:", id);
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

<!-- Each loop to pass the various props to each Placemark card component -->
<div class="columns is-multiline">
  {#each filteredPlacemarks as placemark}
    <PlacemarkCard
      {placemarks}
      {placemark}
      {toggleWeatherCollapse}
      {toggleCollapse}
      {togglePhotoCollapse}
      {handleUpdate}
      {handleDelete}
      {handleImageUploaded}
      {handleImageDelete}
      {submit}
      {weatherCollapse}
      {weatherDataMap}
      {currentImageIndex}
      {photoCollapse}
      {collapseState}
    />
  {/each}
</div>
