import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { RoomsListService } from '../rooms-list.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { trigger, state, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition(':enter, :leave', [
        animate('600ms ease-out')
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  rooms: any[];
  selectedRoom: any;
  roomBookedStatus: any;
  bookings: any[];
  allRoomBookings: any[];
  parentSubject: Subject<any> = new Subject();
  previousBookings: any[];
  fromToDateError: boolean;
  dateWiseBookings: any[];
  toMinDate: Date;
  toMaxDate: Date;
  fromMinDate: Date;
  fromMaxDate: Date;
  dateTimeForm: FormGroup;
  user: string;
  showMap: boolean;
  isAccordianOpen = true;
  locationSubscription;

  editTimeFrom: any;
  editTimeTo: any;
  eventName: any;

  myBookings = false;
  bookNow = true;
  myBookingsTab = false;
  bookNowTab = true;

  // Viewpreviousbook = false;
  // bookNow = true;
  // showMap: boolean;
  // singletab = true;
  // multipletab = false;

  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    console.log('Processing beforeunload...');
    event.returnValue = false;
  }

  canDeactivate() {
    return confirm('Do you really want to leave?');
  }

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

    this.dateTimeForm = fb.group({
      'bookingDateFrom': [this.fromMinDate, Validators.compose(
        [Validators.required]
      )],
      'bookingDateTo': [this.fromMinDate, Validators.compose(
        [Validators.required]
      )]
    });

  }

  ngOnInit() {
    this.getRooms();
    this.getPreviousBookings(localStorage.getItem('loggedInUser'));
    this.user = localStorage.getItem('loggedInUser');
  }

  ngOnDestroy() {
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

  deleteItem(id, conferenceId) {

    this.showMap = false;

    this.roomListService.deleteBookings(id).subscribe((data) => {

      this.roomListService.getPreviousBookings(localStorage.getItem('loggedInUser'))
        .subscribe((previousBookings) => {
          this.previousBookings = previousBookings;
          const previousBookingByConferenceId = this.previousBookings.filter(booking => booking.conferenceId === conferenceId);
          if (previousBookingByConferenceId.length === 0) {
            const roomStatus = {
              'roomStatus': 'not booked'
            };
            this.roomListService.updateRoomStatus(conferenceId, roomStatus).subscribe(
              jsonData => {
                this.selectedRoom = null;
                for (const room of this.rooms) {
                  if (conferenceId === room.id) {
                    room.roomStatus = 'not booked';
                  }
                }
              }
            );
          }
        });

    });
  }

  // get bookings data for selected room
  getPreviousBookings(user) {
    this.roomListService.getPreviousBookings(user)
      .subscribe((data) => {
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
    this.isAccordianOpen = true;
    this.dateTimeForm.reset();
    this.dateTimeForm.get('bookingDateFrom').setValue(this.fromMinDate);
    this.dateTimeForm.get('bookingDateTo').setValue(this.toMinDate);

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

  selectDateTime(dateTimeForm) {
    this.isAccordianOpen = false;
    this.selectedRoom = null;
    const fromDate = dateTimeForm.bookingDateFrom.toLocaleDateString('en-GB');
    const toDate = dateTimeForm.bookingDateTo.toLocaleDateString('en-GB');
    this.getAllRoomBookings(fromDate, toDate);
    this.showMap = true;
  }

  editDate(booking) {
    this.bookConference();
    this.selectedRoom = null;
    this.getAllRoomBookings(booking.bookedDateFrom, booking.bookedDateTo);
    const splitBfd = booking.bookedDateFrom.split('/');
    const bookedFromDate = new Date();
    bookedFromDate.setDate(splitBfd[0]);
    bookedFromDate.setMonth(splitBfd[1] - 1);
    bookedFromDate.setFullYear(splitBfd[2]);
    const splitTfd = booking.bookedDateTo.split('/');
    const bookedToDate = new Date();
    bookedToDate.setDate(splitTfd[0]);
    bookedToDate.setMonth(splitTfd[1] - 1);
    bookedToDate.setFullYear(splitTfd[2]);
    this.dateTimeForm.get('bookingDateFrom').setValue(bookedFromDate);
    this.dateTimeForm.get('bookingDateTo').setValue(bookedToDate);
    this.editTimeFrom = booking.bookedTimeFrom;
    this.editTimeTo = booking.bookedTimeTo;
    this.eventName = booking.meetingName;
    this.showMap = true;
    this.showRoomDetails(booking.conferenceId - 1);
  }

  // bookConference() {
  //   this.Viewpreviousbook = false;
  //   this.multipletab = false;
  //   this.singletab = true;
  //   this.bookNow = true;
  // }
  // viewPreviousbookings() {
  //   this.bookNow = false;
  //   this.singletab = false;
  //   this.multipletab = true;
  //   this.Viewpreviousbook = true;
  // }

  bookConference() {
    this.bookNowTab = true;
    this.myBookingsTab = false;
    this.myBookings = false;
    this.bookNow = true;
    this.app.detectChanges();
  }
  viewPreviousbookings() {
    this.bookNowTab = false;
    this.myBookingsTab = true;
    this.bookNow = false;
    this.myBookings = true;
  }

}
