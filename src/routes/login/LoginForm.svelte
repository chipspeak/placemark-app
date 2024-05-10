<script lang="ts">
  import { placemarkService } from "$lib/services/placemark-service";
  import { goto } from "$app/navigation";
  import Message from "$lib/ui/Message.svelte";
  import UserCredentials from "$lib/ui/UserCredentials.svelte";
    import { currentSession } from "$lib/stores";
    import { Icon } from "leaflet";

  let message: string = "";

  /*
  async function googleLogin () {
    const session = await placemarkService.loginWithGoogle();
    if (session) {
      const userJson = JSON.stringify(session);
      throw goto("/create");
    } else {
      throw goto("/");
    }
  }
  */

  async function handleLogin(providerType: 'google' | 'github' | 'microsoft' ) {
    try {
      
      const session = await placemarkService.loginWithProvider(providerType);

      if (session) {
        console.log("Login successful, sending session data to server.");

        const formData = new URLSearchParams();
        formData.append("session", JSON.stringify(session));

        const response = await fetch("?/setSession", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formData.toString()
        });

        if (response.ok) {
          // setting current session here so that create loads without needing a refresh of the csr session data
          currentSession.set(session);
          await goto("/create");
        } else {
          console.error("Failed to set session on server.");
          await goto("/");
        }
      } else {
        console.error("Google login failed.");
        await goto("/");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  }
</script>

<!-- svelte-ignore missing-declaration -->
{#if message}
  <Message {message} />
{/if}
<form method="POST" action="?/login">
  <UserCredentials />
  <button class="mt-5 button is-success is-fullwidth">Log In via Placemark</button>
</form>
<button class="mt-5 button is-success is-fullwidth" on:click={() => handleLogin('google')}>Login via Google</button>
