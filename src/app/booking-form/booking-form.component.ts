import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { RoomsListService } from '../rooms-list.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit, OnDestroy {

  @Input() jsonData: any;
  @Input() dateTimeForm: any;
  @Input() selectedRoom: any;
  @Input() parentSubject: Subject<any>;
  @Output() roomBooked = new EventEmitter();

  rForm: FormGroup;

  constructor(private fb: FormBuilder, private roomListService: RoomsListService, private toastr: ToastrService) {
    this.rForm = fb.group({
      'meetingName': [null, Validators.compose(
        [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
        ]
      )]
    });
  }

  // Post booking data to the database
  addPost(post) {
    // create data to be posted to database
    // id is omitted, json server will create id
    const postData = {
      'conferenceId': this.selectedRoom.id,
      'bookedBy': localStorage.getItem('loggedInUser'),
      'meetingName': post.meetingName,
      'bookedDateFrom': this.dateTimeForm.value.bookingDateFrom.toLocaleDateString('en-GB'),
      'bookedDateTo': this.dateTimeForm.value.bookingDateTo.toLocaleDateString('en-GB'),
      'bookedTimeFrom': this.dateTimeForm.value.bookedTimeFrom.toLocaleTimeString('en-GB'),
      'bookedTimeTo': this.dateTimeForm.value.bookedTimeTo.toLocaleTimeString('en-GB')
    };
    console.log(postData);
    this.roomListService.addBooking(this.selectedRoom.id, postData).subscribe(
      data => {
        console.log(data);
        this.showSuccess(postData);
        this.roomBooked.emit(this.selectedRoom.id);
      }
    );
    this.rForm.reset();
  }

  showSuccess(postData) {
    this.toastr.success(
      `Room ${this.selectedRoom.roomName} is booked on date
      ${postData.bookedDateFrom} to ${postData.bookedDateTo} from ${postData.bookedTimeFrom} to
      ${postData.bookedTimeTo}`, 'Booking Successful!',
      { positionClass: 'toast-top-center', closeButton: true }
    );
  }

  ngOnInit() {
    // set booking form Room Name value to selected room change
    this.parentSubject.subscribe(event => {
      console.log();
    });

    console.log(this.dateTimeForm);

  }

  ngOnDestroy() {
    // unsubscribe to parent subject
    this.parentSubject.unsubscribe();
  }


}
