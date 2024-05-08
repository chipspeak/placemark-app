<script lang="ts">
    import type { Placemark } from "$lib/types/placemark-types";
    import UploadWidget from "./UploadWidget.svelte";
    
    export let placemark: Placemark;
    export let handleUpdate: (placemark: Placemark) => void;
    export let handleDelete: (placemarkId: string) => void;
    export let handleImageUploaded: (event: CustomEvent, placemarkId: string) => void;
    export let handleImageDelete: (placemarkId: string) => void;

</script>

<footer class="card-footer">
  <hr>
  <!-- Update Placemark button -->
  <button title="Update Placemark" class="card-footer-item" on:click={() => handleUpdate(placemark)}>
      <span class="icon has-text-success">
          <i class="fas fa-pen-nib"></i>
      </span>
  </button>

  <!-- UploadWidget component -->
  <UploadWidget placemarkId={placemark._id} on:imageUploaded={(event) => handleImageUploaded(event, placemark._id)} />

  <!-- Delete Image button -->
  <button title="Delete Image" class="card-footer-item" on:click={() => handleImageDelete(placemark._id)}>
      <span class="icon has-text-danger">
          <i class="fas fa-camera"></i>
      </span>
  </button>

  <!-- Delete Placemark button -->
  <button title="Delete Placemark" class="card-footer-item" on:click={() => handleDelete(placemark._id)}>
      <span class="icon has-text-danger">
          <i class="fas fa-trash"></i>
      </span>
  </button>
</footer>