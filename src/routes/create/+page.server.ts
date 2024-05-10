import { placemarkService } from "$lib/services/placemark-service";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const ssr = false;

export const load: PageServerLoad = async ({ parent }) => {
  const { session } = await parent();
  if (session) {
    return {
      placemarks: await placemarkService.getPlacemarks(session)
    };
  }
  else {
    throw redirect(303, "/login");
  }
};