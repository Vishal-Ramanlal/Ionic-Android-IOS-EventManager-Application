import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {CalendarComponent} from 'ionic2-calendar/calendar';
import {AlertController, LoadingController} from '@ionic/angular';
import {formatDate} from '@angular/common';
import { EventService } from '../../services/event/event.service';

import { CalendarComponentOptions } from 'ion2-calendar';

@Component({
  selector: 'app-calandar',
  templateUrl: './calandar.page.html',
  styleUrls: ['./calandar.page.scss'],
})
export class CalandarPage implements OnInit {


  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };
  minDate = new Date().toISOString();

  eventSource = [];
  viewTitle;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string, private eventService: EventService, public loadingCtrl: LoadingController) { }

  ngOnInit() {
   // this.resetEvent();
  }

  ionViewWillEnter() {
    this.eventSource = [];
      this.getData();
  }
  async getData() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.eventService
        .getEventList()
        .get()
        .then(eventListSnapshot => {
          this.eventSource = [];
          eventListSnapshot.forEach(snap => {
            this.eventSource.push({
              id: snap.id,
              title: snap.data().name,
              desc: snap.data().description,
              startTime: new Date(snap.data().startTime),
              endTime: new Date( snap.data().endTime),
              allDay: false
            });
            return false;
          });
          loading.dismiss();
        });


  }
  async presentLoading(loading) {
    return await loading.present();
  }

  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }
  // Change current month/week/day
  next() {
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }

  back() {
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

// Change between month/week/day
  changeMode(mode) {
    this.calendar.mode = mode;
  }

// Focus today
  today() {
    this.calendar.currentDate = new Date();
  }

// Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

// Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    const start = formatDate(event.startTime, 'medium', this.locale);
    const end = formatDate(event.endTime, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }

// Time slot was clicked
  onTimeSelected(ev) {
    const selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }
}
