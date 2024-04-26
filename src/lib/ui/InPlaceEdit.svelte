<script>
// @ts-nocheck

// found here: https://svelte.dev/repl/29c1026dda3c47a187bd21afa0782df1?version=4.2.15

    import { createEventDispatcher, onMount } from 'svelte'
  
    export let value, required = true
    export let isCategoryField = false; // Prop to determine if it's the category field
    export let allowedCategories = []; // Prop to accept an array of allowed categories
  
    const dispatch = createEventDispatcher()
    let editing = false, original
  
    onMount(() => {
      original = value
    })
  
    function edit() {
      editing = true
    }
  
    function submit() {
          if (value != original) {
              dispatch('submit', value)
          }
          
      editing = false
    }
  
    function keydown(event) {
      if (event.key == 'Escape') {
        event.preventDefault()
        value = original
        editing = false
      }
    }
      
      function focus(element) {
          element.focus()
      }
  </script>
  
  {#if editing}
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <form on:submit|preventDefault={submit} on:keydown={keydown}>
    {#if isCategoryField}
      <!-- Render a select element when editing the category field -->
      <select bind:value={value} on:blur={submit} use:focus class="input">
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
  <div on:click={edit}>
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
  