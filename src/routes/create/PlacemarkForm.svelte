<script lang="ts">
  import { placemarkService } from "$lib/services/placemark-service";
  import type { newPlacemark } from "$lib/types/placemark-types";
  import { currentSession, latestPlacemark } from "$lib/stores";
  import { get } from "svelte/store";

	// Declare variables
  let title = "Placemark Title";
  let description = "Placemark Description";
  let location = "Placemark Location";
  let latitude = 0.1;
  let longitude = 0.1;
  let category = "Park";
  let img = ["Placemark Image"];
  let message = "";
  let textColour = "";
  const allowedCategories = ["Park", "Castle", "Ancient Ruin", "Walk", "Beach", "River", "Lake", "Waterfall", "Hike", "Cave", "Ringfort", "Dolmen", "Monument", "National Park"];

	// Function to create a new placemark
  async function createPlacemark() {
		// Declare inputError variable to false. Used throughout to prevent submission if any input error occurs. Works in tandum with various regex and logic checks
    let inputError = false;

    // Check if latitude is within range
    if (latitude < -90 || latitude > 90) {
      textColour = "danger";
      message = "Latitude must be between -90 and 90 degrees.";
      inputError = true;
    }

    // Check if longitude is within range
    if (longitude < -180 || longitude > 180) {
      textColour = "danger";
      message = "Longitude must be between -180 and 180 degrees.";
      inputError = true;
    }

    // Check if title contains only alphanumeric characters and spaces
    if (!/^[a-zA-Z0-9\s]+$/.test(title)) {
      textColour = "danger";
      message = "Title can only contain letters, numbers, and spaces.";
      inputError = true;
    }

    // Check if description contains only alphanumeric characters, spaces, and punctuation
    if (!/^[a-zA-Z0-9\s.,!-]+$/.test(description)) {
      textColour = "danger";
      message = "Description can only contain letters, numbers, spaces, and punctuation.";
      inputError = true;
    }

    // Check if location contains only alphanumeric characters, spaces, and punctuation
    if (!/^[a-zA-Z0-9\s.,!-]+$/.test(location)) {
      textColour = "danger";
      message = "Location can only contain letters, numbers, spaces, and punctuation.";
      inputError = true;
    }

    // If any input error occurred, return
    if (inputError) return;

    // Proceed with creating the placemark
    const newPlacemark: newPlacemark = {
      title: title,
      description: description,
      location: location,
      latitude: latitude,
      longitude: longitude,
      category: category,
      img: ["/images/burren.jpg"]
    };

		// Create the placemark by passing the newly created object and the current session to the createPlacemark function and then api
    const createdPlacemark = await placemarkService.createPlacemark(newPlacemark, get(currentSession));
    if (!createdPlacemark) {
      textColour = "danger";
      message = "Creation not completed - some error occurred";
      return;
    } else {
      textColour = "success";
      message = `Placemark successfully created!`;
			// setting the latestPlacemark store to the created placemark
      latestPlacemark.set(createdPlacemark);
    }
  }
</script>

<form on:submit|preventDefault={createPlacemark}>
  <div class="field">
    <label class="label" for="title">Title:</label>
    <input bind:value={title} class="input" id="title" name="title" type="text" required />
  </div>
  <div class="field">
    <label class="label" for="description">Description:</label>
    <textarea bind:value={description} class="textarea" id="description" name="description" required></textarea>
  </div>
  <div class="field">
    <label class="label" for="location">Location:</label>
    <input bind:value={location} class="input" id="location" name="location" type="text" required />
  </div>
  <div class="field">
    <label class="label" for="latitude">Latitude:</label>
    <input bind:value={latitude} class="input" id="latitude" name="latitude" type="number" step="any" required />
  </div>
  <div class="field">
    <label class="label" for="longitude">Longitude:</label>
    <input bind:value={longitude} class="input" id="longitude" name="longitude" type="number" step="any" required />
  </div>
  <div class="field">
    <label class="label" for="category">Category:</label>
    <select bind:value={category} class="input" id="category" name="category" required>
      {#each allowedCategories as cat}
        <option value={cat}>{cat}</option>
      {/each}
    </select>
  </div>
  <div class="field has-text-centered has-text-{textColour} is-outlined p-2">
    {message}
  </div>
  <div class="field">
    <div class="control">
      <button class="button is-success is-fullwidth">Create Placemark<span class="icon ml-2"><i class="fa fa-plus"></i></span></button>
    </div>
  </div>
</form>
