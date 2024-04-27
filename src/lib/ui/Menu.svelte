<script lang="ts">
  import { currentSession } from "$lib/stores";
</script>

<nav class="navbar is-left-alligned">
  <div class="container">
    <div class="navbar-brand">
      <a class="navbar-item" href="/create">
        <span class="icon"> <i class="fas fa-map-marker-alt"></i></span><span><strong>Placemark</strong> </span>
      </a>
    </div>
    <div id="navbarMenu" class="navbar-menu">
      <div class="navbar-end">
        <a class="navbar-item" href="/create"> Create </a>
        <a class="navbar-item" href="/report"> View </a>
        <a class="navbar-item" href="/gallery"> Gallery </a>
        <a class="navbar-item" href="/logout"> Logout [{$currentSession.name}]</a>
      </div>
    </div>
  </div>
</nav>

