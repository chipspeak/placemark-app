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
      let firebaseUser = {
        email: email,
        password: password,
      };
      console.log(firebaseUser)
      success = await placemarkService.signupViaFirebase(firebaseUser.email, firebaseUser.password);
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
    <button class="mt-5 button is-success is-fullwidth">Create Account</button>
    <br />
  </form>
  