<script lang="ts">
  import { currentSession } from "$lib/stores";
  import { subTitle } from "$lib/stores";
</script>

{#if $subTitle}
<nav class="navbar is-left-alligned">
  <div class="container">
    <div class="navbar-brand">
      <a class="navbar-item" href="/create">
        <span class="icon"> <img class="object-fit" src="/icon.png" alt="placemark-icon" /></span><span class="pl-2"><strong>PLACEMARK</strong> </span>
      </a>
    </div>
    <div id="navbarMenu" class="navbar-menu">
      <div class="navbar-end">
        <a class="navbar-item" href="/create">Create</a>
        <a class="navbar-item" href="/report">View</a>
        <a class="navbar-item" href="/gallery">Gallery</a>
        <a class="navbar-item" href="/charts">Charts</a>
        <a data-sveltekit-preload-data="tap" class="navbar-item" href="/logout">Logout [{$currentSession?.name}]</a>
      </div>
    </div>
  </div>
</nav>
{/if}

