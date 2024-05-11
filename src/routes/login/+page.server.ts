import { dev } from "$app/environment";
import { placemarkService } from "$lib/services/placemark-service";
import { currentSession } from "$lib/stores.js";
import { redirect } from "@sveltejs/kit";

export const ssr = false;

export const actions = {
  login: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    if (!email || !password) {
      throw redirect(303, "/login");
    } else {
      console.log(`attempting to log in email: ${email}`);
      const session = await placemarkService.login(email, password);
      if (session) {
        const userJson = JSON.stringify(session);
        cookies.set("placemark-user", userJson, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: !dev,
          maxAge: 60 * 60 * 24 * 7 // one week
        });
        throw redirect(303, "/create");
      } else {
        throw redirect(303, "/");
      }
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSession: async ({ request, cookies }: { request: any; cookies: any }) => {
    const formData = await request.formData();
    
    // console.log("formData prior to reformat: ", formData);
    const sessionData = formData.get("session");
    // console.log("sessionData: ", sessionData);
    const session = JSON.parse(sessionData);
    // console.log("session after JSON parse: ", session);
    // console.log("Received session data from client.");
    const userJson = JSON.stringify(session);
    cookies.set("placemark-user", userJson, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: !dev,
      maxAge: 60 * 60 * 24 * 7 // one week
    });
    // console.log("session prior to redirect: ", session);
    // console.log("Set user cookie.");
    // console.log("Redirecting to /create");

    currentSession.set(session);

    throw redirect(303, "/create");
  }
};
