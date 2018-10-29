import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { RoomsListService } from '../rooms-list.service';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { trigger, state, transition, style, animate, stagger, query } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';

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
  selectedRowForEdit: any;
  editTimeFrom: any;
  editTimeTo: any;
  eventName: any;
  editBookingForm: any;
  editBookingItem: any;
  fromTimeError: string;
  toTimeError: string;
  showAvailability: any;
  myBookings = false;
  bookNow = true;
  myBookingsTab = false;
  bookNowTab = true;
  showAvailable: any;

  isLoading = true;

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
    private fb: FormBuilder,
    private toastr: ToastrService
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

    this.editBookingForm = fb.group({
      'editRoomName': [null, Validators.compose(
        [Validators.required]
      )],
      'editMeetingName': [null, Validators.compose(
        [Validators.required]
      )],
      'editFromDate': [null, Validators.compose(
        [Validators.required]
      )],
      'editToDate': [null, Validators.compose(
        [Validators.required]
      )],
      'editFromTime': [null, Validators.compose(
        [Validators.required]
      )],
      'editToTime': [null, Validators.compose(
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
    this.isLoading = true;
    this.roomListService.getRooms()
      .subscribe(data => {
        this.rooms = data;
        this.isLoading = false;
      });
  }

  // get room name by id
  getRoomNameById(roomId) {
    const bookedRoomName = this.rooms.filter(room => room.id === roomId);
    return bookedRoomName[0].roomName;
  }



  deleteItem(id, conferenceId) {

    this.showMap = false;

    this.roomListService.deleteBookings(id).subscribe((data) => {
      this.showDeleteSuccess();
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
    this.isLoading = true;
    this.roomListService.getPreviousBookings(user)
      .subscribe((data) => {
        this.previousBookings = data;
        this.isLoading = false;
        console.log(this.previousBookings.length);
      });
  }

  // get bookings data for selected date range
  getAllRoomBookings(fromDate, toDate) {
    this.isLoading = true;
    this.roomListService.getAllRoomBookings()
      .subscribe(
        (data) => {
          this.isLoading = false;
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
    this.isLoading = true;
    this.roomListService.getBookings(selectedRoom)
      .subscribe((data) => {
        this.isLoading = false;
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
    this.isLoading = true;
    this.isAccordianOpen = true;
    this.dateTimeForm.reset();
    this.dateTimeForm.get('bookingDateFrom').setValue(this.fromMinDate);
    this.dateTimeForm.get('bookingDateTo').setValue(this.toMinDate);

    const roomStatus = {
      'roomStatus': 'booked'
    };
    this.roomListService.updateRoomStatus(roomId, roomStatus).subscribe(
      data => {
        this.isLoading = false;
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
    this.selectedRowForEdit = '';
    this.selectedRoom = null;
    const fromDate = dateTimeForm.bookingDateFrom.toLocaleDateString('en-GB');
    const toDate = dateTimeForm.bookingDateTo.toLocaleDateString('en-GB');
    this.getAllRoomBookings(fromDate, toDate);
    this.showMap = true;
    this.editBookingForm.markAsPristine();
  }

  editDate(booking, editForm) {
    this.showAvailability = '';
    this.dateWiseBookings = [];
    this.selectedRowForEdit = '';
    this.editBookingItem = booking;
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
    // this.dateTimeForm.get('bookingDateFrom').setValue(bookedFromDate);
    // this.dateTimeForm.get('bookingDateTo').setValue(bookedToDate);
    this.selectedRowForEdit = booking.id;
    this.editBookingForm.get('editRoomName').setValue(booking.conferenceId);
    this.editBookingForm.get('editMeetingName').setValue(booking.meetingName);
    this.editBookingForm.get('editFromDate').setValue(bookedFromDate);
    this.editBookingForm.get('editToDate').setValue(bookedToDate);
    this.editBookingForm.get('editFromTime').setValue(booking.bookedTimeFrom);
    this.editBookingForm.get('editToTime').setValue(booking.bookedTimeTo);
    this.editBookingForm.markAsPristine();
  }

  checkAvailability(editBookingForm){
    this.showAvailability = this.editBookingForm.controls.editRoomName.value;
    this.selectedRoom = this.rooms[parseInt(this.editBookingForm.controls.editRoomName.value) - 1];
    let editfromDate = editBookingForm.controls.editFromDate.value.toLocaleDateString('en-GB');
    let edittoDate = editBookingForm.controls.editToDate.value.toLocaleDateString('en-GB');
    this.getBookings(this.selectedRoom, editfromDate, edittoDate);
  }

  saveEditedForm(id, conferenceId, editBookingForm){
    this.isAccordianOpen = false;
    this.isLoading = true;
    const editBookingFormData = {
      'conferenceId': parseInt(editBookingForm.editRoomName, 10),
      'bookedBy': localStorage.getItem('loggedInUser'),
      'meetingName': editBookingForm.editMeetingName,
      'bookedDateFrom': editBookingForm.editFromDate.toLocaleDateString('en-GB'),
      'bookedDateTo': editBookingForm.editToDate.toLocaleDateString('en-GB'),
      'bookedTimeFrom': editBookingForm.editFromTime,
      'bookedTimeTo': editBookingForm.editToTime
    };

    this.roomListService.addBooking(editBookingForm.editRoomName, editBookingFormData).subscribe(
      data => {
        this.isLoading = false;
        this.selectedRowForEdit = '';
        const roomStatus = {
          'roomStatus': 'booked'
        };
        this.deleteItem(id, conferenceId);
        this.roomListService.updateRoomStatus(editBookingForm.editRoomName, roomStatus).subscribe(
          updateData => {
            this.getPreviousBookings(localStorage.getItem('loggedInUser'));
            this.showSuccess(editBookingFormData);
          }
        );
      }
    );
    this.editBookingForm.markAsPristine();

  }

  showDeleteSuccess() {
    this.toastr.warning('Deleted selected entry from your bookings!', 'Deleted',
      { positionClass: 'toast-top-full-width', closeButton: true, timeOut: 5000 });
  }

  showSuccess(postData) {
    this.toastr.success(
      `Details have been updated`, 'Edit Successful!',
      { positionClass: 'toast-top-full-width', closeButton: true, timeOut: 5000 }
    );
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

  timeChanged(fromTime, toTime) {
    this.fromTimeError = '';
    this.toTimeError = '';

    const fromTimeDay = new Date(fromTime);
    const fromTimeHour = fromTimeDay.getHours();
    const fromTimeMinutes = fromTimeDay.getMinutes();

    const toTimeDay = new Date(toTime);
    const toTimeHour = toTimeDay.getHours();
    const toTimeMinutes = toTimeDay.getMinutes();

    if (fromTimeHour > toTimeHour) {
      this.fromTimeError = 'From time can not be more than or equal To Time';
    } else if (fromTimeHour === toTimeHour && fromTimeMinutes >= toTimeMinutes) {
      this.fromTimeError = 'From time can not be more than or equal To Time';
    }

    let isRoomBooked = false;

    for (const booking of this.dateWiseBookings) {
      // if (booking.bookedBy === localStorage.getItem('loggedInUser')){
      //   alert('bookedByAdmin');
      // }
      const bookingFromTimeDay = new Date(booking.bookedTimeFrom);
      const bookingFromTimeHour = bookingFromTimeDay.getHours();
      const bookingFromTimeMinutes = bookingFromTimeDay.getMinutes();

      const bookingToTimeDay = new Date(booking.bookedTimeTo);
      const bookingToTimeHour = bookingToTimeDay.getHours();
      const bookingToTimeMinutes = bookingToTimeDay.getMinutes();

      if (fromTimeHour === bookingFromTimeHour && fromTimeMinutes === bookingFromTimeMinutes) {
        if (isRoomBooked === false) {
          this.fromTimeError = 'From time can not be same as booked from time';
          isRoomBooked = true;
        }
      } else if (toTimeHour === bookingToTimeHour && toTimeMinutes === bookingToTimeMinutes) {
        if (isRoomBooked === false) {
          this.toTimeError = 'To time can not be same as booked to time';
          isRoomBooked = true;
        }
      }

      if (fromTimeHour < (bookingFromTimeHour && bookingToTimeHour) &&
        toTimeHour > (bookingFromTimeHour && bookingToTimeHour)
      ) {
        if (isRoomBooked === false) {
          this.fromTimeError = 'Selected date includes already booked date range';
          isRoomBooked = true;
        }
      }

      if (fromTimeHour < (bookingFromTimeHour && bookingToTimeHour) &&
        (
          (toTimeHour === bookingFromTimeHour) &&
          (toTimeHour === bookingToTimeHour && toTimeMinutes >= bookingToTimeMinutes)
        )
      ) {
        if (isRoomBooked === false) {
          this.fromTimeError = 'Selected date includes already booked date range';
          isRoomBooked = true;
        }
      }

      if (fromTimeHour < (bookingFromTimeHour && bookingToTimeHour) &&
        (
          (toTimeHour === bookingFromTimeHour && toTimeMinutes > bookingFromTimeMinutes) &&
          (toTimeHour === bookingToTimeHour && toTimeMinutes < bookingToTimeMinutes)
        )
      ) {
        if (isRoomBooked === false) {
          this.fromTimeError = 'Selected date includes already booked date range';
          isRoomBooked = true;
        }
      }

      if (
        fromTimeHour === bookingFromTimeHour && toTimeHour === bookingToTimeHour &&
        (fromTimeMinutes < bookingFromTimeMinutes && fromTimeMinutes < bookingToTimeMinutes && toTimeMinutes > bookingFromTimeMinutes
          && toTimeMinutes < bookingToTimeMinutes)
      ) {
        if (isRoomBooked === false) {
          this.fromTimeError = 'Selected date includes already booked date range';
          isRoomBooked = true;
        }
      }

      if (
        fromTimeHour === bookingFromTimeHour && toTimeHour === bookingToTimeHour &&
        (fromTimeMinutes < bookingFromTimeMinutes && fromTimeMinutes < bookingToTimeMinutes && toTimeMinutes > bookingFromTimeMinutes
          && toTimeMinutes > bookingToTimeMinutes)
      ) {
        if (isRoomBooked === false) {
          this.fromTimeError = 'Selected date includes already booked date range';
          isRoomBooked = true;
        }
      }

      if (
        fromTimeHour === bookingFromTimeHour && toTimeHour === bookingToTimeHour
      ) {
        if (fromTimeMinutes > bookingFromTimeMinutes && fromTimeMinutes < bookingToTimeMinutes) {
          if (toTimeMinutes > bookingFromTimeMinutes && toTimeMinutes < bookingToTimeMinutes) {
            if (isRoomBooked === false) {
              this.fromTimeError = 'Selected date includes already booked date range';
              isRoomBooked = true;
            }
          }
        }
      }

      if (
        fromTimeHour === bookingFromTimeHour && toTimeHour === bookingToTimeHour
      ) {
        if (fromTimeMinutes > bookingFromTimeMinutes && fromTimeMinutes < bookingToTimeMinutes) {
          if (toTimeMinutes > bookingFromTimeMinutes && toTimeMinutes > bookingToTimeMinutes) {
            if (isRoomBooked === false) {
              this.fromTimeError = 'Selected date includes already booked date range';
              isRoomBooked = true;
            }
          }
        }
      }

      if (
        fromTimeHour === bookingFromTimeHour && toTimeHour > bookingToTimeHour
      ) {
        if (fromTimeMinutes > bookingFromTimeMinutes && fromTimeMinutes < bookingToTimeMinutes) {
          if (isRoomBooked === false) {
            this.fromTimeError = 'Selected date includes already booked date range';
            isRoomBooked = true;
          }
        }
      }

      if (
        fromTimeHour === bookingFromTimeHour && toTimeHour > bookingToTimeHour
      ) {
        if (fromTimeMinutes < bookingFromTimeMinutes && fromTimeMinutes < bookingToTimeMinutes) {
          if (isRoomBooked === false) {
            this.fromTimeError = 'Selected date includes already booked date range';
            isRoomBooked = true;
          }
        }
      }

    }

  }

}
