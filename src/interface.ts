export interface Artist {
  id: string;
  name: string;
  popularity: number;
  followers: number;
  price: number;
  currencyStyle: string;
  votes: number;
  votedBy: User[];
  genres: string[];
  images: object[];
  externalUrls: string;
}

export interface User {
  uid: any;
  displayName: any;
  email: any;
  photoURL: any;
}
