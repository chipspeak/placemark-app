<script lang="ts">
  import type { Placemark } from "$lib/types/placemark-types";
  import InPlaceEdit from "./InPlaceEdit.svelte";
  import WeatherDetails from "./WeatherDetails.svelte";
  import ImageCarousel from "./ImageCarousel.svelte";
  import PlacemarkFooter from "./PlacemarkFooter.svelte";
  import { columnSizeStore } from "$lib/stores";
  import { acts } from '@tadashi/svelte-notification';

  export let toggleWeatherCollapse: (event: Event, id: string) => void;
  export let toggleCollapse: (event: Event, id: string) => void;
  export let togglePhotoCollapse: (event: Event, id: string) => void;
  export let handleUpdate: (placemark: Placemark) => void;
  export let handleDelete: (placemarkId: string) => void;
  export let handleImageUploaded: (event: CustomEvent, placemarkId: string) => void;
  export let handleImageDelete: (placemarkId: string) => void;
  export let submit: (field: string | number) => void;

  export let weatherCollapse: Record<string, boolean> = {};
  export let placemarks: Placemark[];
  export let currentImageIndex: Record<string, number> = {};
  export let photoCollapse: Record<string, boolean> = {};
  export let collapseState: Record<string, boolean> = {};
  export let weatherDataMap: Record<string, any>;
  export let placemark: Placemark;
  

  function handleSubmit(field: string) {
        return ({ detail: newValue }: { detail: any }) => {
            let inputError = false;

            // Regex patterns for input validation
            const alphanumericPattern = /^[a-zA-Z0-9\s.-]+$/;

            const numberPattern = /^-?\d*\.?\d*$/;

            // Input validation checks
            switch (field) {
                case "title":
                    if (!alphanumericPattern.test(newValue) || newValue === "") {
                        inputError = true;
                        return acts.add({ mode: 'danger', lifetime: '3', message:"Title can only contain letters, numbers, spaces, and punctuation!" });
                    }
                    break;
                case "description":
                    if (!alphanumericPattern.test(newValue) || newValue === "") {
                        inputError = true;
                        return acts.add({ mode: 'danger', lifetime: '3', message:"Description can only contain letters, numbers, spaces, and punctuation!" });
                    }
                    break;
                case "location":
                    if (!alphanumericPattern.test(newValue) || newValue === "") {
                        inputError = true;
                        return acts.add({ mode: 'danger', lifetime: '3', message:"Location can only contain letters, numbers, spaces, and punctuation!"});
                    }
                    break;
                case "latitude":
                    if (!numberPattern.test(newValue) || parseFloat(newValue) < -90 || parseFloat(newValue) > 90) {
                        inputError = true;
                        return acts.add({ mode: 'danger', lifetime: '3', message:"Latitude must be a number between -90 and 90!"});
                    }
                    break;
                case "longitude":
                    if (!numberPattern.test(newValue) || parseFloat(newValue) < -180 || parseFloat(newValue) > 180) {
                        inputError = true;
                        return acts.add({ mode: 'danger', lifetime: '3', message:"Longitude must be a number between -180 and 180!"});
                    }
                    break;
                default:
                    break;
            }

            // If input error occurred, return without updating the placemark
            if (inputError) return;

            // Update the placemark field
            placemark[field] = newValue;
            // handleUpdate(placemark);
            submit(field);

            acts.add({ mode: 'success', lifetime: '3', message: `${field} updated. Click the update button to submit changes!` });
        };
    }
</script>

<div class="column {$columnSizeStore}">
  <div class="card">
    <header class="card-header">
      <p class="card-header-title is-centered">
        <InPlaceEdit bind:value={placemark.title} on:submit={() => submit("title")} />
      </p>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        class="card-header-icon"
        title="Expand/Collapse Details"
        aria-label="more options"
        data-action="collapse"
        href="#"
        on:click={(event) => toggleCollapse(event, `details-${placemark._id}`)}
      >
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
            <p><strong>Description:</strong> <InPlaceEdit bind:value={placemark.description} on:submit={handleSubmit("description")} /></p>
            <p><strong>Location:</strong> <InPlaceEdit bind:value={placemark.location} on:submit={handleSubmit("location")} /></p>
            <p><strong>Latitude:</strong> <InPlaceEdit bind:value={placemark.latitude} on:submit={handleSubmit("latitude")} /></p>
            <p><strong>Longitude:</strong> <InPlaceEdit bind:value={placemark.longitude} on:submit={handleSubmit("longitude")} /></p>
            <p><strong>Category:</strong> <InPlaceEdit bind:value={placemark.category} on:submit={handleSubmit("category")} allowedCategories={["Park", "Castle", "Ancient Ruin", "Walk", "Beach", "River", "Lake", "Waterfall", "Hike", "Cave", "Ringfort", "Dolmen", "Monument", "National Park"]} isCategoryField={true} /></p>
        </div>
        <div class="column">
          <WeatherDetails {placemark} {weatherDataMap} {weatherCollapse} {toggleWeatherCollapse} />
        </div>
      </div>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        class="card-header-icon"
        title="Expand/Collapse Photo"
        aria-label="more options"
        data-action="collapse"
        href="#"
        on:click={(event) => togglePhotoCollapse(event, `photo-${placemark._id}`)}
      >
        <span class="icon">
          {#if photoCollapse[`photo-${placemark._id}`]}
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          {/if}
          {#if !photoCollapse[`photo-${placemark._id}`]}
            <i class="fas fa-angle-up" aria-hidden="true"></i>
          {/if}
        </span>
      </a>
      <ImageCarousel {placemarks} {placemark} {photoCollapse} {currentImageIndex} />
    </div>
    <PlacemarkFooter {placemark} {handleUpdate} {handleDelete} {handleImageUploaded} {handleImageDelete} />
  </div>
</div>