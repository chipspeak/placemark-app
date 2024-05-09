/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { Session, User } from "$lib/types/placemark-types";
import type { newPlacemark, Placemark } from "$lib/types/placemark-types";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "$lib/Firebase/firebase.client";
// import { signInWithEmailAndPassword } from "firebase/auth";

export const placemarkService = {
  baseUrl: "http://localhost:8010/proxy",

  async signup(user: User): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users`, user);
      return response.status == 201;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  async signupViaFirebase(email: string, password: string): Promise<boolean> {
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
      const response = await axios.post(`${this.baseUrl}/api/users/createViaFirebase`, newUser );
      console.log("response: ", response);
      return response.status == 201;

    } catch (error) {
      console.error("Error signing up user:", error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<Session | null> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, { email, password });
      if (response.data.success) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
        console.log("response.data: ", response.data);

        // console.log("response.data: ", response.data);
        const session: Session = {
          name: response.data.email,
          token: response.data.token,
          _id: response.data._id
        };
        console.log("session token: ", session.token);
        console.log("session id: ", session._id);
        console.log("session name: ", session.name);
        return session;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async loginViaFirebase(email: string, password: string): Promise<Session | null> {
    try {
      const firebaseResponse = await signInWithEmailAndPassword(auth, email, password);
      // console.log("firebaseResponse: ", firebaseResponse);
      const userEmail = firebaseResponse.user.email;
      console.log("userEmail: ", userEmail);
      const response = await axios.post(`${this.baseUrl}/api/users/authenticateViaFirebase`, { email: userEmail });
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
        console.log("response.data: ", response.data);

        // console.log("response.data: ", response.data);
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
        // Check if the error is an instance of FirebaseAuthError
        if ((error as any).code) {
            // Handle different error codes as needed
            switch ((error as any).code) {
              case 'auth/user-not-found':
                console.error("No user found with the provided email.");
                break;
              case 'auth/invalid-credential':
                console.error("Incorrect password provided.");
                break;
              case 'auth/invalid-email':
                console.error("Invalid email format.");
                break;
              // Add more cases as needed for other Firebase auth error codes
              default:
                console.error("An unknown error occurred during Firebase login.");
                break;
            }
        } else {
            console.error("An unknown error occurred during Firebase login.");
        }
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
        img: placemark.img,
    }
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
  },
};
