export interface Session {
  name: string;
  _id: string;
  token: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  _id?: string;
}

export interface firebaseUser {
  firstName: string;
  lastName: string;
  email: string;
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

export interface Placemark extends newPlacemark {
  _id: string;
  userId: string;
}

export interface DataSet {
  labels: string[];
  datasets: [{ values: number[] }];
}



