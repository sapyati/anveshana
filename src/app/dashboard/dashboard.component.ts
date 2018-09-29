import { Component, OnInit } from '@angular/core';
import { RoomsListService } from '../rooms-list.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  rooms: any[];
  selectedRoom: any[];

  constructor(private roomListService: RoomsListService) { }

  ngOnInit() {
    this.getRooms();
  }


  getRooms() {
    this.roomListService.getRooms()
      .subscribe(data => this.rooms = data);
  }

  showRoomDetails(roomNo) {
    this.selectedRoom = this.rooms[parseInt(roomNo, 10)];
  }

  isActive(item) {
    return this.selectedRoom === this.rooms[parseInt(item, 10)];
  }

}
