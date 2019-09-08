import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event/event.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, ToastController, Platform, LoadingController} from '@ionic/angular';
import {GoogleMaps, GoogleMap, GoogleMapsEvent, Marker, LatLng, GoogleMapsAnimation, MyLocation} from '@ionic-native/google-maps';
import {timeout} from 'rxjs/operators';
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss']
})
export class EventDetailPage implements OnInit {
  isLoading = false;

  map: GoogleMap;
  address: string;
  marker: Marker;
  location: LatLng = new LatLng(0, 0);
  public currentEvent: any = {};
  public eventID: string;
  public startTime: Date;
  public endTime: Date;
  private count: number;
  constructor(private alertCtrl: AlertController, private eventService: EventService, private route: ActivatedRoute,
    private router: Router, public toastCtrl: ToastController, private platform: Platform, public loadingController: LoadingController
  ) {}

  ngOnInit() {


  }
  async ionViewWillEnter() {
    this.count = 1;
    this.present();
    const eventId: string = this.route.snapshot.paramMap.get('id');
    this.eventService
        .getEventDetail(eventId)
        .get()
        .then(eventSnapshot => {
          this.currentEvent = eventSnapshot.data();
          this.currentEvent.id = eventSnapshot.id;
          this.startTime = eventSnapshot.data().startTime;
          this.endTime = eventSnapshot.data().endTime;
          this.location = new LatLng( eventSnapshot.data().eventLat, eventSnapshot.data().eventLng);
          console.log(this.location.lat + 'LNG: ' + this.location.lng);
          this.dismiss();
          this.eventID = eventId;
          this.platform.ready().then(r => {
            this.loadMap();
          });
        });

  }
  ionViewWillLeave() {

  }

   loadMap() {

    this.map = GoogleMaps.create('map', {
      camera: {
        target: this.location,
          zoom: 18,
          tilt: 30
        }
    });


    this.map.one(GoogleMapsEvent.MAP_READY)
        .then(() => {
          console.log('Map is ready!');

          this.marker = this.map.addMarkerSync({
            position: this.location,
            title: this.location.toString(),
            animation: GoogleMapsAnimation.DROP,

          });
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
            this.location = new LatLng( latLng.lat, latLng.lng);
          });

        });
    this.goToMyLocation();
  }

  async  goToMyLocation() {
    this.map.clear();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      console.log(JSON.stringify(location, null , 2));
      if (this.location === null) {
        this.location = location.latLng;
      }
      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: this.location,
        zoom: 17,
        duration: 5000
      });
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
  delete() {
    this.eventService.deleteItem(this.eventID).then(() => {
      this.present();
      timeout(1000);
      this.router.navigateByUrl('/menu');
      this.dismiss();
    });
  }

  async updateDescription() {
    const alert = await this.alertCtrl.create({
      subHeader: 'Edit Details',
      inputs: [
        {
          type: 'text',
          name: 'Description',
          placeholder: 'Edit Your Description',
          value: this.currentEvent.description
        },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.eventService.updateDescription(this.eventID, data.Description);
          }
        }
      ]
    });
    await alert.present();
  }
  doRefresh(event) {
    console.log('Begin async operation');
    this.ionViewWillEnter();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }
  updateStartTime(startTime: string) {
    if (startTime === undefined) {
      return;
    }
    this.eventService.updateStartTime(this.eventID, startTime);
  }

  updateEndTime(endTime: string) {
    if (endTime === undefined) {
      return;
    }
    this.eventService.updateEndTime(this.eventID, endTime);
  }

  saveMap() {
    if (this.location === undefined) {
      console.log("error ay");
      return;
    }
    this.eventService.updateLat(this.eventID, this.location.lat);
    this.eventService.updateLng(this.eventID,this.location.lng);
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
