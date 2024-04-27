<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";

	export let placemarkId : string;

	let widget: { open: () => void; };

	const cloudinary = typeof window !== 'undefined' ? (window as any).cloudinary : null;

	const dispatch = createEventDispatcher();

	onMount(() => {
		if (cloudinary) {
        widget = cloudinary.createUploadWidget({
            cloudName: "dyi6tqhuo",
            uploadPreset: "placemark"
        }, (error: any, result: any) => {
            if (!error && result && result.event === "success") {
								dispatch("imageUploaded", { imageUrl: result.info.secure_url });
            }
        });
    }
	});

	async function handleWidget() {
  if (widget) {
    widget.open();
  }
}
</script>

<!-- svelte-ignore a11y-invalid-attribute -->
<!-- svelte-ignore a11y-missing-content -->
<a href="#" title="Upload Image" class="card-footer-item" on:click={handleWidget} >
	<span class="icon has-text-success">
		<i class="fas fa-camera-retro"></i>
	</span>
</a>
