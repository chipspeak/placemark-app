<script lang="ts">
    import { getIconUrl } from "$lib/utils/utils";
    import type { Placemark } from "$lib/types/placemark-types";
    
    export let weatherCollapse: Record<string, boolean> = {};
    export let toggleWeatherCollapse: (event: Event, id: string) => void;
    export let weatherDataMap: Record<string, any>;
    export let placemark: Placemark;

    
</script>
    

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
      <p class="mt-2"><strong>Temperature:</strong> {weatherDataMap[placemark._id]?.main.temp}° celsius</p>
      <p class="mt-2"><strong>Wind Speed:</strong> {weatherDataMap[placemark._id]?.wind.speed} km/ph</p>
      <p class="mt-2"><strong>Wind Direction:</strong> {weatherDataMap[placemark._id]?.wind.deg}°</p>
      <p class="mt-2"><strong>Pressure</strong> {weatherDataMap[placemark._id]?.main.pressure} atm</p>
    </div>
{/if}