<script lang="ts">
    import InPlaceEdit from "../../lib/ui/InPlaceEdit.svelte";
    import type { Placemark } from "$lib/types/placemark-types";
    
    export let placemark: Placemark;
    export let onUpdate: (updatedPlacemark: Placemark) => void;
    
    function handleSubmit(field: string) {
        return ({ detail: newValue }: { detail: any }) => {
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