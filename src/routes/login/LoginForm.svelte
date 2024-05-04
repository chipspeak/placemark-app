<script lang="ts">
  import Message from "$lib/ui/Message.svelte";
  import UserCredentials from "$lib/ui/UserCredentials.svelte";

  let message: string = "";
</script>

<!-- svelte-ignore missing-declaration -->
{#if message}
  <Message {message} />
{/if}
<form method="POST" action="?/login">
  <UserCredentials />
  <button class="mt-5 button is-success is-fullwidth">Log In</button>
</form>
