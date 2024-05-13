<script lang="ts">
  import Heading from "$lib/ui/Heading.svelte";
  import Menu from "$lib/ui/Menu.svelte";
  import { currentSession } from "$lib/stores";
  import { fly } from "svelte/transition";
  import { themeStore } from "$lib/stores";
  import { browser } from "$app/environment";

  // Define the data prop to receive data from server
  export let data: any;
  if (data.session) {
    // Set the current session data
    currentSession.set(data.session);
  } else {
    // Clear the session data and set the theme to light
    currentSession.set({ name: "", _id: "", token: "" });
    themeStore.set("light");
  }

  let currentTheme = "light";
  // Subscribe to the theme store to update the theme for each page when it changes
  themeStore.subscribe((value: string) => {
    currentTheme = value;
    if (browser) {
      document.documentElement.setAttribute("data-theme", currentTheme);
    }
  });
</script>

<!-- Define the core layout of application -->
<!-- Outer div allows full page theme toggles to occur -->
<!-- Inner div contains the main content of the page -->
<div data-theme={currentTheme}>
  <div class="container">
    {#if $currentSession.token}
      <Menu />
    {/if}
    {#key data.url}
      <div in:fly={{ x: -200, duration: 400, delay: 300 }} out:fly={{ x: 200, duration: 400 }}>
        {#if $currentSession.token}
          <Heading />
        {/if}
        <slot />
      </div>
    {/key}
  </div>
</div>
