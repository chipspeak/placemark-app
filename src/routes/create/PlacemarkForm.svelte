<script lang="ts">
  import { placemarkService } from "$lib/services/placemark-service";
  import type { newPlacemark } from "$lib/types/placemark-types";
  import { currentSession, latestPlacemark } from "$lib/stores";
  import { get } from "svelte/store";

  let title = "Placemark Title";
  let description = "Placemark Description";
  let location = "Placemark Location";
  let latitude = 0.1;
  let longitude = 0.1;
  let category = "Park";
  let img = "Placemark Image";
  let message = "";
  const allowedCategories = ["Park", "Castle", "Ancient Ruin", "Walk", "Beach", "River", "Lake", "Waterfall", "Hike", "Cave", "Ringfort", "Dolmen", "Monument", "National Park"];


  async function createPlacemark() {
    if (title && description && location && latitude && longitude && category) {
        const newPlacemark: newPlacemark = {
          title : title,
          description : description,
          location : location,
          latitude : latitude,
          longitude : longitude,
          category : category,
          img : "/images/burren.jpg",
        };
        const createdPlacemark = await placemarkService.createPlacemark(newPlacemark, get(currentSession));
        if (!createdPlacemark) {
          message = "Creation not completed - some error occurred";
          return;
        }
        else {
        latestPlacemark.set(createdPlacemark);
        console.log("latest: " + $latestPlacemark);
        message = `Placemark successfully created!`;
      }
    }
  } 
</script>

<form on:submit|preventDefault={createPlacemark}>
  <div class="field">
    <label class="label" for="title">Title:</label>
    <input bind:value={title} class="input" id="title" name="title" type="text" />
  </div>
  <div class="field">
    <label class="label" for="description">Description:</label>
    <textarea bind:value={description} class="textarea" id="description" name="description"></textarea>
  </div>
  <div class="field">
    <label class="label" for="location">Location:</label>
    <input bind:value={location} class="input" id="location" name="location" type="text" />
  </div>
  <div class="field">
    <label class="label" for="latitude">Latitude:</label>
    <input bind:value={latitude} class="input" id="latitude" name="latitude" type="number" />
  </div>
  <div class="field">
    <label class="label" for="longitude">Longitude:</label>
    <input bind:value={longitude} class="input" id="longitude" name="longitude" type="number" />
  </div>
  <div class="field">
    <label class="label" for="category">Category:</label>
    <select bind:value={category} class="input" id="category" name="category">
      {#each allowedCategories as cat}
        <option value={cat}>{cat}</option>
      {/each}
    </select>
  </div>
  <div class="field">
    <div class="control">
      <button class="button is-success is-fullwidth">Create Placemark</button>
    </div>
  </div>
</form>
<div class="box mt-4">
  <div class="content has-text-centered">
    {message}
  </div>
</div>
