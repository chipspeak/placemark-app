<script lang="ts">
  import { goto } from "$app/navigation";
  import UserCredentials from "$lib/ui/UserCredentials.svelte";
  import UserDetails from "$lib/ui/UserDetails.svelte";
  import Message from "$lib/ui/Message.svelte";
  import { placemarkService } from "$lib/services/placemark-service";

  let email = "";
  let password = "";
  let message = "";

  async function signup() {
    let success = false;
    console.log(`attemting to sign up email: ${email}`);
    let user = {
      email: email,
      password: password,
    };
    console.log(user)
    success = await placemarkService.signup(user.email, user.password);
    if (success) {
      goto("/login");
    } else {
      message = "Error Trying to sign up";
    }
  }
  async function handleSignup(providerType: 'google' | 'github' | 'microsoft' ) {
      let success = false;
      console.log(`attemting to sign up email: ${email}`);
      success = await placemarkService.signupViaProvider(providerType);
      if (success) {
        goto("/login");
      } else {
        message = "Error Trying to sign up";
      }
    }
  </script>
  
  {#if message}
    <Message {message} />
  {/if}
  <form on:submit|preventDefault={signup}>
    <UserCredentials bind:email bind:password />
    <button class="mt-5 button is-success is-fullwidth">
      <span>Create an account</span>
      <span class="icon is-small">
        <i class="fa fa-user"></i>
      </span>
    </button>
    <p class="has-text-centered mt-2">Or</p>
  </form>
  <button class="mt-3 button is-success is-fullwidth" on:click={() => handleSignup('google')}>
    <span>Sign up via Google</span>
    <span class="icon is-small">
      <i class="fab fa-google"></i>
    </span>
  </button>
