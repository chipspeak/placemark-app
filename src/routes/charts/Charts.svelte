<script lang="ts">
	  // @ts-ignore
	import Chart from "svelte-frappe-charts";

	let categoriesTotal = {
		labels: [""],
		datasets: [
			{
				values: [0, 0],
			},
		],
	};

</script>

<div class="columns">
  <div class="column has-text-centered">
    <h1 class="title is-4">Categories by number of Placemarks</h1>
    <Chart data={categoriesTotal} type="bar" />
  </div>
</div>
