<script lang="ts">
  import { placemarkService } from "$lib/services/placemark-service";
  import { goto } from "$app/navigation";
  import Message from "$lib/ui/Message.svelte";
  import UserCredentials from "$lib/ui/UserCredentials.svelte";
  import { currentSession } from "$lib/stores";

  // Function to handle login with provider
  async function handleLogin(providerType: "google" | "github" | "microsoft") {
    try {
      // Login with the specified provider
      const session = await placemarkService.loginWithProvider(providerType);
      // If the session is valid, send it to the server
      if (session) {
        console.log("Login successful, sending session data to server.");
        // Form data is declared and the session is appended to it
        const formData = new URLSearchParams();
        formData.append("session", JSON.stringify(session));
        // Fetch request passes the form data to the server's setSession endpoint
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
