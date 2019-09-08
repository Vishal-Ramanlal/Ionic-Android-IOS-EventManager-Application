import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CalandarPage } from './calandar.page';
import { CalendarModule} from 'ion2-calendar';
import { NgCalendarModule  } from 'ionic2-calendar';

const routes: Routes = [
  {
    path: '',
    component: CalandarPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    IonicModule,
    NgCalendarModule,
    CalendarModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CalandarPage]
})
export class CalandarPageModule {}
