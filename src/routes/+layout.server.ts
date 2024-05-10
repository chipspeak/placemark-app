import type { Session } from "$lib/types/placemark-types";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ cookies, url }) => {
  const cookieStr = cookies.get("placemark-user") as string;
  if (cookieStr) {
    const session = JSON.parse(cookieStr) as Session;
    // console.log("session from cookie within parent layout server: ", session);
    return {
      session: session,
      url: url.pathname
    };
  }
};

