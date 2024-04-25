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

export interface newPlacemark {
  title: string;
  description: string;
  location: string;
  latitude: string;
  longitude: string;
  category: string;
  img?: string;
}

export interface Placemark extends newPlacemark {
  _id: string;
  userId: string;
}


