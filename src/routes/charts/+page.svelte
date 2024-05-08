<script lang="ts">
  // @ts-ignore
  import Chart from "svelte-frappe-charts";
  import Card from "$lib/ui/Card.svelte";
  import { subTitle } from "$lib/stores";
  import type { DataSet } from "$lib/types/placemark-types";
  import type { Placemark } from "$lib/types/placemark-types";
  import { onMount } from "svelte";

  subTitle.set("Charts");

  export let data: any;

  let placemarks: Placemark[] = [];
  let weatherForecastMap: Record<string, any> = {};


  let selectedPlacemarkId: string;
  let selectedDataType: 'temperature' | 'wind' | 'pressure' = 'temperature';


  let trendData: DataSet = {
    labels: [],
    datasets: [{ values: [] }],
  };

  function handlePlacemarkChange() {
    const placemark = placemarks.find(pm => pm._id === selectedPlacemarkId);
    if (placemark) {
      updateTrendData(placemark, selectedDataType);
    } else {
      resetTrendData();
    }
  }


  function handleDataTypeChange() {
    const placemark = placemarks.find(pm => pm._id === selectedPlacemarkId);
    if (placemark) {
      updateTrendData(placemark, selectedDataType);
    } else {
      resetTrendData();
    }
  }

  function updateTrendData(placemark: Placemark, dataType: 'temperature' | 'wind' | 'pressure'): void {
    const weatherData = weatherForecastMap[placemark._id];
    if (!weatherData || !weatherData.list) {
      resetTrendData();
      return;
    }

    const filteredEntries = weatherData.list.filter((entry: { dt_txt: string; }) => {
      const time = new Date(entry.dt_txt).getHours();
      return time === 12 || time === 21;
    });


    const labels = filteredEntries.map((entry: { dt_txt: string; }) => entry.dt_txt);
    let values: number[];

    switch (dataType) {
      case 'temperature':
        values = filteredEntries.map((entry: { main: { temp: number; }; }) => entry.main.temp);
        break;
      case 'wind':
        values = filteredEntries.map((entry: { wind: { speed: number; }; }) => entry.wind.speed);
        break;
      case 'pressure':
        values = filteredEntries.map((entry: { main: { pressure: number; }; }) => entry.main.pressure);
        break;
      default:
        values = [];
    }

    trendData = {
      labels,
      datasets: [{
        values
      }]
    };
  }


  function resetTrendData(): void {
    trendData = {
      labels: [],
      datasets: [{ values: [] }],
    };
  }

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
  <Card title="Charts">
    <!-- Dropdown for selecting a placemark -->
    <Card title="Forecasted Conditions">
      <div class="chart-controls" style="text-align: right;">
        <div class="select is-success mr-3">
          <select id="placemarkSelect" bind:value={selectedPlacemarkId} on:change={handlePlacemarkChange}>
            {#each placemarks as placemark}
              <option value={placemark._id}>{placemark.title}</option>
            {/each}
          </select>
        </div>

      <!-- Dropdown for selecting data type (temperature, wind, or pressure) -->
        <div class="select is-success">
          <select id="dataTypeSelect" bind:value={selectedDataType} on:change={handleDataTypeChange}>
            <option value="temperature">Temperature °C</option>
            <option value="wind">Wind Speed km/h</option>
            <option value="pressure">Pressure hPa</option>
          </select>
        </div>
      </div>

      <!-- Chart for the trend data -->
      <Chart data={trendData} type="line" />
    </Card>

    <!-- Charts for category and county counts of placemarks -->
    <div class="columns">
      <div class="column has-text-centered">
        <Card title="Number of Placemarks per County">
          <Chart data={data.countiesTotal} type="pie" />
        </Card>
      </div>
      <div class="column has-text-centered">
        <Card title="Number of Placemarks per Category">
          <Chart data={data.categoriesTotal} type="bar" />
        </Card>
      </div>
    </div>
  </Card>
</div>
