/* eslint-disable @typescript-eslint/no-explicit-any */
import { placemarkService } from "$lib/services/placemark-service";
import { calculateCategoryData, calculateCountyData, calculatePlacemarkByUser } from "$lib/utils/placemark-calculations";
import type { PageServerLoad } from "./$types";
import type { Placemark } from "$lib/types/placemark-types";
import { goto } from "$app/navigation";


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
          const weatherData = await placemarkService.getPlacemarkWeather(placemark, session);
          weatherForecastMap[placemark._id] = weatherData;
      } catch (error) {
          console.error(`Failed to fetch weather data for placemark ${placemark._id}:`, error);
      }
  }



    return {
      placemarks,
      weatherForecastMap,
      categoriesTotal: calculateCategoryData(placemarks),
      countiesTotal: calculateCountyData(placemarks),
      placemarksByUser: calculatePlacemarkByUser(placemarks, users)
    };
  }
  if (session === null) {
    goto("/login");
  }
};