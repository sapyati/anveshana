import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { RoomsListService } from '../rooms-list.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit, OnDestroy {

  @Input() jsonData: any;
  @Input() selectedRoom: any;
  @Input() parentSubject: Subject<any>;
  @Output() roomBooked = new EventEmitter();

  rForm: FormGroup;

  constructor(private fb: FormBuilder, private roomListService: RoomsListService) {
    this.rForm = fb.group({
      'roomName': this.selectedRoom,
      'meetingName': [null, Validators.compose(
        [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
        ]
      )],
      'bookedDate' : '',
      'bookedTimeFrom' : '',
      'bookedTimeTo' : ''
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
      'bookedDate': post.bookedDate,
      'bookedTimeFrom': post.bookedTimeFrom,
      'bookedTimeTo': post.bookedTimeTo
    };
    console.log(postData);
    this.roomListService.addBooking(this.selectedRoom.id, postData).subscribe(
      data => {
        console.log(data);
        this.roomBooked.emit(this.selectedRoom.id);
      }
    );
    this.rForm.reset();
  }

  ngOnInit() {
    // set booking form Room Name value to selected room
    this.rForm.get('roomName').setValue(this.selectedRoom.roomName);

    // set booking form Room Name value to selected room change
    this.parentSubject.subscribe(event => {
      this.rForm.get('roomName').setValue(event.roomName);
      console.log(this.rForm.value.room);
    });

  }

  ngOnDestroy() {
    // unsubscribe to parent subject
    this.parentSubject.unsubscribe();
  }


}
