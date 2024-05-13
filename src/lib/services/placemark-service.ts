/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { Session, User } from "$lib/types/placemark-types";
import type { newPlacemark, Placemark } from "$lib/types/placemark-types";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, OAuthProvider } from "firebase/auth";
import { auth } from "$lib/Firebase/firebase.client";

// Export placemarkService for use in other components where api calls are needed
export const placemarkService = {
  baseUrl: "https://placemark-api-backend.onrender.com",

  // The signup method used to create a placemark user i.e one where the user specifies their email and password
  async signup(email: string, password: string): Promise<boolean> {
    try {
      // Create a new user using Firebase Authentication
      const firebaseResponse = await createUserWithEmailAndPassword(auth, email, password);
      console.log("firebaseResponse: ", firebaseResponse);

      // Extrat the email from the UserCredential object
      const userEmail = firebaseResponse.user.email;
      console.log("userEmail: ", userEmail);
      // Initialize a new user object with the email extracted from the UserCredential object
      const newUser = {
        email: userEmail
      };
      // Post the new user to the backend api
      const response = await axios.post(`${this.baseUrl}/api/users`, newUser);
      console.log("response: ", response);
      // Return a success status
      return response.status == 201;
    } catch (error) {
      // Catching any errors and logging them to the console before throwing the error
      console.error("Error signing up user:", error);
      throw error;
    }
  },

  // The signup method used to create a placemark user via 3rd party authentification providers (google implemented, others remain to be implemented in future versions)
  async signupViaProvider(providerType: 'google' | 'github' | 'microsoft' ): Promise<boolean> {
    try {
      let provider;
      // Switch statement to determine the provider type and initialize the provider object accordingly
      switch (providerType) {
          case 'google':
              provider = new GoogleAuthProvider();
              break;
          case 'github':
              provider = new GithubAuthProvider();
              break;
          case 'microsoft':
              provider = new OAuthProvider('microsoft.com');
              break;
          default:
              throw new Error(`Unsupported provider type: ${providerType}`);
      }
      // Signing in with the provider object vua the firebase sdk pop up method
      const firebaseResponse = await signInWithPopup(auth, provider);
      // Extracting the email from the UserCredential object returned by the firebase sdk
      const userEmail = firebaseResponse.user.email;
      console.log("userEmail via google: ", userEmail);
      // posting this new user to the backend api by passing the email returned by the firebase sdk
      const signup = await axios.post(`${this.baseUrl}/api/users`, { email: userEmail });
      // returning a success status
      if (signup.status == 201) {
        return true;
      }
      // Catching any errors and logging them to the console
      return false;
    } catch (error) {
      console.error("Error signing up user:", error);
      // returning a failure status
      return false;
    }
  },

  // The login method used to authenticate a user via email and password
  async login(email: string, password: string): Promise<Session | null> {
    try {
      // Sign in with email and password via the firebase sdk
      const firebaseResponse = await signInWithEmailAndPassword(auth, email, password);
      // Extract the email from the UserCredential object returned by the firebase sdk
      const userEmail = firebaseResponse.user.email;
      // Post the email to the backend api for verification and token generation
      const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, { email: userEmail });
      axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
      console.log("response.data: ", response.data);
      // Initialize a new session object with the email, token and id extracted from the response object
      const session: Session = {
        name: response.data.email,
        token: response.data.token,
        _id: response.data._id
      };
     // Return the session object
      return session;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },

  // The login method used to authenticate a user via 3rd party authentification providers (google implemented, others remain to be implemented in future versions)
  async loginWithProvider(providerType: 'google' | 'github' | 'microsoft' ): Promise<Session | null> {
    try {
      let provider;
      switch (providerType) {
          case 'google':
              provider = new GoogleAuthProvider();
              break;
          case 'github':
              provider = new GithubAuthProvider();
              break;
          case 'microsoft':
              provider = new OAuthProvider('microsoft.com');
              break;
          default:
              provider = new GoogleAuthProvider();
      }
      // Sign in with the provider object via the firebase sdk pop up method
      const firebaseResponse = await signInWithPopup(auth, provider);
      // Extract the email from the UserCredential object returned by the firebase sdk
      const userEmail = firebaseResponse.user.email;
      console.log("userEmail via google: ", userEmail);
      // Post the email to the backend api for verification and token generation
      const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, { email: userEmail });
      axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
      console.log("response.data: ", response.data);
      // Initialize a new session object with the email, token and id extracted from the response object
      const session: Session = {
        name: response.data.email,
        token: response.data.token,
        _id: response.data._id
      };
      // Return the session object
      return session;
    } catch (error) {
      console.log("Error: ", error);
      return null;
    }
  },

  // Retrieve placemark by passing its id and the session object to the backend api
  async getPlacemarkById(placemarkId: string, session: Session): Promise<Placemark | null> {
    try {
      axios.defaults.headers.common["Authorization"] = session.token;
      const response = await axios.get(this.baseUrl + "/api/placemarks/" + placemarkId);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  // Retrieve all users from the backend api
  async getUsers(session: Session): Promise<User[]> {
    try {
      axios.defaults.headers.common["Authorization"] = session.token;
      const response = await axios.get(this.baseUrl + "/api/users");
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // Create a new placemark by passing the new placemark object and the session object to the backend api
  async createPlacemark(placemark: newPlacemark, session: Session) {
    console.log(placemark);
    try {
      axios.defaults.headers.common["Authorization"] = session.token;
      const response = await axios.post(this.baseUrl + "/api/users/placemarks", placemark);
      if (response.status == 201) {
        return response.data as Placemark;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  // Update a placemark by passing the placemark object and the session object to the backend api
  async updatePlacemark(placemark: Placemark, session: Session) {
    try {
      axios.defaults.headers.common["Authorization"] = session.token;
      // Format the placemark payload before sending it to the backend api (backend expects standard payload minus ids etc)
      const formattedPlacemark = await this.formatPlacemarkPayload(placemark);
      const response = await axios.put(`${this.baseUrl + "/api/placemarks/" + placemark._id}`, formattedPlacemark);
      console.log("updating placemark: ", placemark);
      // Retrieve the updated placemarks weather again after updating it
      this.getPlacemarkWeather(placemark, session);
      return response.status == 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  // Delete an image from cloudinary by passing the image name and the session object to the backend api
  async deleteImageFromCloudinary(image: string, session: Session) {
    try {
      axios.defaults.headers.common["Authorization"] = session.token;
      const response = await axios.delete(`${this.baseUrl}/api/placemarks/deleteImage/${encodeURIComponent(image)}`);
      console.log("deleting image from cloudinary: ", image);
      return response.status == 204;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  // Format the placemark payload before sending it to the backend api (backend expects standard payload minus ids etc)
  async formatPlacemarkPayload(placemark: Placemark) {
    return {
      title: placemark.title,
      description: placemark.description,
      location: placemark.location,
      latitude: placemark.latitude,
      longitude: placemark.longitude,
      category: placemark.category,
      img: placemark.img
    };
  },

  // Retrieve the weather for a placemark by passing the placemark object and the session object to the backend api (retrieved via openweather api)
  async getPlacemarkWeather(placemark: Placemark, session: Session) {
    try {
      axios.defaults.headers.common["Authorization"] = session.token;
      const response = await axios.post(this.baseUrl + "/api/getWeather", placemark);
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  // Retrieve the 5-day forecast for a placemark by passing the placemark object and the session object to the backend api (retrieved via openweather api)
  async getPlacemarkForecast(placemark: Placemark, session: Session) {
    try {
      axios.defaults.headers.common["Authorization"] = session.token;
      const response = await axios.post(this.baseUrl + "/api/getWeatherForecast", placemark);
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  // Retrieve all placemarks by passing the session object to the backend api
  async getPlacemarks(session: Session): Promise<Placemark[]> {
    try {
      console.log("session token: ", session.token);
      axios.defaults.headers.common["Authorization"] = session.token;
      const response = await axios.get(this.baseUrl + "/api/placemarks");
      return response.data;
    } catch (error) {
      return [];
    }
  },

  // Delete a placemark by passing the placemark id and the session object to the backend api
  async deletePlacemark(placemarkId: string, session: Session): Promise<boolean> {
    try {
      axios.defaults.headers.common["Authorization"] = session.token;
      const response = await axios.delete(this.baseUrl + "/api/placemarks/" + placemarkId);
      return response.status == 204;
    } catch (error) {
      console.log(placemarkId);
      console.error(error);
      return false;
    }
  }
};
