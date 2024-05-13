<script lang="ts">
  import { goto } from "$app/navigation";
  import UserCredentials from "$lib/ui/UserCredentials.svelte";
  import Message from "$lib/ui/Message.svelte";
  import { placemarkService } from "$lib/services/placemark-service";

  // Declare variables
  let email = "";
  let password = "";
  let message = "";
  let colour = "";

  // Function to sleep for a given number of milliseconds (mimicking python's time.sleep() function)
  function sleep(ms: number | undefined) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Function to sign up a user with email and password. Checks against various error codes (from Firebase) and displays appropriate message
  async function signup() {
    try {
      console.log(`attempting to sign up email: ${email}`);
      await placemarkService.signup(email, password);
      colour = "success";
      message = "Sign up successful. Directing to login page.";
      await sleep(2000);
      goto("/login");
    } catch (error: any) {
      console.error("Signup Error: ", error);
      if (error.code === "auth/email-already-in-use") {
        colour = "danger";
        message = "Email is already in use. Please see the log in link below.";
      } else if (error.code === "auth/weak-password") {
        colour = "danger";
        message = "Password is too weak. Passwords need to be at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        colour = "danger";
        message = "Invalid email. Please use a valid email.";
      } else if (error.code === "auth/missing-password") {
        colour = "danger";
        message = "The password field cannot be empty.";
      } else if (error.code === "auth/missing-email") {
        colour = "danger";
        message = "The email field cannot be empty.";
      } else {
        colour = "danger";
        message = "Error trying to sign up. Please try again later.";
      }
    }
  }

  // Function to sign up a user with a provider (Google, Github, Microsoft). Redirects to login page on success
  async function handleSignup(providerType: "google" | "github" | "microsoft") {
    let success = false;
    console.log(`attemting to sign up email: ${email}`);
    success = await placemarkService.signupViaProvider(providerType);
    if (success) {
      colour = "success";
      message = "Sign up successful. Directing to login page.";
      await sleep(2000);
      goto("/login");
    } else {
      colour = "danger";
      message = "Error Trying to sign up";
    }
  }
</script>

<!-- Form -->
<form on:submit|preventDefault={signup}>
  <UserCredentials bind:email bind:password />
  {#if message}
    <div class=" mt-5 mb-5 is-fullwidth">
      <Message {message} {colour} />
    </div>
  {/if}
  <button class="mt-5 button is-success is-fullwidth">
    <span>Create an account</span>
    <span class="icon is-small">
      <i class="fa fa-user"></i>
    </span>
  </button>
  <p class="has-text-centered mt-2">Or</p>
</form>
<button class="mt-3 button is-success is-fullwidth" on:click={() => handleSignup("google")}>
  <span>Sign up via Google</span>
  <span class="icon is-small">
    <i class="fab fa-google"></i>
  </span>
</button>
