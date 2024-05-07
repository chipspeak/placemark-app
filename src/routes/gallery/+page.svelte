<script lang="ts">
    import Card from "$lib/ui/Card.svelte";
    import Gallery from "./Gallery.svelte";

    export let data: any;
</script>
    
<!-- Gallery of placemark images -->
<div>
    <Card title="Gallery">
    <Gallery placemarks={data.placemarks}/>
    </Card> 
</div>
    