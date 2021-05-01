import { Component, OnInit } from '@angular/core';
import { IMenuItem } from '@core/interfaces/menu-item.interface';
import adminItemMenu from '@data/menus/admin.json';
@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  itemMenu: Array<IMenuItem> = adminItemMenu;
  constructor() { }

  ngOnInit(): void {
  }

}
