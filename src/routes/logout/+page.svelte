<script lang="ts">
  import { goto } from "$app/navigation";
  import { cardColumnSizeStore, columnSizeStore, currentSession, themeStore } from "$lib/stores";
  
  // Clear the session data and reset the theme and column size stores
  currentSession.set({ name: "", _id: "", token: "" });
  themeStore.set("light");
  cardColumnSizeStore.set("is-half");
  columnSizeStore.set("is-half");
  goto("/");
</script>
