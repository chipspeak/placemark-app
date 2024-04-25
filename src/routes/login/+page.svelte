<script lang="ts">
  import LoginForm from "./LoginForm.svelte";
</script>

<section class="hero is-fullheight is-default is-bold">
  <div class="hero-head"></div>
  <div class="hero-body">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-5">
          <h1 class="title has-text-success has-text-centered">Login to PLACEMARK<i class="ml-4 fas fa-solid fa-globe has-text-success"></i></h1>
          <div class="box">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
