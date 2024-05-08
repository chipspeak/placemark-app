<script lang="ts">

  import { currentSession, subTitle } from "$lib/stores";
  import Card from "$lib/ui/Card.svelte";
  import PlacemarkList from "$lib/ui/PlacemarkList.svelte";

  export let data: any;
  subTitle.set("View All Placemarks");
  // let placemarks: Placemark[];

</script>

<Card title="All Placemarks">
  <PlacemarkList data={data} columnSize={"is-half"} placemarks={data.placemarks}/>
</Card>
