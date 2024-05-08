/* eslint-disable @typescript-eslint/no-explicit-any */
import { placemarkService } from "$lib/services/placemark-service";
import type { PageServerLoad } from "./$types";
import type { Placemark } from "$lib/types/placemark-types";

export const load: PageServerLoad = async ({ parent }) => {
    const { session } = await parent();

    if(session) {
    // Fetch placemarks
    const placemarks: Placemark[] = await placemarkService.getPlacemarks(session);
    
    // Initialize weather data map
    const weatherDataMap: Record<string, any> = {};
    
    // Fetch weather data for each placemark
    for (const placemark of placemarks) {
        try {
            const weatherData = await placemarkService.getPlacemarkWeather(placemark, session);
            weatherDataMap[placemark._id] = weatherData;
        } catch (error) {
            console.error(`Failed to fetch weather data for placemark ${placemark._id}:`, error);
        }
    }
    
    // Return the fetched data
    return {
        placemarks,
        weatherDataMap,
        collapseState: placemarks.reduce((acc, p) => {
            acc[p._id] = false;
            return acc;
        }, {} as Record<string, boolean>),
        photoCollapse: placemarks.reduce((acc, p) => {
            acc[`photo-${p._id}`] = false;
            return acc;
        }, {} as Record<string, boolean>),
        editState: placemarks.reduce((acc, p) => {
            acc[p._id] = { ...p };
            return acc;
        }, {} as Record<string, Placemark>),
        currentImageIndex: placemarks.reduce((acc, p) => {
            acc[p._id] = 0;
            return acc;
        }, {} as Record<string, number>),
    };
};
}
