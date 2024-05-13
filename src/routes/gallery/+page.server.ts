import { placemarkService } from "$lib/services/placemark-service";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// Server Page
export const load: PageServerLoad = async ({ parent }) => {
  const { session } = await parent();
  if (session) {
    return {
      // Placemarks are retrieved and prepared for the client side
      placemarks: await placemarkService.getPlacemarks(session)
    };
  } else {
    throw redirect(303, "/login");
  }
};