/* eslint-disable @typescript-eslint/no-explicit-any */
import { placemarkService } from "$lib/services/placemark-service";
import { calculateCategoryData, calculateCountyData, calculatePlacemarkByUser } from "$lib/utils/placemark-calculations";
import type { PageServerLoad } from "./$types";
import type { Placemark } from "$lib/types/placemark-types";
import { redirect } from "@sveltejs/kit";

// Server Page
export const load: PageServerLoad = async ({ parent }) => {
  const { session } = await parent();

  if(session) {
  // Fetch placemarks
  const placemarks: Placemark[] = await placemarkService.getPlacemarks(session);
  const users = await placemarkService.getUsers(session);
  
  // Initialize weather data map
  const weatherForecastMap: Record<string, any> = {};
  
  // Fetch weather data for each placemark
    for (const placemark of placemarks) {
        try {
            const weatherData = await placemarkService.getPlacemarkForecast(placemark, session);
            weatherForecastMap[placemark._id] = weatherData;
            console.log("weatherData from server: ", weatherForecastMap);
        } catch (error) {
            console.error(`Failed to fetch weather data for placemark ${placemark._id}:`, error);
        }
      }
      // Return the placemarks and weather data for use client side
      return {
        placemarks,
        weatherForecastMap,
        categoriesTotal: calculateCategoryData(placemarks),
        countiesTotal: calculateCountyData(placemarks),
        placemarksByUser: calculatePlacemarkByUser(placemarks, users)
      };
  } else {
      throw redirect(303, "/login");
  }
};