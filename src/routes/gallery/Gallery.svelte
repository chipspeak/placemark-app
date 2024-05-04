<script lang="ts">
  import type { Placemark } from "$lib/types/placemark-types";
  import { subTitle } from "$lib/stores";

  export let data: any;
  export let placemarks: Placemark[];

	subTitle.set("Image Gallery");
</script>


<style>
  
  .card-image img {
    width: 100%; 
    height: 400px;
    object-fit: cover; 
  }
</style>


<div class="columns is-multiline">
  {#each placemarks as placemark}
    {#if placemark.img}
      <div class="column is-half">
        <div class="card">
          <div class="card-image">
            <figure class="image">
              <img src={placemark.img} alt={placemark.title} title={placemark.title} />
            </figure>
          </div>
          <footer class="card-footer">
            <p class="card-footer-item pt-5">{placemark.title}</p>
						<p class="card-footer-item pt-2">{placemark.location}</p>
          </footer>
        </div>
      </div>
    {/if}
  {/each}
</div>
