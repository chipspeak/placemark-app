export const load = async ({ cookies }) => {
  // Clear the session cookie upon logout
    cookies.delete("placemark-user", { path: "/" });
  };