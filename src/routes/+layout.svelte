<script lang="ts">
  import Heading from "$lib/ui/Heading.svelte";
  import Menu from "$lib/ui/Menu.svelte";
  import { currentSession } from "$lib/stores";
  import { fly } from "svelte/transition";

  export let data: any;
  if (data.session) {
    currentSession.set(data.session);
  } else {
    currentSession.set({ name: "", _id: "", token: "" });
  }
</script>

<div class="container">
    {#if $currentSession.token}
    <Menu />
    {/if}

    {#key data.url}
      <div 
        in:fly={{ x: -200, duration: 300, delay: 300}}
        out:fly={{ x: 200, duration: 300}}
        >
        {#if $currentSession.token}
        <Heading />
        {/if}
        <slot />
      </div>
    {/key}

</div>
