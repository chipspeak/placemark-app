/* eslint-disable @typescript-eslint/no-explicit-any */
import { dev } from "$app/environment";
import { placemarkService } from "$lib/services/placemark-service";
import { currentSession } from "$lib/stores.js";
import { redirect, error } from "@sveltejs/kit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function load({ request }) {
  return {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  };
}

// The exported actions are used to handle the login process
export const actions = {
  // Login takes the email and password from the form and attempts to log in the user
  login: async ({ request, cookies }: { request: any; cookies: any }) => {
    const form = await request.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    console.log(`attempting to log in email: ${email}`);
    // Outer try block to catch any errors that may occur during the login process
    try {
      // The login method is called from the placemarkService and the returned session is stored in a cookie
      const session = await placemarkService.login(email, password);
      const userJson = JSON.stringify(session);
      cookies.set("placemark-user", userJson, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: !dev,
        maxAge: 60 * 60 * 24 * 7 // one week
      });
      // Any errors that occur during the login process are caught and handled here
    } catch (err: any) {
      console.log("Server Error: ", error);
      // If the error is specific to Firebase, a more specific error message is returned
      if (err.code === "auth/invalid-email") {
        error(404, { message: "Please enter a valid email." });
      } else if (err.code === "auth/invalid-credential") {
        error(404, { message: "Invalid user credentials, please try again." });
      } else if (err.code === "auth/missing-password") {
        error(404, { message: "The password field cannot be left empty." });
      } else {
        // If the error is not specific to Firebase, a generic error message is returned.
        error(404, { message: err.message || "An error occurred. Please check your details and try again." });
      }
    }
    // If the login is successful, the user is redirected to the create page.
    throw redirect(303, "/create");
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSession: async ({ request, cookies }: { request: any; cookies: any }) => {
    const formData = await request.formData();
    const sessionData = formData.get("session");
    const session = JSON.parse(sessionData);
    const userJson = JSON.stringify(session);
    cookies.set("placemark-user", userJson, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: !dev,
      maxAge: 60 * 60 * 24 * 7 // one week
    });
    currentSession.set(session);
    throw redirect(303, "/create");
  }
};
