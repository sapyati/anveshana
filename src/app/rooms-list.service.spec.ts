import { TestBed, inject } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { RoomsListService } from './rooms-list.service';

describe('RoomsListService (Mocked)', () => {

  const data = {
    'conferenceRooms': [
      {
        'id': 1,
        'roomName': 'Memphis',
        'roomStatus': 'not booked',
        'roomFullyBooked': false,
        'roomCapacity': '4pc',
        'roomFacilities': [
          'AC',
          'TV',
          'Adapters & Cables',
          'Audio/Speakers'
        ]
      },
      {
        'id': 2,
        'roomName': 'Liege',
        'roomStatus': 'not booked',
        'roomFullyBooked': false,
        'roomCapacity': '4pc',
        'roomFacilities': [
          'AC',
          'TV',
          'Internet',
          'Conference Phone',
          'Projectors'
        ]
      },
      {
        'id': 3,
        'roomName': 'Colorado',
        'roomStatus': 'not booked',
        'roomFullyBooked': false,
        'roomCapacity': '4pc',
        'roomFacilities': [
          'AC',
          'TV',
          'Internet',
          'Conference Phone',
          'Projectors'
        ]
      },
      {
        'id': 4,
        'roomName': 'Mumbai',
        'roomStatus': 'not booked',
        'roomFullyBooked': false,
        'roomCapacity': '4pc',
        'roomFacilities': [
          'AC',
          'TV',
          'Internet',
          'Conference Phone',
          'Projectors'
        ]
      },
      {
        'id': 5,
        'roomName': 'Amsterdam',
        'roomStatus': 'booked',
        'roomFullyBooked': false,
        'roomCapacity': '4pc',
        'roomFacilities': [
          'AC',
          'TV',
          'Adapters & Cables',
          'Audio/Speakers'
        ]
      },
      {
        'id': 6,
        'roomName': 'Chennai',
        'roomStatus': 'not booked',
        'roomFullyBooked': false,
        'roomCapacity': '4pc',
        'roomFacilities': [
          'AC',
          'TV',
          'Internet',
          'Conference Phone',
          'Projectors'
        ]
      },
      {
        'id': 7,
        'roomName': 'Pune',
        'roomStatus': 'not booked',
        'roomFullyBooked': false,
        'roomCapacity': '4pc',
        'roomFacilities': [
          'AC',
          'TV',
          'Adapters & Cables',
          'Audio/Speakers'
        ]
      },
      {
        'id': 8,
        'roomName': 'Mysore',
        'roomStatus': 'not booked',
        'roomFullyBooked': false,
        'roomCapacity': '4pc',
        'roomFacilities': [
          'AC',
          'TV',
          'Adapters & Cables',
          'Audio/Speakers'
        ]
      }
    ],
    'roomBookings': [
      {
        'conferenceId': 5,
        'bookedBy': 'admin',
        'meetingName': 'test',
        'bookedDateFrom': '17/10/2018',
        'bookedDateTo': '17/10/2018',
        'bookedTimeFrom': '09:25:46',
        'bookedTimeTo': '09:30:46',
        'id': 1
      }
    ]
  };

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpClientTestingModule,
        RoomsListService
      ]
    });

  });

  describe('getEmployees()', () => {

    it('expects service to fetch data',
      inject([HttpTestingController, RoomsListService],
        (httpMock: HttpTestingController, service: RoomsListService) => {
          // We call the service
          service.getRooms().subscribe(response => {
            expect(response.length).toBe(8);
          });
          // We set the expectations for the HttpClient mock
          const req = httpMock.expectOne('http://localhost:3000/conferenceRooms');
          expect(req.request.method).toEqual('GET');
          // Then we set the fake data to be returned by the mock
          req.flush(data.conferenceRooms);
        })
    );

  });

  describe('getAllRoomBookings()', () => {

    it('expects service to fetch data',
      inject([HttpTestingController, RoomsListService],
        (httpMock: HttpTestingController, service: RoomsListService) => {
          // We call the service
          service.getAllRoomBookings().subscribe(response => {
            expect(response.length).toBe(1);
          });
          // We set the expectations for the HttpClient mock
          const req = httpMock.expectOne('http://localhost:3000/roomBookings');
          expect(req.request.method).toEqual('GET');
          // Then we set the fake data to be returned by the mock
          req.flush(data.roomBookings);
        })
    );

  });

  describe('getBookings(room)', () => {

    const selectedRoom = data.conferenceRooms[4];

    it('expects service to fetch data',
      inject([HttpTestingController, RoomsListService],
        (httpMock: HttpTestingController, service: RoomsListService) => {
          // We call the service
          service.getBookings(selectedRoom).subscribe(response => {
            expect(response.length).toBe(1);
          });
          // We set the expectations for the HttpClient mock
          const req = httpMock.expectOne('http://localhost:3000/roomBookings?conferenceId=' + selectedRoom.id);
          expect(req.request.method).toEqual('GET');
          // Then we set the fake data to be returned by the mock
          req.flush(data.roomBookings);
        })
    );

  });

  describe('getPreviousBookings(user)', () => {

    const user = 'admin';

    it('expects service to fetch data',
      inject([HttpTestingController, RoomsListService],
        (httpMock: HttpTestingController, service: RoomsListService) => {
          // We call the service
          service.getPreviousBookings(user).subscribe(response => {
            expect(response.length).toBe(1);
          });
          // We set the expectations for the HttpClient mock
          const req = httpMock.expectOne('http://localhost:3000/roomBookings?bookedBy=' + user);
          expect(req.request.method).toEqual('GET');
          // Then we set the fake data to be returned by the mock
          req.flush(data.roomBookings);
        })
    );

  });

  describe('addBooking(roomId, postData)', () => {

    const postData = {
      'conferenceId': 5,
      'bookedBy': 'admin',
      'meetingName': 'test',
      'bookedDateFrom': '20/10/2018',
      'bookedDateTo': '20/10/2018',
      'bookedTimeFrom': '09:25:46',
      'bookedTimeTo': '09:50:50'
    };

    it('expects service to fetch data',
      inject([HttpTestingController, RoomsListService],
        (httpMock: HttpTestingController, service: RoomsListService) => {
          // We call the service
          service.addBooking(postData.conferenceId, postData).subscribe(response => {
            expect(response.id).toBe(2);
          });
          // We set the expectations for the HttpClient mock
          const req = httpMock.expectOne('http://localhost:3000/roomBookings?conferenceId=' + postData.conferenceId);
          expect(req.request.method).toEqual('POST');
          // Then we set the fake data to be returned by the mock
          req.flush({
            'id': 2
          });
        })
    );

  });

  describe('updateRoomStatus(roomId, roomStatus)', () => {

    const roomId = 5;
    const roomStatus = {
      'roomStatus': 'booked'
    };

    it('expects service to fetch data',
      inject([HttpTestingController, RoomsListService],
        (httpMock: HttpTestingController, service: RoomsListService) => {
          // We call the service
          service.updateRoomStatus(roomId, roomStatus).subscribe(response => {
            expect(response).toEqual('booked');
          });
          // We set the expectations for the HttpClient mock
          const req = httpMock.expectOne('http://localhost:3000/conferenceRooms/' + roomId);
          expect(req.request.method).toEqual('PATCH');
          // Then we set the fake data to be returned by the mock
          req.flush(data.conferenceRooms[4].roomStatus);
        })
    );

  });

  describe('deleteBookings(bookingId)', () => {

    const bookingId = 1;

    it('expects service to fetch data',
      inject([HttpTestingController, RoomsListService],
        (httpMock: HttpTestingController, service: RoomsListService) => {
          // We call the service
          service.deleteBookings(bookingId).subscribe(response => {
            expect(response).toEqual([]);
          });
          // We set the expectations for the HttpClient mock
          const req = httpMock.expectOne('http://localhost:3000/roomBookings/' + bookingId);
          expect(req.request.method).toEqual('DELETE');
          // Then we set the fake data to be returned by the mock
          req.flush([]);
        })
    );

  });

});
