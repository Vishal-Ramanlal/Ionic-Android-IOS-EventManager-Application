import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {LoadingController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  public currentUser: firebase.User;
  public eventListRef: firebase.firestore.CollectionReference;
  private isLoading = false;
  constructor(public loadingController: LoadingController) {
    this.present();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.eventListRef = firebase
          .firestore()
          .collection(`/userProfile/${user.uid}/eventList`);
      }
    });
    this.currentUser = firebase.auth().currentUser;
    this.eventListRef = firebase.firestore().collection(`/userProfile/${this.currentUser}/eventList`);
    this.dismiss();
  }
  createEvent(
    eventName: string,
    eventDescription: string,
    evstartTime: string,
    evendTime: string,
    evLat: number,
    evLng: number
  ): Promise<firebase.firestore.DocumentReference> {
    return this.eventListRef.add({
      name: eventName,
      description: eventDescription,
      startTime: evstartTime,
      endTime: evendTime,
      eventLat: evLat,
      eventLng: evLng
    });
  }

  updateDescription(eventId: string, description: string) {
      return this.eventListRef.doc(eventId).update({ description });
  }
  updateStartTime(eventId: string, startTime: string) {
    return this.eventListRef.doc(eventId).update({ startTime });
  }
  updateEndTime(eventId: string, endTime: string) {
    return this.eventListRef.doc(eventId).update({ endTime });
  }
  updateLat(eventId: string, eventLat: number) {
    console.log(eventLat);
    return this.eventListRef.doc(eventId).update({ eventLat });
  }
  updateLng(eventId: string, eventLng: number) {
    console.log(eventLng);
    return this.eventListRef.doc(eventId).update({ eventLng });
  }
  deleteItem(eventId: string) {
    return new Promise<any>((resolve, reject) => {
      this.eventListRef.doc(eventId).delete().then(
          r => resolve(r),
          err => reject(err)
      );
    });
  }
  getEventList(): firebase.firestore.CollectionReference {
    return this.eventListRef;
  }

  getEventDetail(eventId: string): firebase.firestore.DocumentReference {
    return this.eventListRef.doc(eventId);
  }

  async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      duration: 5000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => console.log('dismissed'));
  }
}
