<script lang="ts">
  import { subTitle } from "$lib/stores";
  import Menu from "./Menu.svelte";
</script>

{#if $subTitle}
<section class="card has-background-success is-box is-small mt-4 mb-6 p-6">
  <div class="body">
    <div class="title is-flex">
      <i style="font-size: 40px;" class="fas fa-solid fa-map-pin has-text-dark"></i>
      <i style="font-size: 40px;" class="ml-4 fas fa-solid fa-globe has-text-dark"></i>
      <i style="font-size: 40px;" class="ml-4 fas fa-solid fa-map has-text-dark"></i>
      <div class="ml-4 has-text-bold has-text-dark is-size-3">{$subTitle} <Menu /></div>
    </div>
  </div>
</section>
{/if}


