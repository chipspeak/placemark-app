import { placemarkService } from "$lib/services/placemark-service";
import { calculateCategoryData } from "$lib/utils/placemark-calculations";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { session } = await parent();
  if (session) {
    const placemarks = await placemarkService.getPlacemarks(session);
    return {
      categoriesTotal: calculateCategoryData(placemarks)
    };
  }
};