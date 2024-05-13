<script lang="ts">
  import { currentSession } from "$lib/stores";
  import { subTitle } from "$lib/stores";
  import { themeStore } from "$lib/stores";

  // Function to toggle the theme between light and dark using Bulma's is-dark/is-light classes
  function toggleTheme() {
    themeStore.update((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }
</script>

<!-- Menu component -->
<!-- Check to ensure a subtitle is present and if not, navbar isn't rendered. -->
{#if $subTitle}
  <nav class="p-1 ml-1 mr-1 navbar is-left-alligned">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item" href="/create">
          <span class="icon"> <img class="object-fit" src="/icon.png" alt="placemark-icon" /></span><span class="pl-2"><strong>PLACEMARK</strong> </span>
        </a>
      </div>
      <div id="navbarMenu" class="navbar-menu">
        <div class="navbar-end">
          <button on:click={toggleTheme} class="navbar-item mr-3">
            {#if $themeStore === "dark"}
              Light Theme
              <span class="icon">
                <i class="ml-5 fas fa-adjust"></i>
              </span>
            {:else}
              Dark Theme
              <span class="icon">
                <i class="ml-5 fas fa-adjust"></i>
              </span>
            {/if}
          </button>
          <a class="navbar-item mr-2" href="/create">Create<icon class="fas fa-map-pin ml-2"></icon></a>
          <a class="navbar-item mr-2" href="/report">View<icon class="fas fa-map ml-2"></icon></a>
          <a class="navbar-item mr-2" href="/gallery">Gallery<icon class="fas fa-camera ml-2"></icon></a>
          <a class="navbar-item mr-2" href="/charts">Charts<icon class="fas fa-calculator ml-2"></icon></a>
          <a data-sveltekit-preload-data="tap" class="navbar-item" href="/logout"
            >Logout<span class="pl-2"></span> [{$currentSession?.name}]<icon class="fas fa-user ml-2"></icon></a
          >
        </div>
      </div>
    </div>
  </nav>
{/if}
