// import { placemarkService } from "$lib/services/placemark-service";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

// Disabling server side rendering to accomidate leaflet
export const ssr = false;

export const load: PageServerLoad = async ({ parent }) => {
  const { session } = await parent();
  if (session) {
    return {
      // placemarks: await placemarkService.getPlacemarks(session)
    };
  }
  else {
    // Prevent the page being accessed when a session is not active
    throw redirect(303, "/login");
  }
};