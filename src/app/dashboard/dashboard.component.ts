import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RoomsListService } from '../rooms-list.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  allRoomBookings: any[];
  parentSubject: Subject<any> = new Subject();
  previousBookings: any[];
  fromToDateError: boolean;
  Viewpreviousbook = false;
  bookNow = true;
  showMap: boolean;
  singletab = true;
  multipletab =  false;
  dateWiseBookings: any[];
  bookingFromTime: Date = new Date();
  bookingToTime: Date = new Date();
  toMinDate: Date;
  toMaxDate: Date;
  fromMinDate: Date;
  fromMaxDate: Date;
  minTime: Date = new Date();
  dateTimeForm: FormGroup;

  constructor(
    private roomListService: RoomsListService,
    public app: ChangeDetectorRef,
    private fb: FormBuilder
    ) {

    this.toMinDate = new Date();
    this.toMaxDate = new Date();
    this.fromMinDate = new Date();
    this.fromMaxDate = new Date();
    this.toMinDate.setDate(this.fromMinDate.getDate());
    this.toMaxDate.setDate(this.fromMaxDate.getDate() + 14);
    this.fromMaxDate.setDate(this.fromMinDate.getDate() + 14);
    this.bookingToTime.setMinutes(this.bookingFromTime.getMinutes() + 5);
    this.minTime.setHours(this.bookingFromTime.getHours());
    this.minTime.setMinutes(this.bookingFromTime.getMinutes() + 5);

    this.dateTimeForm = fb.group({
      'bookingDateFrom': [this.fromMinDate, Validators.compose(
        [Validators.required]
      )],
      'bookingDateTo': [this.fromMinDate, Validators.compose(
        [ Validators.required ]
      )],
      'bookedTimeFrom': [this.bookingFromTime, Validators.compose(
        [Validators.required]
      )],
      'bookedTimeTo': [this.bookingToTime, Validators.compose(
        [Validators.required]
      )]
    });

  }

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

  deleteItem(id) {
     this.roomListService.deleteBookings(id).subscribe( () => console.log('room with id deleted'));
    this.previousBookings.forEach((value: any, index: number) => {
      if (id === value.id) {
          this.previousBookings.slice(0, index );
          console.log(this.previousBookings);
      }
  }); }
  // get bookings data for selected room
  getPreviousBookings(user) {
    this.roomListService.getPreviousBookings(user)
      .subscribe( (data) => {
        this.previousBookings = data;
        console.log(this.previousBookings.length);
      });
  }

  // get bookings data for selected date range
  getAllRoomBookings(fromDate, toDate) {
    this.roomListService.getAllRoomBookings()
      .subscribe(
        (data) => {
          this.allRoomBookings = data;
          if (this.allRoomBookings.length) {
            let isRoomBooked = false;
            for (const booking of this.allRoomBookings) {

              const bookedFromDate = booking.bookedDateFrom;
              const bookedToDate = booking.bookedDateTo;

              if (
                fromDate === bookedFromDate || fromDate === bookedToDate
                || toDate === bookedFromDate || toDate === bookedToDate
              ) {
                for (const room of this.rooms) {
                  if (booking.conferenceId === room.id) {
                    room.roomStatus = 'booked';
                    isRoomBooked = true;
                  }
                }
              } else if (toDate < bookedFromDate) {
                for (const room of this.rooms) {
                  if (booking.conferenceId === room.id && isRoomBooked === false) {
                    room.roomStatus = 'not booked';
                  }
                }
              } else if (fromDate > bookedToDate) {
                for (const room of this.rooms) {
                  if (booking.conferenceId === room.id && isRoomBooked === false) {
                    room.roomStatus = 'not booked';
                  }
                }
              } else if (fromDate > bookedFromDate && fromDate < bookedToDate && toDate > bookedFromDate) {
                for (const room of this.rooms) {
                  if (booking.conferenceId === room.id) {
                    room.roomStatus = 'booked';
                    isRoomBooked = true;
                  }
                }
              } else if (fromDate < bookedFromDate && toDate > bookedFromDate) {
                for (const room of this.rooms) {
                  if (booking.conferenceId === room.id) {
                    room.roomStatus = 'booked';
                    isRoomBooked = true;
                  }
                }
              }

            }
          } else {
            for (const room of this.rooms) {
              room.roomStatus = 'not booked';
            }
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }

  // get bookings data for selected room
  getBookings(selectedRoom, fromDate, toDate) {
    this.roomListService.getBookings(selectedRoom)
      .subscribe((data) => {
        this.bookings = data;
        this.dateWiseBookings = [];
        if (this.bookings.length) {
          for (const booking of this.bookings) {
            const bookedFromDate = booking.bookedDateFrom;
            const bookedToDate = booking.bookedDateTo;
            if (
              fromDate === bookedFromDate || fromDate === bookedToDate
              || toDate === bookedFromDate || toDate === bookedToDate
            ) {
              this.dateWiseBookings.push(booking);
            } else if (toDate < bookedFromDate) {
              const index = this.dateWiseBookings.indexOf(booking);
              if (index !== -1) {
                this.dateWiseBookings.splice(index, 1);
              }
            } else if (fromDate > bookedToDate) {
              const index = this.dateWiseBookings.indexOf(booking);
              if (index !== -1) {
                this.dateWiseBookings.splice(index, 1);
              }
            } else if (fromDate > bookedFromDate && fromDate < bookedToDate && toDate > bookedFromDate) {
              this.dateWiseBookings.push(booking);
            } else if (fromDate < bookedFromDate && toDate > bookedFromDate) {
              this.dateWiseBookings.push(booking);
            }
          }
        } else {
          this.dateWiseBookings = [];
        }
      });
  }

  // show selected room details
  showRoomDetails(roomNo) {
    this.selectedRoom = this.rooms[parseInt(roomNo, 10)];
    // get bookings details on select
    const fromDate = this.dateTimeForm.value.bookingDateFrom.toLocaleDateString('en-GB');
    const toDate = this.dateTimeForm.value.bookingDateTo.toLocaleDateString('en-GB');
    this.getBookings(this.selectedRoom, fromDate, toDate);
    // notify booking form component of the selected room
    this.notifyChildren(this.selectedRoom);
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

    this.dateTimeForm.reset();
    this.dateTimeForm.get('bookingDateFrom').setValue(this.fromMinDate);
    this.dateTimeForm.get('bookingDateTo').setValue(this.toMinDate);
    this.dateTimeForm.get('bookedTimeFrom').setValue(this.bookingFromTime);
    this.dateTimeForm.get('bookedTimeTo').setValue(this.bookingToTime);

    const roomStatus = {
      'roomStatus': 'booked'
    };
    this.roomListService.updateRoomStatus(roomId, roomStatus).subscribe(
      data => {
        this.selectedRoom = null;
      }
    );
    this.getPreviousBookings(localStorage.getItem('loggedInUser'));
    this.showMap = false;
  }

  fromDateChanged(fromDate) {
    this.toMinDate.setDate(fromDate.getDate());
    this.toMaxDate.setDate(fromDate.getDate() + 14);
    this.dateTimeForm.get('bookingDateTo').setValue(fromDate);
    this.showMap = false;
  }

  toDateChanged(toDate) {
    this.showMap = false;
  }

  fromTimeChanged(fromTime) {
    // this.showMap = false;
  }

  toTimeChanged(toTime) {
    // this.showMap = false;
  }

  selectDateTime(dateTimeForm) {
    this.selectedRoom = null;
    const fromDate = dateTimeForm.bookingDateFrom.toLocaleDateString('en-GB');
    const toDate = dateTimeForm.bookingDateTo.toLocaleDateString('en-GB');
    this.getAllRoomBookings(fromDate, toDate);
    this.showMap = true;
  }
  bookconference() {
    this.Viewpreviousbook = false;
    this.multipletab = false;
    this.singletab = true;
    this.bookNow = true;
  }
  viewPreviousbook() {
    this.bookNow = false;
    this.singletab = false;
    this.multipletab = true;
    this.Viewpreviousbook = true;
  }

}
