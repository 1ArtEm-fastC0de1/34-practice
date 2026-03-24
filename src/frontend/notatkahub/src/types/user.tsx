export interface User {
  username?: string;
  email: string;
  id: string;
  isActivated: boolean;
}

export interface UserValues {
  username?: string;
  email: string;
}
