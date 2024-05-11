<script lang="ts">
  import Heading from "$lib/ui/Heading.svelte";
  import Menu from "$lib/ui/Menu.svelte";
  import { currentSession } from "$lib/stores";
  import { fly } from "svelte/transition";
  import { themeStore } from "$lib/stores";
  import { browser } from "$app/environment";

  export let data: any;
  if (data.session) {
    currentSession.set(data.session);
  } else {
    currentSession.set({ name: "", _id: "", token: "" });
    themeStore.set("light");
  }



let currentTheme = 'light';
themeStore.subscribe((value: string) => {
  currentTheme = value;
  if (browser) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }
});
</script>

<div data-theme={currentTheme}>
<div class="container">
    {#if $currentSession.token}
    <Menu />
    {/if}

    {#key data.url}
      <div 
        in:fly={{ x: -200, duration: 400, delay: 300}}
        out:fly={{ x: 200, duration: 400}}
        >
        {#if $currentSession.token}
        <Heading />
        {/if}
        <slot />
      </div>
    {/key}
</div>
</div>
