<script lang="ts">
  import { subTitle } from "$lib/stores";
</script>

{#if $subTitle}
<section class="card has-background-success mt-4 mb-5 p-5">
  <div class="hero-body">
    <div class="title is-flex">

      <i style="font-size: 40px;" class="ml-4 fas fa-solid fa-globe has-text-dark"></i>

      <div class="ml-4 has-text-bold has-text-dark is-size-3">{$subTitle}</div>
    </div>
  </div>
</section>
{/if}


