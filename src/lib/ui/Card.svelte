<script lang="ts">
  export let title = "";
</script>

<div class="card mb-5">
  <header class="card-header">
    <p class="card-header-title">
      <span class="icon"><i class="fas fa-map mr-4"></i></span><span>{title}</span>
    </p>
  </header>
  <div class="card-content">
    <div class="content">
      <slot />
    </div>
  </div>
</div>

