<script lang="ts">
import SignupForm from "./SignupForm.svelte";
</script>

<section class="hero is-fullheight is-default is-bold">
  <div class="hero-head"></div>
  <div class="hero-body">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-5">
          <h1 class="title has-text-success has-text-centered">Signup to PLACEMARK<i class="ml-4 fas fa-solid fa-map has-text-success"></i></h1>
          <div class="box">
            <SignupForm></SignupForm>
            <p class="has-text-centered mt-2">Already have an account? <a href="/login" data-cy="login-redirect">Login Here</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
