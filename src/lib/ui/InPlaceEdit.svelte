<script>
  // @ts-nocheck

  // found here: https://svelte.dev/repl/29c1026dda3c47a187bd21afa0782df1?version=4.2.15

  import { createEventDispatcher, onMount } from "svelte";

  export let value,
    required = true;
  export let isCategoryField = false; // Prop to determine if it's the category field
  export let allowedCategories = []; // Prop to accept an array of allowed categories

  // regex to check for prohibited characters
  const prohibitedCharacters = /[^a-zA-Z0-9\s]/;

  const dispatch = createEventDispatcher();
  let editing = false,
    original;

  onMount(() => {
    original = value;
  });

  function edit() {
    editing = true;
  }

  // Function to submit the edited form of the field. Checks if the value is different from the original value and dispatches the submit event.
  // Checks for prohibited characters and empty fields and displays an error message (via notification component) if found.
  function submit() {
    if (value != original && event.type === "blur") {
      dispatch("submit", value);
    }
    if (value === "" || value === null) {
      value = original;
      return acts.add({ mode: "danger", lifetime: "3", message: "Fields can not be left blank!" });
    }
    if (prohibitedCharacters.test(value)) {
      value = original;
      return acts.add({ mode: "danger", lifetime: "3", message: "Special characters are not allowed!" });
    }

    editing = false;
  }

  // Function to handle the keydown event. If the escape key is pressed, the value is reset to the original value and editing is set to false.
  function keydown(event) {
    if (event.key == "Escape") {
      event.preventDefault();
      value = original;
      editing = false;
    }
  }

  // Function to focus on the input element when editing
  function focus(element) {
    element.focus();
  }
</script>

<!-- The InPlaceEdit component allows users to edit a field in place. -->
{#if editing}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <form on:submit|preventDefault={submit} on:keydown={keydown}>
    {#if isCategoryField}
      <!-- Render a select element when editing the category field -->
      <select bind:value on:blur={submit} use:focus class="input">
        {#each allowedCategories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    {:else}
      <!-- Render an input element for other fields -->
      <input bind:value on:blur={submit} {required} use:focus class="input" />
    {/if}
  </form>
{:else}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="mb-2" on:click={edit}>
    {value}
  </div>
{/if}

<style>
  input {
    border: none;
    background: none;
    font-size: inherit;
    color: inherit;
    font-weight: inherit;
    text-align: inherit;
    box-shadow: none;
    display: inline;
  }
</style>
