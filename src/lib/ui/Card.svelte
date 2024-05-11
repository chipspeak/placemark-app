<script lang="ts">
  export let title = "";
  export let icon = "";
</script>

<div class="card mb-5">
  <header class="card-header">
    <p class="card-header-title">
      {#if icon}
        <span class="icon">
          <i class="fas {icon} mr-2"></i>
        </span>
      {/if}
      {title}
      <span class="card-header-extra">
        <slot name="header-extra" />
      </span>
      <span class="card-header-extra-2">
        <slot name="header-extra-2" />
      </span>
    </p>
  </header>
  <div class="card-content">
    <slot />
  </div>
</div>

<style>
  /* Add styles to position the extra content in the header */
  .card-header-extra {
    margin-left: auto;
  }
</style>

