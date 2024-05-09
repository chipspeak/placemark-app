<script lang="ts">
  import { getIconUrl } from "$lib/utils/utils";
  import type { Placemark } from "$lib/types/placemark-types";
  import InPlaceEdit from "./InPlaceEdit.svelte";
  import PlacemarkDetails from "./PlacemarkDetails.svelte";
  import WeatherDetails from "./WeatherDetails.svelte";
  import ImageCarousel from "./ImageCarousel.svelte";
  import PlacemarkFooter from "./PlacemarkFooter.svelte";

  export let toggleWeatherCollapse: (event: Event, id: string) => void;
  export let toggleCollapse: (event: Event, id: string) => void;
  export let togglePhotoCollapse: (event: Event, id: string) => void;
  export let handleUpdate: (placemark: Placemark) => void;
  export let handleDelete: (placemarkId: string) => void;
  export let handleImageUploaded: (event: CustomEvent, placemarkId: string) => void;
  export let handleImageDelete: (placemarkId: string) => void;
  export let submit: (field: string | number) => void;

  export let columnSize: string;
  export let weatherCollapse: Record<string, boolean> = {};
  export let placemarks: Placemark[];
  export let currentImageIndex: Record<string, number> = {};
  export let photoCollapse: Record<string, boolean> = {};
  export let collapseState: Record<string, boolean> = {};
  export let weatherDataMap: Record<string, any>;
  export let placemark: Placemark;
</script>

<div class="column {columnSize}">
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
          <PlacemarkDetails {placemark} onUpdate={handleUpdate} />
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
