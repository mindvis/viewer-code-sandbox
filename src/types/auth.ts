import { ReactElement } from 'react';

// third-party
import firebase from 'firebase/compat/app';

// ==============================|| TYPES - AUTH  ||============================== //

export type GuardProps = {
  children: ReactElement | null;
};

export type UserProfile = {
  id?: string;
  email?: string;
  avatar?: string;
  image?: string;
  name?: string;
  role?: string;
  tier?: string;
};

export interface AuthProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null;
  token?: string | null;
}

export interface AuthActionProps {
  type: string;
  payload?: AuthProps;
}

export type FirebaseContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  logout: () => Promise<void>;
  login: () => void;
  firebaseRegister: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  firebaseEmailPasswordSignIn: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
  firebaseGoogleSignIn: () => Promise<firebase.auth.UserCredential>;
  firebaseTwitterSignIn: () => Promise<firebase.auth.UserCredential>;
  firebaseFacebookSignIn: () => Promise<firebase.auth.UserCredential>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
};

export type AWSCognitoContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<unknown>;
  resetPassword: (verificationCode: string, newPassword: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
};

export interface InitialLoginContextProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
}

export interface JWTDataProps {
  userId: string;
}

export type JWTContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  addModel: (name: string, description: string, tags: any, file: string, thumbnail: string) => Promise<void>;
  updateModel: (modelId:string, name: string, description: string, tags: any, file: string, thumbnail: string) => Promise<void>;
  updateUser: (name: string, email: string, designation: string, phone: any, phone_ext: string) => Promise<void>;
  createUser: (name: string, email: string, designation: string, phone: any, phone_ext: string, role: string, password: string, confirm: string) => Promise<void>;
  userUpdate: (id:string, name: string, email: string, designation: string, phone: any, phone_ext: string, role: string, password: string, confirm: string) => Promise<void>;
  changePassword: (old: string, password: string, confirm: string) => Promise<void>;
  getModels: () => Promise<void>;
  retrieveServiceToken: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
};

export type Auth0ContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  logout: () => void;
  login: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
};
