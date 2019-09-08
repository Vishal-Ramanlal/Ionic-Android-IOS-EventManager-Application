import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.page.html',
  styleUrls: ['./event-list.page.scss']
})
export class EventListPage implements OnInit {
  public eventList: Array<any>;
  public sortedList: Array<any>;
  public weekday: Array<any>;
  public today: any;
  public tommorow: any;
  constructor(private eventService: EventService) {}
  ngOnInit() {

  }
  ionViewWillLeave() {
    this.eventList = [];
    this.sortedList = [];
    this.weekday = [];
  }
  ionViewWillEnter() {
    function createDays() {
      const weekday = new Array(7);
      weekday[0] =  'Sunday';
      weekday[1] = 'Monday';
      weekday[2] = 'Tuesday';
      weekday[3] = 'Wednesday';
      weekday[4] = 'Thursday';
      weekday[5] = 'Friday';
      weekday[6] = 'Saturday';
      return weekday;
    }
    this.today = new Date();
    this.tommorow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    this.weekday = createDays();
    const eventList = [];
    this.eventService
        .getEventList()
        .get()
        .then(eventListSnapshot => {
          eventListSnapshot.forEach(snap => {
            const time = snap.data().startTime;
            const date = new Date(time);
            const dayofWeek = this.weekday[date.getDay()];
            eventList.push({
              id: snap.id,
              name: snap.data().name,
              description: snap.data().description,
              startTime: snap.data().startTime,
              day: dayofWeek,
              // date: new Date(snap.data().startTime).getFullYear()
              // date: new Date(snap.data().startTime)
            });
            eventList.sort(function (a, b) {
              // console.log('ji');
              return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
            });
            this.eventList = eventList;
            return false;
          });
        });
  }
  doRefresh(event) {
    console.log('Begin async operation');
    this.ionViewWillEnter();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }

}
