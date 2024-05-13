<script lang="ts">
  // @ts-ignore
  import Chart from "svelte-frappe-charts";
  import Card from "$lib/ui/Card.svelte";
  import { subTitle } from "$lib/stores";
  import type { DataSet } from "$lib/types/placemark-types";
  import type { Placemark } from "$lib/types/placemark-types";
  import { onMount } from "svelte";

  // Set the subtitle for the page
  subTitle.set("Charts");

  // The data prop is passed from the server
  export let data: any;

  let placemarks: Placemark[] = [];
  let weatherForecastMap: Record<string, any> = {};
  let selectedPlacemarkId: string;
  let selectedDataType: "temperature" | "wind" | "pressure" = "temperature";
  let trendData: DataSet = {
    labels: [],
    datasets: [{ values: [] }]
  };

  // Function to handle the change of the selected placemark
  function handlePlacemarkChange() {
    const placemark = placemarks.find((pm) => pm._id === selectedPlacemarkId);
    if (placemark) {
      // Update the trend data
      updateTrendData(placemark, selectedDataType);
    } else {
      resetTrendData();
    }
  }

  // Function to handle the change of the selected data type
  function handleDataTypeChange() {
    const placemark = placemarks.find((pm) => pm._id === selectedPlacemarkId);
    if (placemark) {
      // Update the trend data
      updateTrendData(placemark, selectedDataType);
    } else {
      resetTrendData();
    }
  }

  // Function to update the trend data based on the selected placemark and data type
  function updateTrendData(placemark: Placemark, dataType: "temperature" | "wind" | "pressure"): void {
    const weatherData = weatherForecastMap[placemark._id];
    if (!weatherData || !weatherData.list) {
      resetTrendData();
      return;
    }

    // Filter the weather data to only include entries at 12:00 and 21:00 (thus allowing 10 entries over the 5 days)
    const filteredEntries = weatherData.list.filter((entry: { dt_txt: string }) => {
      const time = new Date(entry.dt_txt).getHours();
      return time === 12 || time === 21;
    });

    // Extract the labels and values based on the selected data type
    const labels = filteredEntries.map((entry: { dt_txt: string }) => entry.dt_txt);
    let values: number[];

    // Switch statement to determine the values based on the selected data type (thus allowing user to select their chosen forecast)
    switch (dataType) {
      case "temperature":
        values = filteredEntries.map((entry: { main: { temp: number } }) => entry.main.temp);
        break;
      case "wind":
        values = filteredEntries.map((entry: { wind: { speed: number } }) => entry.wind.speed);
        break;
      case "pressure":
        values = filteredEntries.map((entry: { main: { pressure: number } }) => entry.main.pressure);
        break;
      default:
        values = [];
    }

    // Update the trend data
    trendData = {
      labels,
      datasets: [
        {
          values
        }
      ]
    };
  }

  // Function to reset the trend data
  function resetTrendData(): void {
    trendData = {
      labels: [],
      datasets: [{ values: [] }]
    };
  }

  // On mount, set the placemarks, selected placemark, and weather forecast map
  onMount(async () => {
    placemarks = data.placemarks;
    selectedPlacemarkId = placemarks[0]._id;
    weatherForecastMap = data.weatherForecastMap;

    if (placemarks.length > 0) {
      selectedPlacemarkId = placemarks[0]._id;
      const defaultPlacemark = placemarks[0];
      updateTrendData(defaultPlacemark, selectedDataType);
    }
  });
</script>

<div>
  <Card title="Charts" icon="fa-calculator">
    <Card title="5-day Forecast" icon="fa-sun">
      <!-- Inject the select dropdowns into the header-extra slot -->
      <span slot="header-extra" class="is-flex is-align-items-center">
        <!-- Dropdown for selecting a placemark -->
        <span class="select is-small mr-3">
          <select bind:value={selectedPlacemarkId} on:change={handlePlacemarkChange}>
            {#each placemarks as placemark}
              <option value={placemark._id}>{placemark.title}</option>
            {/each}
          </select>
        </span>
        <!-- Dropdown for selecting data type (temperature, wind, or pressure) -->
        <span class="select is-small">
          <select bind:value={selectedDataType} on:change={handleDataTypeChange}>
            <option value="temperature">Temperature °C</option>
            <option value="wind">Wind Speed km/h</option>
            <option value="pressure">Pressure hPa</option>
          </select>
        </span>
      </span>
      <!-- Chart for the trend data -->
      <Chart data={trendData} type="line" />
    </Card>
    <!-- Charts for category and county counts of placemarks -->
    <div class="columns">
      <div class="column has-text-centered">
        <Card title="Number of Placemarks per County" icon="fa-map">
          <Chart data={data.countiesTotal} type="pie" />
        </Card>
      </div>
      <div class="column has-text-centered">
        <Card title="Number of Placemarks per Category" icon="fa-list">
          <Chart data={data.categoriesTotal} type="bar" />
        </Card>
      </div>
    </div>
  </Card>
</div>
