import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RoomsListService {

  constructor(private http: HttpClient) { }

  getRooms(): Observable<any> {
    const roomapiURL = 'http://localhost:3000/conferenceRooms';
    return this.http.get(roomapiURL)
      .pipe(
        tap(rooms => console.log(rooms)),
        catchError(this.handleError('getHeroes', []))
      );
  }

  getAllRoomBookings(): Observable<any> {
    const apiURL = `http://localhost:3000/roomBookings`;
    return this.http.get(apiURL)
      .pipe(
        tap(allRoomBookings => console.log(allRoomBookings)),
        catchError(this.handleError('allRoomBookings', []))
      );
  }

  getBookings(room): Observable<any> {
    const apiURL = 'http://localhost:3000/roomBookings?conferenceId=' + room.id;
    return this.http.get(apiURL)
      .pipe(
        tap(bookings => console.log(bookings)),
        catchError(this.handleError('getHeroes', []))
      );
  }

  getPreviousBookings(user): Observable<any> {
    const apiURL = 'http://localhost:3000/roomBookings?bookedBy=' + user;
    return this.http.get(apiURL)
      .pipe(
      tap(previousBookings => console.log(previousBookings)),
        catchError(this.handleError('previousBookings', []))
      );
  }

  addBooking(roomId, postData): Observable<any> {
    const apiURL = 'http://localhost:3000/roomBookings?conferenceId=' + roomId;
    return this.http.post(apiURL, postData, httpOptions)
      .pipe(
        catchError(this.handleError('addBooking', postData))
      );
  }

  // for updating room data on booking
  updateRoomStatus(roomId, roomStatus) {
    const apiURL = 'http://localhost:3000/conferenceRooms/' + roomId;
    return this.http.patch(apiURL, roomStatus, httpOptions)
      .pipe(
        catchError(this.handleError('addBooking', roomId))
      );
  }

  deleteBookings(bookingId) {
    const apiURL = 'http://localhost:3000/roomBookings/' + bookingId;
    return this.http.delete(apiURL, httpOptions)
      .pipe(
        catchError(this.handleError('addBooking', bookingId))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}

