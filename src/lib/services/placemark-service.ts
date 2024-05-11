/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { Session, User } from "$lib/types/placemark-types";
import type { newPlacemark, Placemark } from "$lib/types/placemark-types";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, OAuthProvider } from "firebase/auth";
import { auth } from "$lib/Firebase/firebase.client";
import { acts } from "@tadashi/svelte-notification";

export const placemarkService = {
  baseUrl: "http://localhost:8010/proxy",

  async signup(email: string, password: string): Promise<boolean> {
    try {
      // Create a new user using Firebase Authentication
      const firebaseResponse = await createUserWithEmailAndPassword(auth, email, password);
      console.log("firebaseResponse: ", firebaseResponse);

      // Check if the firebaseResponse and firebaseResponse.user are valid
      if (!firebaseResponse || !firebaseResponse.user) {
        console.error("Invalid user credential or user is null");
        throw new Error("User creation failed.");
      }

      // Extract the email from the UserCredential object
      const userEmail = firebaseResponse.user.email;

      if (!userEmail) {
        console.error("Invalid user email");
        throw new Error("User email is null.");
      }

      console.log("userEmail: ", userEmail);
      const newUser = {
        email: userEmail
      };
      const response = await axios.post(`${this.baseUrl}/api/users`, newUser);
      console.log("response: ", response);
      return response.status == 201;
    } catch (error) {
      console.error("Error signing up user:", error);
      acts.add({ mode: 'danger', lifetime: '3', message: error });
      throw error;
    }
  },

  async signupViaProvider(providerType: 'google' | 'github' | 'microsoft' ): Promise<boolean> {
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
              throw new Error(`Unsupported provider type: ${providerType}`);
      }
      const firebaseResponse = await signInWithPopup(auth, provider);
      const userEmail = firebaseResponse.user.email;
      console.log("userEmail via google: ", userEmail);
      const signup = await axios.post(`${this.baseUrl}/api/users`, { email: userEmail });
      if (signup.status == 201) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error signing up user:", error);
      acts.add({ mode: 'danger', lifetime: '3', message: error });
      return false;
    }
  },


  async login(email: string, password: string): Promise<Session | null> {
    try {
      const firebaseResponse = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = firebaseResponse.user.email;
      const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, { email: userEmail });
      axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
      console.log("response.data: ", response.data);
      const session: Session = {
        name: response.data.email,
        token: response.data.token,
        _id: response.data._id
      };
      console.log("session token: ", session.token);
      console.log("session id: ", session._id);
      console.log("session name: ", session.name);
      return session;
    } catch (error) {
      console.log("Error: ", error);
      return null;
    }
  },

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
              throw new Error(`Unsupported provider type: ${providerType}`);
      }
      const firebaseResponse = await signInWithPopup(auth, provider);
      const userEmail = firebaseResponse.user.email;
      console.log("userEmail via google: ", userEmail);
      const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, { email: userEmail });
      axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
      console.log("response.data: ", response.data);
      const session: Session = {
        name: response.data.email,
        token: response.data.token,
        _id: response.data._id
      };
      // console.log("session token from placemark service function: ", session.token);
      // console.log("session id from placemark service function:: ", session._id);
      // console.log("session name from placemark service function:: ", session.name);
      return session;
    } catch (error) {
      console.log("Error: ", error);

      return null;
    }
  },

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

  async updatePlacemark(placemark: Placemark, session: Session) {
    try {
      axios.defaults.headers.common["Authorization"] = session.token;
      const formattedPlacemark = await this.formatPlacemarkPayload(placemark);
      const response = await axios.put(`${this.baseUrl + "/api/placemarks/" + placemark._id}`, formattedPlacemark);
      console.log("updating placemark: ", placemark);
      this.getPlacemarkWeather(placemark, session);
      return response.status == 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

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
