import * as firebase from 'firebase';
import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Environment } from '@ionic-native/google-maps';

const {SplashScreen, StatusBar} = Plugins;
export const firebaseConfig = {
  apiKey: 'AIzaSyDMJWtz_UTtpfUx5hjVVpy7tBlHqEGzr1o',
  authDomain: 'ionicdatabase-e1f0b.firebaseapp.com',
  databaseURL: 'https://ionicdatabase-e1f0b.firebaseio.com',
  projectId: 'ionicdatabase-e1f0b',
  storageBucket: 'ionicdatabase-e1f0b.appspot.com',
  messagingSenderId: '17517786054',
  appId: '1:17517786054:web:5a1be94c07e0513c'
};
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor() {
    this.initializeApp();
    firebase.initializeApp(firebaseConfig);
  }

  initializeApp() {
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyDMJWtz_UTtpfUx5hjVVpy7tBlHqEGzr1o',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyDMJWtz_UTtpfUx5hjVVpy7tBlHqEGzr1o'
    });
    SplashScreen.hide().catch(error => {
      console.error(error);
    });

    StatusBar.hide().catch(error => {
      console.error(error);
    })
  }
}
