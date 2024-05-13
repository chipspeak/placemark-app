<script lang="ts">
import SignupForm from "./SignupForm.svelte";
</script>

<!-- Signup route page -->
<section class="hero is-fullheight is-default is-bold">
  <div class="hero-head"></div>
  <div class="hero-body">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-5">
          <h1 class="title has-text-success has-text-centered">Signup to PLACEMARK<i class="ml-4 fas fa-solid fa-map has-text-success"></i></h1>
          <div class="box">
            <!-- Signup form component -->
            <SignupForm></SignupForm>
            <p class="has-text-centered mt-4">Already have an account? Log in <a href="/login" data-cy="login-redirect">here</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
