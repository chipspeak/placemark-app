import type { Session } from "$lib/types/placemark-types";
import type { LayoutServerLoad } from "./$types";

// Server Layout page (governs all pages)
export const load: LayoutServerLoad = ({ cookies, url }) => {
  const cookieStr = cookies.get("placemark-user") as string;
  if (cookieStr) {
    const session = JSON.parse(cookieStr) as Session;
    return {
      session: session,
      // Return URL for use with page transitions
      url: url.pathname
    };
  }
};

