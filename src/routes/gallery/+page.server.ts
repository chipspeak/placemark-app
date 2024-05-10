import { placemarkService } from "$lib/services/placemark-service";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { session } = await parent();
  if (session) {
    return {
      placemarks: await placemarkService.getPlacemarks(session)
    };
  } else {
    throw redirect(303, "/login");
  }
};