<script lang="ts">
  import { subTitle } from "$lib/stores";
</script>

<section class="hero is-success is-is-box is-small has-text-centered mt-6 mb-6">
  <div class="hero-body">
    <div class="title is-flex">
      <i style="font-size: 60px;" class="fas fa-solid fa-map-pin has-text-white"></i>
      <i style="font-size: 60px;" class="ml-4 fas fa-solid fa-globe has-text-white"></i>
      <i style="font-size: 60px;" class="ml-4 fas fa-solid fa-map has-text-white"></i>
      <div class="ml-4 has-text-bold has-text-white is-size-1">{$subTitle}</div>
    </div>
  </div>
</section>


