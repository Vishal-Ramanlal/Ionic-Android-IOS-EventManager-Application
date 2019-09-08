import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event/event.service';
import {
  ToastController,
  Platform
} from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  LatLng,
  GoogleMapsAnimation,
  MyLocation
} from '@ionic-native/google-maps';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.page.html',
  styleUrls: ['./event-create.page.scss']
})
export class EventCreatePage implements OnInit {

  map: GoogleMap;
  address: string;
   marker: Marker;

  eventName: string;
  description: string;
  startTime: any;
  endTime: any;
  // address: any;
  constructor(private router: Router, private eventService: EventService, public toastCtrl: ToastController,
              private platform: Platform) {}

  ngOnInit() {
    this.platform.ready();
    this.loadMap();
  }
  ngOnDestroy() {
    this.map.destroy();

  }
  loadMap() {
    this.map = GoogleMaps.create('map', {

    });
    this.map.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
          console.log('Map is ready!');

          this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((params: any[]) => {
            const latLng: LatLng = params[0];
            if (this.marker != null) {
              this.marker.remove();
            }

            this.marker = this.map.addMarkerSync({
              position: latLng,
              title: latLng.toString(),
              animation: GoogleMapsAnimation.DROP
            });
          });
        });
    this.goToMyLocation();
  }
  goToMyLocation() {
    this.map.clear();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      console.log(JSON.stringify(location, null , 2));

      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        duration: 5000
      });

 /*     // add a marker
      const marker: Marker = this.map.addMarkerSync({
        title: '@ionic-native/google-maps plugin!',
        snippet: 'This plugin is awesome!',
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });

      // show the infoWindow
      marker.showInfoWindow();

      // If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.showToast('clicked!');
      });*/

      this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
          (data) => {
            console.log('Click MAP', data);
          }
      );

    })
        .catch(err => {
          // this.loading.dismiss();
          this.showToast(err.error_message);
        });
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  createEvent(): void {
    if (
      this.eventName === undefined ||
        this.description === undefined ||
        this.startTime === undefined ||
        this.endTime === undefined ||
        this.marker === undefined
    ) {
      return;
    }
    this.eventService
      .createEvent(this.eventName, this.description, this.startTime, this.endTime,this.marker.getPosition().lat, this.marker.getPosition().lng)
      .then(() => {
        this.router.navigateByUrl('/menu');
      });
  }

  onButtonClick($event: MouseEvent) {

  }
}
