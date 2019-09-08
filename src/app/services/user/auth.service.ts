import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  // Logins user via email / password
  loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  // sign up user via email and password and saves to firebase db
  signupUser(email: string, password: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password).then((newUserCredential: firebase.auth.UserCredential) => {
        firebase
          .firestore()
          .doc(`/userProfile/${newUserCredential.user.uid}`)
          .set({ email });
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }

  // Sends email to user for resetting password
  resetPassword(email:string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email); 
  }

  // logs out user
  logoutUser():Promise<void> { 
    return firebase.auth().signOut();
  }
   
}
