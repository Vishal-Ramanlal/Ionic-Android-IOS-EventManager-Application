import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  pages = [
    {
      title: 'Home',
      url: '/menu/home',
      icon: 'home'
    },
    {
      title: 'Todo List',
      url: '/menu/todo',
      icon: 'home'
    },
    {
      title: 'Calender',
      url: '/menu/calender',
      icon: 'home'
    },
  ];
  constructor() { }

  ngOnInit() {
  }

}
