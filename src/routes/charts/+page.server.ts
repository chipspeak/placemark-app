import { placemarkService } from "$lib/services/placemark-service";
import { calculateCategoryData, calculateCountyData, calculatePlacemarkByUser } from "$lib/utils/placemark-calculations";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { session } = await parent();
  if (session) {
    const placemarks = await placemarkService.getPlacemarks(session);
    const users = await placemarkService.getUsers(session);
    return {
      categoriesTotal: calculateCategoryData(placemarks),
      countiesTotal: calculateCountyData(placemarks),
      placemarksByUser: calculatePlacemarkByUser(placemarks, users)
    };
  }
};