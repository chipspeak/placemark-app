<script lang="ts">
  import { placemarkService } from "$lib/services/placemark-service";
  import { goto } from "$app/navigation";
  import Message from "$lib/ui/Message.svelte";
  import UserCredentials from "$lib/ui/UserCredentials.svelte";
  import { currentSession } from "$lib/stores";
  import { acts } from '@tadashi/svelte-notification';

  let message: string = "";

  async function handleLogin(providerType: "google" | "github" | "microsoft") {
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
        acts.add({ mode: 'danger', lifetime: '3', message: `Google login failed!` });
        await goto("/");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      acts.add({ mode: 'danger', lifetime: '3', message: `Error during Google login: ${error}` });
    }
  }
</script>

<!-- svelte-ignore missing-declaration -->
{#if message}
  <Message {message} />
{/if}
<form method="POST" action="?/login">
  <UserCredentials />
  <button class="mt-5 button is-success is-fullwidth">    <span>Log in via Placemark account</span>
    <span class="icon is-small">
      <i class="fa fa-map"></i>
    </span></button>
</form>
<p class="has-text-centered mt-2">Or</p>
<button class="mt-3 button is-success is-fullwidth" on:click={() => handleLogin("google")}><span>Log in directly via Google</span>
  <span class="icon is-small">
    <i class="fab fa-google"></i>
  </span></button>
