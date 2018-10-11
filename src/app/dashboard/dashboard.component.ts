import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RoomsListService } from '../rooms-list.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  rooms: any[];
  selectedRoom: any;
  roomBookedStatus: any;
  bookings: any[];
  parentSubject: Subject<any> = new Subject();
  previousBookings: any[];

  constructor(private roomListService: RoomsListService, public app: ChangeDetectorRef) { }

  ngOnInit() {
    this.getRooms();
    this.getPreviousBookings(localStorage.getItem('loggedInUser'));
  }

  // get rooms data
  getRooms() {
    this.roomListService.getRooms()
      .subscribe(data => this.rooms = data);
  }

  // get room name by id
  getRoomNameById(roomId) {
    const bookedRoomName = this.rooms.filter(room => room.id === roomId);
    return bookedRoomName[0].roomName;
  }

  // get bookings data for selected room
  getPreviousBookings(user) {
    this.roomListService.getPreviousBookings(user)
      .subscribe(data => this.previousBookings = data);
  }

  // get bookings data for selected room
  getBookings(selectedRoom) {
    this.roomListService.getBookings(selectedRoom)
      .subscribe(data => this.bookings = data);
  }

  // show selected room details
  showRoomDetails(roomNo) {
    this.selectedRoom = this.rooms[parseInt(roomNo, 10)];

    // notify booking form component of the selected room
    this.notifyChildren(this.selectedRoom);

    // get bookings details on select
    this.getBookings(this.selectedRoom);
  }

  // add active class to the selected room on svg (green border)
  isActive(item) {
    return this.selectedRoom === this.rooms[parseInt(item, 10)];
  }

  // notify booking form component of the selected room
  notifyChildren(selectedRoom) {
    this.parentSubject.next(selectedRoom);
  }

  // update room data on booking
  changeRoomStatus(roomId) {
    console.log(roomId);
    const roomStatus = {
      'roomStatus': 'booked'
    };
    this.roomListService.updateRoomStatus(roomId, roomStatus).subscribe(
      data => {
        console.log(data);
        const roomIndex = parseInt(roomId, 10) - 1;
        this.showRoomDetails(roomIndex);
        this.selectedRoom.roomStatus = 'booked';
        this.getPreviousBookings(localStorage.getItem('loggedInUser'));
      }
    );
  }

}
