<script lang="ts">
    import InPlaceEdit from "../../lib/ui/InPlaceEdit.svelte";
    import type { Placemark } from "$lib/types/placemark-types";
    import { acts } from "@tadashi/svelte-notification";
    
    export let placemark: Placemark;
    export let onUpdate: (updatedPlacemark: Placemark) => void;
    
    function handleSubmit(field: string) {
        return ({ detail: newValue }: { detail: any }) => {
            let inputError = false;

            // Regex patterns for input validation
            const alphanumericPattern = /^[a-zA-Z0-9\s.-]+$/;

            const numberPattern = /^-?\d*\.?\d*$/;

            // Input validation checks
            switch (field) {
                case "title":
                    if (!alphanumericPattern.test(newValue)) {
                        inputError = true;
                        return acts.add({ mode: 'danger', lifetime: '3', message:"Title can only contain letters, numbers, spaces, and punctuation!" });
                    }
                    break;
                case "description":
                    if (!alphanumericPattern.test(newValue)) {
                        inputError = true;
                        return acts.add({ mode: 'danger', lifetime: '3', message:"Description can only contain letters, numbers, spaces, and punctuation!" });
                    }
                    break;
                case "location":
                    if (!alphanumericPattern.test(newValue)) {
                        inputError = true;
                        return acts.add({ mode: 'danger', lifetime: '3', message:"Location can only contain letters, numbers, spaces, and punctuation!"});
                    }
                    break;
                case "latitude":
                    if (!numberPattern.test(newValue) || parseFloat(newValue) < -90 || parseFloat(newValue) > 90) {
                        inputError = true;
                        return acts.add({ mode: 'danger', lifetime: '3', message:"Latitude must be a number between -90 and 90!"});
                    }
                    break;
                case "longitude":
                    if (!numberPattern.test(newValue) || parseFloat(newValue) < -180 || parseFloat(newValue) > 180) {
                        inputError = true;
                        return acts.add({ mode: 'danger', lifetime: '3', message:"Longitude must be a number between -180 and 180!"});
                    }
                    break;
                default:
                    break;
            }

            // If input error occurred, return without updating the placemark
            if (inputError) return;

            // Update the placemark field
            placemark[field] = newValue;
            onUpdate(placemark);
        };
    }
</script>

<div>
    <p><strong>Description:</strong> <InPlaceEdit bind:value={placemark.description} on:submit={handleSubmit("description")} /></p>
    <p><strong>Location:</strong> <InPlaceEdit bind:value={placemark.location} on:submit={handleSubmit("location")} /></p>
    <p><strong>Latitude:</strong> <InPlaceEdit bind:value={placemark.latitude} on:submit={handleSubmit("latitude")} /></p>
    <p><strong>Longitude:</strong> <InPlaceEdit bind:value={placemark.longitude} on:submit={handleSubmit("longitude")} /></p>
    <p><strong>Category:</strong> <InPlaceEdit bind:value={placemark.category} on:submit={handleSubmit("category")} allowedCategories={["Park", "Castle", "Ancient Ruin", "Walk", "Beach", "River", "Lake", "Waterfall", "Hike", "Cave", "Ringfort", "Dolmen", "Monument", "National Park"]} isCategoryField={true} /></p>
</div>