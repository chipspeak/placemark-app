import axios from "axios";
import type { Session, User } from "$lib/types/placemark-types";
import type { newPlacemark, Placemark } from "$lib/types/placemark-types";


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

  async login(email: string, password: string): Promise<Session | null> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, { email, password });
      if (response.data.success) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;

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
      axios.defaults.headers.common["Authorization"] = session.token;
      const response = await axios.get(this.baseUrl + "/api/placemarks");
      return response.data;
    } catch (error) {
      console.error(error);
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
