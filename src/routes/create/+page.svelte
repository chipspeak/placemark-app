<script lang="ts">
  // @ts-ignore
  import Chart from "svelte-frappe-charts";
  import { currentSession, latestPlacemark, subTitle } from "$lib/stores";
  import PlacemarkForm from "./PlacemarkForm.svelte";
  import Card from "$lib/ui/Card.svelte";
  import LeafletMap from "$lib/ui/LeafletMap.svelte";
  import { placemarkService } from "$lib/services/placemark-service";
  import { onMount } from "svelte";
  import type { Placemark, DataSet } from "$lib/types/placemark-types";
  import { calculateCategoryData, calculateCountyData } from "$lib/utils/placemark-calculations";

  // Declare variables
  let placemarks: Placemark[] = [];
  let categoriesTotal: DataSet;
  let countiesTotal: DataSet;
  let map: LeafletMap;
  let chartData: DataSet;
  let chartType: string;
  let selectedDataset: "category" | "county" = "category";

  // Set the subtitle for the page
  subTitle.set("Create Placemarks");

	// Fetch data from various functions on page mount and add placemarks to the map in addition to updating the chart data
  onMount(async () => {
    placemarks = await placemarkService.getPlacemarks($currentSession);
    categoriesTotal = calculateCategoryData(placemarks);
    countiesTotal = calculateCountyData(placemarks);
    chartType = "bar";
    selectedDataset = "category";
    chartData = categoriesTotal;
    console.log("Current session: " + $currentSession.name);
    placemarks.forEach((placemark: Placemark) => {
      const popup = `
            <Card/>
            <h1><strong>${placemark.title}</strong></h1>
            <br>
            <img src='${placemark.img[0]}' alt='Placemark Image' style='width: 100%; height: auto;'>
        `;
      map.addMarker(placemark.latitude, placemark.longitude, popup, placemark.category);
    });
		// Move the map to the most recent placemark
    const mostRecentPlacemark = placemarks[placemarks.length - 1];
    if (mostRecentPlacemark) {
      map.moveTo(mostRecentPlacemark.latitude, mostRecentPlacemark.longitude);
    }
  });

  // Subscribe to the latestPlacemark store to get the most recent placemark and update the map and chart data
  latestPlacemark.subscribe(async (createPlacemark) => {
    if (createPlacemark) {
      placemarks.push(createPlacemark);
      categoriesTotal = calculateCategoryData(placemarks);
      countiesTotal = calculateCountyData(placemarks);
      updateChartData();
      placemarks = [...placemarks];
      placemarks.forEach((placemark: Placemark) => {
        const popup = `
            <Card/>
            <h1><strong>${placemark.title}</strong></h1>
            <br>
            <img src='${placemark.img[0]}' alt='Placemark Image' style='width: 100%; height: auto;'>
            <br>
            <p>${placemark.description}</p>
        `;
        map.addMarker(placemark.latitude, placemark.longitude, popup, placemark.category);
      });
      const mostRecentPlacemark = placemarks[placemarks.length - 1];
      console.log("most recent placemark: " + mostRecentPlacemark.title);
      if (mostRecentPlacemark) {
        map.moveTo(mostRecentPlacemark.latitude, mostRecentPlacemark.longitude);
      }
    }
  });


	// Function to update the chart data based on the selected dataset
  function updateChartData() {
    if (selectedDataset === "category") {
      // console.log("Updating chart data for category");
      chartData = calculateCategoryData(placemarks);
    } else if (selectedDataset === "county") {
      // console.log("Updating chart data for county");
      chartData = calculateCountyData(placemarks);
    }
  }


	// Function to change the chart type based on the selected type
  function changeChartType(type: string) {
    console.log(`Changing chart type to: ${type}`);
    chartType = type;
  }


	// Function to change the dataset based on the selected dataset
  function changeDataset(dataset: "category" | "county") {
    selectedDataset = dataset;
    updateChartData();
  }
</script>

<div class="columns">
  <div class="column">
    <Card title="Placemark Locations" icon="fa-map">
      <LeafletMap height={50} addCategories={true} bind:this={map} />
    </Card>
    <Card title="Placemark Charts" icon="fa-calculator">
      <span slot="header-extra" class="is-flex is-align-items-center">
        <!-- Dropdown for selecting a placemark -->
        <!-- Chart Type Dropdown -->
        <div class="select is-small mr-3">
          <select id="chartType" bind:value={chartType} on:change={() => changeChartType(chartType)}>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            <option value="percentage">Percentage</option>
          </select>
        </div>

        <!-- Dataset Dropdown -->
        <div class="select is-small">
          <select id="dataset" bind:value={selectedDataset} on:change={() => changeDataset(selectedDataset)}>
            <option value="category">Category</option>
            <option value="county">County</option>
          </select>
        </div>
      </span>

      <!-- Conditional rendering of the chart based on chartType -->
      {#if chartType === "bar"}
        <Chart data={chartData} type="bar" />
      {/if}
      {#if chartType === "pie"}
        <Chart data={chartData} type="pie" />
      {/if}
      {#if chartType === "percentage"}
        <Chart data={chartData} type="percentage" />
      {/if}
    </Card>
  </div>
  <div class="column is-one-third">
    <Card title="Create a new Placemark" icon="fa-plus">
      <PlacemarkForm />
    </Card>
  </div>
</div>
