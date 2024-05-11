import { writable } from "svelte/store";
import type { Placemark, Session } from "$lib/types/placemark-types";

export const currentSession = writable<Session>();
export const subTitle = writable<string>();
export const latestPlacemark = writable<Placemark>();
export const placemarkStore = writable<Placemark[]>([]);
export const chartType = writable<string>();
export const themeStore = writable<string>("light"); 
export const columnSizeStore = writable<string>("is-half"); 
export const cardColumnSizeStore = writable<string>("is-half"); 
export const placemarkDisplayStore = writable<string>("all");