import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';
import {AuthGuard} from '../../services/user/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/menu/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MenuPage,
    children: [
      { path: 'home', loadChildren: '../../home/home.module#HomePageModule', canActivate: [AuthGuard]},
      { path: 'todo', loadChildren: '../event-list/event-list.module#EventListPageModule', canActivate: [AuthGuard] },
      { path: 'calender', loadChildren: '../calandar/calandar.module#CalandarPageModule', canActivate: [AuthGuard] },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
