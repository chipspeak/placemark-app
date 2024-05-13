// Session object type
export interface Session {
  name: string;
  _id: string;
  token: string;
}

// Firebase user object type (no password etc)
export interface FirebaseUser {
  email: string;
  password: string;
}

// User object type(deprecated, replaced by FirebaseUser)
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  _id?: string;
}

export interface newPlacemark {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  category: string;
  img?: string[];
}

// Placemark object type (extends newPlacemark which is just core params)
export interface Placemark extends newPlacemark {
  _id: string;
  userId: string;
}

// Dataset object for use with Frappe charts
export interface DataSet {
  labels: string[];
  datasets: [{ values: number[] }];
}



